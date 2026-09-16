# Walherb — Functional Requirements Specification (FRS)

| | |
|---|---|
| **Document** | Walherb Platform — Functional Requirements Specification |
| **Version** | 1.0 |
| **Status** | Baseline (approved for build) |
| **Date** | 19 June 2026 |
| **Owners** | Product, Architecture, Engineering, QA |
| **Audience** | Frontend, Backend, QA, Product, Operations, new joiners |
| **Source of truth** | This document. Where it conflicts with code, code is patched to match this doc unless a written change request supersedes it. |

> **How to read this document.** It is written so a developer with no access to a product manager can build the entire platform. Each module states **What / Why / How / Failure / Edge cases / Business rules / Acceptance criteria**. Anything marked **[RECOMMENDATION]** is a proposed default where the current product is silent — implement it unless a written decision overrides it. Anything marked **[CURRENT]** describes the behaviour already implemented in the React prototype (the demo app this spec was reverse-engineered from and forward-extended).

---

## Document Conventions

- **MUST / SHALL** — mandatory. **SHOULD** — strong default, deviation needs a written reason. **MAY** — optional.
- **Acceptance Criteria** use Gherkin (`Given / When / Then`).
- **State machines** are listed as `FROM → TO [trigger] {guard}`.
- **IDs**: `ORD-…` order, `PKG-…` package, `KYC-…` KYC, `RET-…` return, `RFD-…` refund, `TKT-…` support ticket, `ADDR-…` address, `TXN-…` payment transaction.
- **Currency**: INR (₹), minor units (paise) stored as integers in the DB; formatted to ₹ for display. All money math is integer paise.
- **Time**: stored UTC (ISO-8601), displayed in IST (Asia/Kolkata).
- **Prototype reality**: the existing app (Vite + React 18 + TypeScript + MUI v6) is **frontend-only with mock data and no backend**. This FRS specifies the **target production system**: the same frontend backed by real services. The "[CURRENT]" tags mark what the prototype already does.

## Glossary

| Term | Meaning |
|---|---|
| Facilitating importer | Walherb acts as importer-of-record on the customer's behalf for personal imports into India. |
| KYC | Know Your Customer — identity verification (PAN + Aadhaar) mandated for Indian personal imports. |
| Package | A physically shippable unit of an order; one order can split into many packages, each with its own carrier/tracking/status. |
| Duties-prepaid | Customs duty + import taxes are calculated and collected at checkout, so the customer pays nothing on delivery. |
| Landed price | Final all-inclusive INR price (product + shipping + duties + taxes − discounts). |
| Deep link | A real URL that resolves directly to a screen (`/search`, `/track-order/:id`, `/account/kyc`, legal pages). |

---

# SECTION 1 — PRODUCT OVERVIEW

## 1.1 Product Vision
Walherb is a **cross-border import commerce platform** that lets Indian households buy genuine American (and other international) wellness, beauty, bath, and baby-care products at a **single, all-inclusive INR price**, with **customs duties pre-paid**, **authenticity guaranteed**, and **import compliance (KYC) handled for them**. The vision: *"Order a trusted US product as easily as a domestic one — no grey market, no customs surprises, no weeks of uncertainty."*

## 1.2 Business Objectives
1. **Trust** — eliminate counterfeit risk via verified sourcing and authenticity guarantees.
2. **Price certainty** — show the true landed cost up front; zero charges at delivery.
3. **Compliance as a feature** — make legally-required KYC a smooth one-time step, not a blocker.
4. **Operational excellence** — multi-package, multi-carrier fulfilment with accurate tracking.
5. **Conversion** — reduce cart abandonment with Quick Checkout (Razorpay) and transparent costs.
6. **Retention** — returns/refunds/replacements that build confidence; "Buy again" loops.

## 1.3 Customer Problems Solved
| Problem | Walherb's answer |
|---|---|
| Grey-market sellers, fakes | Verified sourcing + authenticity guarantee + buyer protection. |
| Surprise customs charges | Duties & taxes calculated and pre-paid at checkout. |
| KYC/customs paperwork | Guided one-time KYC (PAN + Aadhaar upload) with status tracking. |
| Long, opaque delivery | Per-package tracking, ETAs, carrier visibility. |
| Confusing pricing | Landed INR price with full breakdown (items, shipping, duties, discounts). |
| No recourse on bad orders | 14-day returns, replacements, refunds. |

## 1.4 Target Audience
- **Primary:** Indian urban health-conscious shoppers (25–45) buying supplements, vitamins, skincare, baby care from trusted US brands.
- **Secondary:** Caregivers buying baby/kids products; beauty enthusiasts (K-beauty, skincare); fitness/sports-nutrition buyers.
- **Tertiary [RECOMMENDATION]:** B2B/bulk resellers (future), affiliate partners.
- **Constraints:** Customers must be ≥18 and able to complete KYC for import clearance.

## 1.5 Success Metrics (North-star + supporting)
| Metric | Definition | Target (Yr-1) [RECOMMENDATION] |
|---|---|---|
| Conversion rate | Orders / unique sessions | ≥ 2.5% |
| Cart abandonment | 1 − (checkouts completed / checkouts started) | ≤ 65% |
| KYC completion rate | Verified / KYC-started | ≥ 80% |
| KYC turnaround | Submission → decision (P50) | ≤ 24h, P95 ≤ 48h |
| On-time delivery | Delivered ≤ promised ETA | ≥ 90% |
| Return rate | Returns / delivered orders | ≤ 8% |
| Refund SLA | Approved → refund initiated | ≤ 48h |
| Repeat purchase rate | 90-day repeat buyers | ≥ 25% |
| NPS | Post-delivery survey | ≥ 45 |

## 1.6 Competitive Positioning
| Capability | **Walherb** | iHerb | Desertcart | Amazon (Global/IN) |
|---|---|---|---|---|
| Duties pre-paid, all-inclusive INR | **Yes (core)** | Partial (est. at checkout) | Yes | Varies (Import Fees Deposit) |
| Curated US wellness focus | **Yes** | Yes (broad) | No (everything) | No (everything) |
| Built-in India KYC for imports | **Yes (native)** | No | Partial | Partial |
| Per-package multi-carrier tracking | **Yes** | Limited | Yes | Yes |
| Authenticity guarantee + verified sourcing | **Yes (positioned)** | Yes | Partial | Mixed (3P sellers) |
| Premium curated UX | **Yes** | Functional | Functional | Functional |

## 1.7 Unique Selling Propositions (USPs)
1. **"Duties pre-paid, zero customs surprises."**
2. **"Authenticity guaranteed — verified sourcing only."**
3. **"We handle the import & KYC for you."**
4. **"One landed INR price, full breakdown, no hidden fees."**
5. **"Premium, curated, India-first experience."**

---

# SECTION 2 — SYSTEM ARCHITECTURE

## 2.1 Architectural Style
- **Frontend [CURRENT]:** SPA — Vite + React 18 + TypeScript + MUI v6. State-machine view routing in `App.tsx` (no React Router); deep links via History API. Cross-cutting state via React Context (`CartProvider`, `AuthProvider`).
- **Backend [RECOMMENDATION]:** Modular services behind an **API Gateway / BFF (Backend-for-Frontend)**. Start as a **modular monolith** (single deployable, clear module boundaries) and extract high-load modules (catalog/search, orders) into services as scale demands. Synchronous REST for request/response; an **event bus** (e.g. Kafka/SNS-SQS) for async domain events (order placed, payment captured, KYC decided, shipment updated).
- **Communication:** Frontend → BFF (REST/JSON, JWT auth). BFF → domain services (REST/gRPC). Services emit/consume domain events for choreography (e.g. payment.captured → order.confirm).

## 2.2 Layered Architecture (logical)

```text
┌───────────────────────────────────────────────────────────────────────────┐
│ CLIENT (Browser / future mobile)                                          │
│   React SPA · view switcher · contexts (Cart, Auth) · design system       │
└───────────────▲───────────────────────────────────────────────────────────┘
                │ HTTPS / JSON / JWT
┌───────────────┴───────────────────────────────────────────────────────────┐
│ EDGE: CDN (static + images) · WAF · API Gateway / BFF                     │
│   auth check · rate limit · request shaping · aggregation for the SPA     │
└───────────────▲───────────────────────────────────────────────────────────┘
                │
┌───────────────┴───────────────────────────────────────────────────────────┐
│ DOMAIN SERVICES                                                             │
│  Identity/Auth · Catalog · Search · Cart · Pricing/Duties · Checkout/Order  │
│  Payment · KYC · Fulfilment/Packages · Shipping/Tracking · Returns/Refunds  │
│  Notifications · Support/Ticketing · Content/CMS · Admin · Analytics        │
└───────────────▲───────────────────────────────────────────────────────────┘
                │ (sync REST/gRPC + async events on the bus)
┌───────────────┴───────────────────────────────────────────────────────────┐
│ DATA & INTEGRATIONS                                                         │
│  PostgreSQL (OLTP) · Redis (cache/session/cart) · OpenSearch (search)       │
│  Object storage (KYC docs, evidence, invoices) · Event bus · Data warehouse │
│  External: Razorpay · carriers (Delhivery/Shadowfax/…) · email/SMS/WhatsApp │
│            customs/broker API · Aadhaar/PAN verification provider           │
└───────────────────────────────────────────────────────────────────────────┘
```

## 2.3 Layer Responsibilities, Dependencies, Failure Handling

| Layer | Responsibility | Depends on | Failure handling |
|---|---|---|---|
| **Frontend** | Render UI, capture input, optimistic UX, deep links. | BFF | Graceful empty/error states; ret(retry) on transient 5xx; never lose cart (server-persisted). |
| **BFF/Gateway** | AuthN, rate-limit, aggregate, shape responses. | Domain services | Circuit-breakers + timeouts per upstream; return partial data with `degraded:true` flags. |
| **Identity/Auth** | Accounts, sessions, JWT, 2FA. | DB, email/SMS | Lockout on brute force; token refresh; revoke on sign-out. |
| **Catalog** | Products, variants, categories, brands, stock. | DB, Search (index feed) | Read replicas; cache; stale-while-revalidate. |
| **Search** | Index + query catalog. | Catalog events, OpenSearch | Fallback to DB keyword search if index down (the prototype's keyword fallback mirrors this). |
| **Pricing/Duties** | Landed price = items+shipping+duties+tax−discounts. | Catalog, customs/broker, tax rules | If duties API down → use cached HS-code duty table; flag estimate. |
| **Checkout/Order** | Create orders, orchestrate payment + fulfilment. | Pricing, Payment, Inventory | **Saga** with compensation (see 22.x). Idempotent order creation. |
| **Payment** | Razorpay integration, capture, refund. | Razorpay, Order | Verify signature; reconcile via webhooks; never trust client-only success. |
| **KYC** | Capture, store, verify identity docs. | Object storage, verification provider, Admin | Encryption at rest; review queue; resubmission loop. |
| **Fulfilment/Packages** | Split order into packages, assign carrier. | Order, carriers | Re-route on carrier outage; partial fulfilment. |
| **Shipping/Tracking** | Carrier label, status sync, ETA. | Carriers (webhook/poll) | Poll fallback if webhooks fail; mark "tracking unavailable". |
| **Returns/Refunds** | Eligibility, RMA, refund/replace. | Order, Payment, Fulfilment | Idempotent refunds; manual override path. |
| **Notifications** | Email/SMS/WhatsApp/in-app. | Providers, event bus | Retry queue; dead-letter; user prefs respected. |
| **Support** | Tickets, SLAs, escalations. | Order/KYC context | Auto-ack; SLA timers; fallback email intake. |
| **Content/CMS** | Legal/info pages, banners, FAQ. | DB | Cache; versioned content. |
| **Admin** | Internal ops tooling (see §18). | All services | RBAC; full audit log. |
| **Analytics** | Events, funnels, dashboards. | Event bus → warehouse | Async; no impact on transactional path. |
| **Scalability layer** | CDN, autoscaling, caching, read replicas, queue-based load levelling. | Infra | Horizontal scale; graceful degradation. |

## 2.4 Core Communication Flows (sequence summaries)
- **Place order:** SPA → BFF `POST /orders` → Order svc reserves inventory → calls Payment (Razorpay order) → client completes payment → Razorpay webhook → Payment verifies signature → emits `payment.captured` → Order confirms → emits `order.confirmed` → Fulfilment plans packages → Notifications send confirmation.
- **KYC:** SPA uploads docs → KYC svc stores (encrypted) + creates `KYC-…` → emits `kyc.submitted` → Admin/auto review → decision → emits `kyc.approved|rejected` → Notifications + unblock import.
- **Tracking:** Carrier webhook → Shipping svc normalises event → updates package status → emits `package.status.changed` → Notifications + UI refresh.

## 2.5 Future Scalability Layer
- Stateless services behind autoscaling; Redis for sessions/cart; OpenSearch for catalog search; CDN for static + product images; read replicas for catalog/order reads; event-driven async for non-critical paths; multi-region read replicas + object-storage replication for DR (RPO ≤ 15 min, RTO ≤ 1h **[RECOMMENDATION]**).

---

# SECTION 3 — USER ROLES & PERMISSIONS

## 3.1 Roles
| Role | Description |
|---|---|
| **Guest** | Unauthenticated visitor. |
| **Customer** | Registered shopper. |
| **KYC Reviewer** | Verifies identity documents. |
| **Operations** | Manages fulfilment, packages, carriers. |
| **Logistics** | Carrier coordination, tracking, exceptions. |
| **Support Agent** | Handles tickets, customer comms. |
| **Finance** | Refunds, reconciliation, payouts. |
| **Admin** | Full configuration + user management. |
| **Super Admin** | Admin + destructive/irreversible ops + role grants. |
| **System** | Automated jobs/webhooks (service accounts). |

## 3.2 Permission Matrix (C=Create, R=Read, U=Update, D=Delete, A=Approve)
| Resource | Guest | Customer | KYC Rev. | Ops | Logistics | Support | Finance | Admin |
|---|---|---|---|---|---|---|---|---|
| Browse catalog/search | R | R | R | R | R | R | R | R |
| Own cart | C/R/U/D (guest cart) | CRUD | – | – | – | R | – | R |
| Own profile/address/payment | – | CRUD | – | – | – | R | R | R |
| Place order | – | C | – | – | – | – | – | – |
| View any order | – | R(own) | R(KYC ctx) | R | R | R | R | R |
| Cancel order | – | U(own, pre-ship) | – | U | – | U | – | U |
| KYC submit | – | C/U(own) | – | – | – | – | – | – |
| KYC review/approve/reject | – | – | R/U/A | – | – | R | – | A |
| Package mgmt / carrier assign | – | – | – | CRU | RU | R | – | CRUD |
| Tracking update | – | R(own) | – | RU | CRU(System) | R | – | RU |
| Returns request | – | C(own) | – | R | – | RU | R | A |
| Returns approve | – | – | – | A | – | A | A | A |
| Refund initiate | – | – | – | – | – | – | C/A | A |
| Support tickets | – | C/R(own) | – | R | R | CRUD/A | R | A |
| Content/legal pages | R | R | R | R | R | R | R | CRUD |
| Product/category/pricing | – | – | – | R | – | R | RU(price) | CRUD |
| User/role management | – | – | – | – | – | – | – | CRUD(Super) |
| Analytics dashboards | – | – | – | R | R | R | R | R |

## 3.3 Restrictions & Principles
- **Least privilege**; deny-by-default. Every mutating admin action is **audited** (actor, before/after, timestamp, reason).
- **Separation of duties:** the person who **approves** a refund ≠ the person who **requested** it (Finance approves, Support requests) for amounts above ₹X **[RECOMMENDATION: ₹10,000]**.
- **KYC data access** is restricted to KYC Reviewers + Super Admin; access is logged and time-boxed.
- Customers can only ever read/modify **their own** resources (enforced server-side, not just UI).
- Service accounts (System) cannot log into the admin UI; they use scoped API keys.

---

# SECTION 4 — COMPLETE USER JOURNEYS

> Each journey lists **Entry → Happy path → Failure path → Alternative path → Exit conditions**. "[CURRENT]" marks behaviour already in the prototype.

## 4.1 Homepage
- **Entry:** App root `/`; logo click; "Walherb" wordmark.
- **Happy:** Promo bar → hero → product rails ("Trending") → why-us → FAQ → footer. User browses/clicks a product or category, or searches. [CURRENT]
- **Failure:** Catalog rail fails → show skeleton then "Couldn't load products — Retry." Hero image 404 → fallback gradient.
- **Alternative:** Deep-linked arrival to any route renders that screen directly.
- **Exit:** Navigates to product/category/search/account.

## 4.2 Search
- **Entry:** Header search field (desktop + mobile). [CURRENT]
- **Happy:** Type term → Enter/click magnifier → `/search?q=term` → results grid (matches title/brand/type/category). Click result → PDP. [CURRENT]
- **Failure:** No matches → friendly empty state with suggestions [CURRENT]. Search service down → fallback to DB keyword search; if total failure, "Search temporarily unavailable."
- **Alternative:** Empty query → no navigation. Query with only stopwords → broaden. **[RECOMMENDATION]** add autosuggest, recent searches, typo tolerance, synonyms.
- **Exit:** Opens a product, refines query, or leaves.

## 4.3 Browse Category
- **Entry:** Top nav, mega menu, or mobile drawer. [CURRENT]
- **Happy:** Category page → filter (brand/type/form/dietary/availability/rating/price), sort, paginate → click product. [CURRENT]
- **Failure:** Category empty → keyword-relevance fallback so grid is never blank [CURRENT]; if still empty, "No products in this category yet."
- **Alternative:** Menu-only categories with no exact products resolve via keyword fallback + friendly title [CURRENT].
- **Exit:** Opens a product or changes category.

## 4.4 Product Discovery
- **Entry:** Home rails, search, category, related-products, "Buy again".
- **Happy:** Sees card (image, title, rating, price, brand) → clicks → PDP.
- **Failure:** Image broken → placeholder; price missing → hide price, disable buy, log.
- **Exit:** PDP.

## 4.5 Product Details
- **Entry:** Any product card. [CURRENT]
- **Happy:** Gallery, "By: brand", rating, package options, landed price + discount, duties-included + international-shipping indicators, delivery estimate, buy box (qty, Buy Now/Add to Cart), sold-by + ⓘ modal, trust badges, details/specs, reviews, related. [CURRENT]
- **Failure:** Out of stock → disable Buy Now/Add, show "Out of Stock"/notify-me. Pricing/duties unavailable → show items price + "duties calculated at checkout" + flag.
- **Alternative:** Select a different pack size → price/stock/SKU update.
- **Exit:** Add to cart, Buy Now, or leave.

## 4.6 Add to Cart
- **Entry:** PDP "Add to Cart" / "Buy Now"; card "ADD". [CURRENT]
- **Happy:** Item added → cart drawer slides in with line + subtotal [CURRENT]. Buy Now adds then opens drawer.
- **Failure:** Stock changed mid-add → reject with "Only N left." Cart service down → retry; block checkout, keep local copy.
- **Alternative:** Adding an existing line increments qty (subject to max). Guest cart persists by cart token.
- **Exit:** Continue shopping or proceed to checkout.

## 4.7 Checkout
- **Entry:** Cart drawer → "Proceed to checkout." [CURRENT]
- **Happy:** Contact + delivery address → shipping method → payment method → review summary (items, shipping, duties, discounts, grand total) → place order. [CURRENT]
- **Failure:** Validation errors block submit; address un-serviceable → ask for alternative; price recheck mismatch → show new total, require re-confirm; **KYC required & not verified → block placement with CTA to KYC** (business rule, §9).
- **Alternative:** Quick Checkout opens Razorpay directly [CURRENT]. Edit address/shipping inline.
- **Exit:** Payment, or abandon (recoverable).

## 4.8 Payment
- **Entry:** Place order / Quick Checkout. [CURRENT: Razorpay modal simulated]
- **Happy:** Razorpay → success → signature verified server-side → order confirmed → confirmation screen/email.
- **Failure:** Declined/cancelled/timeout → order stays `PENDING_PAYMENT`; show "Payment failed — retry"; never confirm on client signal alone.
- **Alternative:** Retry up to N times; switch method; pay-later [RECOMMENDATION]; UPI/cards/netbanking/wallets via Razorpay.
- **Exit:** Confirmed order or abandoned (recoverable).

## 4.9 Order Placement
- **Entry:** Successful payment capture.
- **Happy:** Order `CONFIRMED`, inventory committed, packages planned, confirmation sent, appears in My Orders. [CURRENT: appears in mock My Orders]
- **Failure:** Payment captured but order-create fails → **auto-refund or auto-retry create** (saga, §22). Inventory gone post-payment → partial fulfil or refund unfulfillable lines.
- **Exit:** My Orders.

## 4.10 Order Tracking
- **Entry:** My Orders → "View Tracking History"; deep link `/track-order/:trackingNumber`. [CURRENT]
- **Happy:** Per-package timeline + ETA + carrier. [CURRENT]
- **Failure:** No carrier data yet → "Tracking will appear once shipped." Carrier feed down → last-known + "updates delayed."
- **Exit:** Back to order/orders.

## 4.11 Returns
- **Entry:** My Orders → "Return/Replace" (delivered, in-window). [CURRENT: 3-step wizard]
- **Happy:** Select items+qty → reason + photos → review → submit → RMA created. [CURRENT]
- **Failure:** Ineligible (window passed / non-returnable) → block with reason. Upload fails → retry.
- **Alternative:** Partial return; replacement instead of refund.
- **Exit:** RMA tracking under returns.

## 4.12 Refunds
- **Entry:** Approved return / cancellation / failed fulfilment.
- **Happy:** Refund initiated to original method; customer notified; status visible.
- **Failure:** Gateway refund fails → retry queue + manual Finance path; original method invalid → store credit [RECOMMENDATION].
- **Exit:** Refund `COMPLETED`.

## 4.13 KYC
- **Entry:** My Account → KYC; deep links `/account/kyc`, `/account/kyc/status`, `/account/kyc/verified`. [CURRENT]
- **Happy:** Form (name + PAN + Aadhaar upload) → submit → Under Review → Approved → Verified dashboard (status, timeline, customer details). [CURRENT]
- **Failure:** Rejected → reason + resubmit. Upload too large/invalid → inline error (10 MB cap, JPG/PNG/PDF) [CURRENT].
- **Exit:** Verified (unblocks import) or pending.

## 4.14 Account Management
- **Entry:** My Account (requires sign-in; signed-out click opens sign-in box). [CURRENT]
- **Happy:** Manage profile, addresses, payment methods, notifications, 2FA; view orders. [CURRENT]
- **Failure:** Save fails → inline error, no data loss. Session expired → re-auth, return to intent.
- **Exit:** Settings saved.

## 4.15 Notifications
- **Entry:** System events; notification preferences page. [CURRENT]
- **Happy:** Order/KYC/shipping/refund updates via chosen channels + in-app feed.
- **Failure:** Channel fails → retry/alternate; respect opt-outs.
- **Exit:** Read/cleared.

## 4.16 Support
- **Entry:** Footer "Customer Support" (chat/email/phone). [CURRENT: contact block]
- **Happy:** Start chat / email / call → ticket created → SLA-bound resolution.
- **Failure:** Chat offline → email fallback + ticket.
- **Exit:** Ticket resolved.

## 4.17 Legal Pages
- **Entry:** Footer links (`/about-us`, `/privacy-policy`, `/terms-and-conditions`, `/report-infringement`). [CURRENT]
- **Happy:** Read content; Report-Infringement form (policy accordion, email OTP, listing URLs, evidence upload, declaration) → submit → reference id. [CURRENT]
- **Failure:** Form validation blocks submit; OTP wrong → retry (demo code 123456) [CURRENT].
- **Exit:** Reference issued / content read.

---

# SECTION 5 — CATALOG MANAGEMENT

## 5.1 Entities
- **Product** — `id, slug, title, brandId, categoryId(s), description, specs[], images[], badges[], status, defaultVariantId`.
- **Variant (Package option)** — `id, productId, label (e.g. "120 Count"), sku, priceValue, originalValue, stock, weight, dims, hsCode`. [CURRENT: PDP package options]
- **Category** — tree: department → group → leaf (`id, label, parentId, slug`). [CURRENT: CATEGORY_TREE + mega-menu tree]
- **Brand** — `id, name, slug, verified, yearsActive`.
- **Inventory** — per-variant stock, reserved, available, backorder flag.

## 5.2 Categories & Subcategories
- Hierarchical tree; a product can map to one leaf + appear under ancestors. **[CURRENT gap]**: prototype has two trees (catalog `CATEGORY_TREE` vs richer mega-menu); production **MUST** unify into one canonical tree, with products carrying real leaf `categoryId`s spanning the full menu. Until then, **keyword-relevance fallback** ensures non-empty grids [CURRENT].

## 5.3 Pricing
- Display price is the **landed INR price** for the selected variant. Fields: `priceValue` (sale), `originalValue` (MRP/strike-through). Discount % = `round((original−price)/original×100)`. [CURRENT: PDP shows ₹ + strike + "Save X%"]
- Money stored in paise (int). Never float-math currency.

## 5.4 Discounts
- Types: percentage, flat amount, BOGO, threshold (spend ≥ X), promo-code. Precedence + stacking rules in §7.5.
- Each discount: `code?, type, value, scope(product/category/cart), min, max, startsAt, endsAt, usageLimit, perUserLimit, active`.

## 5.5 Badges
- `Best Seller, New Arrival, Sale, #1 in <category>`. Derived (sales rank/recency/discount) or manually pinned. [CURRENT: badges array on catalog products]

## 5.6 Stock Status
States: `IN_STOCK, LOW_STOCK (≤ threshold), OUT_OF_STOCK, BACKORDER, DISCONTINUED`. OOS disables Buy/Add and offers notify-me [RECOMMENDATION].

## 5.7 Search Indexing
- On product create/update/delete → emit event → reindex into OpenSearch. Indexed fields: title, brand, type, category path, badges, price, rating, availability. Synonyms + typo tolerance [RECOMMENDATION]. Fallback: DB keyword search [CURRENT pattern].

## 5.8 Filters
[CURRENT]: brand, type, form, dietary, availability, rating, price range. Multi-select within a facet = OR; across facets = AND; dietary = AND-of-all-selected. Server returns facet counts.

## 5.9 Sorting
Featured (default), price asc/desc, rating, newest, best-selling, discount %. [CURRENT: SORT_OPTIONS]

## 5.10 Recommendations & Related Products
- **Related:** same category/brand, complementary, "frequently bought together" [RECOMMENDATION].
- **Personalised:** based on history/cart [RECOMMENDATION, post-MVP].

## 5.11 Acceptance Criteria (Catalog)
- **AC-CAT-1** Given a product with a variant, When PDP loads, Then it shows price, original, discount %, stock, badges.
- **AC-CAT-2** Given an OOS variant, When selected, Then Buy/Add are disabled and "Out of Stock" shows.
- **AC-CAT-3** Given filters applied, When results return, Then only matching products show and facet counts reflect the filtered set.
- **AC-CAT-4** Given a category with no direct products, When opened, Then keyword-relevant products show (never an empty grid) and the heading reflects the category.
- **AC-CAT-5** Given a product update, When saved, Then the search index reflects it within ≤ 60s.

## 5.12 Edge Cases (Catalog)
- Product with no variants → not purchasable, hidden from listings.
- Price = 0 or null → exclude from buy flow, alert ops.
- Variant stock goes 0 while on PDP → live disable on refresh/add.
- Category deleted with products → reparent or mark uncategorised, never orphan.
- Duplicate SKU → reject at ingest.
- Image host expiry (the prototype's Figma-URL problem) → production stores images in object storage/CDN; **no external expiring URLs in production**.

---

# SECTION 6 — PRODUCT DETAILS PAGE (PDP)

## 6.1 Image Gallery
Main image + thumbnails; zoom/lightbox [RECOMMENDATION]. Lazy-load; fallback placeholder on error. [CURRENT: gallery in `ProductDetailPage.tsx`]

## 6.2 Pricing & Discount Logic
- Show landed `priceValue`, strike `originalValue`, "Save X% (₹Y)". X from §5.3. If no original → no strike. [CURRENT]
- Re-fetch price on variant change; price is authoritative from server at checkout (client price is display-only).

## 6.3 Authenticity Indicators
"Verified sourcing / authenticity guaranteed" trust elements; brand "By: {brand}" line. [CURRENT: "By: {brand}"]

## 6.4 International Shipping Indicators
"International Shipping — Ships from outside India" banner + "Learn more". [CURRENT]

## 6.5 Delivery Estimates
"Free Delivery {date range} to India", carrier hint, "Get Delivery Estimates". [CURRENT: `DeliveryEstimator`]. Production: compute ETA from origin + destination pincode + carrier SLAs.

## 6.6 Sold By Section + Modal
"Sold by: {seller}" + ⓘ → modal explaining sourcing (direct seller or equivalent authorised supplier; buyer protection). [CURRENT: `SoldByModal`]

## 6.7 Payment Methods Strip
Supported methods (cards/UPI/wallets via Razorpay) + Razorpay badge (inline SVG, asset-free). [CURRENT: `QuickPayBadge`, `PaymentMethods`]

## 6.8 Buy Now / Add to Cart / Quantity Logic
- **Buy Now [CURRENT, gold/green per design]:** add + go straight toward checkout/Quick Checkout.
- **Add to Cart [CURRENT]:** add + open drawer; shows "Added" state.
- **Quantity:** min 1, max = min(stock, perOrderCap **[RECOMMENDATION: 10]**); stepper disables at bounds. [CURRENT: `QuantitySelector`]

## 6.9 Trust Indicators
Feature/trust badges (International Shipping, Authentic Products, Duties Included, Fast Delivery, Easy Returns, Secure Payment) — MUI icons. [CURRENT]

## 6.10 FAQ & Reviews
- FAQ accordion. [CURRENT]
- Reviews: rating summary + breakdown bars + "Top Reviews" list. [CURRENT]. Production: real reviews (verified-purchase flag, moderation, helpful votes) [RECOMMENDATION].

## 6.11 Related Products
Rail of related items; click → PDP. [CURRENT]

## 6.12 Acceptance Criteria (PDP)
- **AC-PDP-1** Given a product, When PDP loads, Then gallery, brand, price/discount, stock, delivery estimate, sold-by, trust badges, details, reviews, related all render or degrade gracefully.
- **AC-PDP-2** Given variant change, When selected, Then price, stock, SKU, and delivery estimate update.
- **AC-PDP-3** Given "Add to Cart", When clicked, Then the item enters the cart and the drawer opens with correct line + subtotal.
- **AC-PDP-4** Given OOS, When viewing, Then purchase actions are disabled with clear messaging.
- **AC-PDP-5** Given the ⓘ next to Sold by, When clicked, Then the sourcing modal opens and closes via X/overlay/Esc.
- **AC-PDP-6** No PDP asset depends on an expiring external URL.

---

# SECTION 7 — CART SYSTEM

## 7.1 Operations
- **Add item** `{variantId, qty}` → validate stock → create/increment line. [CURRENT]
- **Remove item** → delete line. [CURRENT]
- **Update qty** → 1..max; 0 = remove. [CURRENT]
- **Clear cart**, **merge** (guest → user on sign-in).

## 7.2 Cart Model
`Cart{ id, userId?, token(guest), currency, lines[], promoCodes[], updatedAt }`; `Line{ variantId, sku, title, image, unitPrice, originalUnitPrice, qty, lineTotal }`. Server is source of truth; client mirrors. Persisted (Redis + DB) so it survives reloads and devices.

## 7.3 Price Calculation
`lineTotal = unitPrice × qty`. `itemsTotal = Σ lineTotal`. All paise. Unit price re-validated server-side at view + checkout; if changed, cart updates and flags the line.

## 7.4 Shipping / Tax / Duties Calculation
- **Shipping:** free above threshold **[RECOMMENDATION: free]** or computed by weight/destination.
- **Duties + import tax:** computed per line by HS code × destination rules (Pricing/Duties svc). Shown as "Duties & Taxes Included". [CURRENT: shown as "Included"]
- **GST/other:** as applicable. Breakdown always visible.

## 7.5 Discounts & Promo Codes
- Apply code → validate (active, window, min spend, usage/per-user limit, scope) → compute. [CURRENT: PromoCode field in drawer]
- **Stacking [RECOMMENDATION]:** one promo code per cart; automatic product/category discounts already in unit price; code applies on top to eligible subtotal. Never allow total < 0.
- Invalid/expired code → reject with reason; remove on eligibility loss.

## 7.6 Guest vs Logged-in Cart
- Guest cart keyed by secure cart token (cookie). On sign-in → **merge** (sum quantities, cap at max, dedupe by variant). [CURRENT: cart context]
- Cart never silently lost; conflicts resolved by max-stock cap.

## 7.7 Failure Handling
- Stock conflict on add/update → reject with available qty.
- Pricing svc down → keep last-known prices, flag "prices updating", allow browse, block checkout until refreshed.
- Cart svc down → client keeps local copy, retries; checkout disabled until reconciled.

## 7.8 Acceptance Criteria (Cart)
- **AC-CART-1** Add item → line appears with correct unit price and subtotal.
- **AC-CART-2** Update qty beyond stock → rejected with "Only N left".
- **AC-CART-3** Guest adds items, signs in → carts merge without loss.
- **AC-CART-4** Apply valid promo → totals recompute; invalid → clear error.
- **AC-CART-5** Reload page → cart persists (server-backed).
- **AC-CART-6** Grand total never negative; breakdown sums exactly to total.

## 7.9 Edge Cases
- Item OOS while in cart → mark unavailable, exclude from total, block checkout until removed.
- Price change while in cart → reflect + notify before checkout.
- Two tabs editing same cart → last-write-wins with version check (optimistic concurrency).
- Promo becomes invalid between apply and checkout → re-validate at order time, drop if invalid.

---

# SECTION 8 — CHECKOUT SYSTEM

## 8.1 Steps [CURRENT shape]
1. Contact + delivery address. 2. Shipping method. 3. Payment method. 4. Review (items, shipping, duties, discounts, grand total). 5. Place order. Mobile: dark top bar + collapsible summary; desktop: right-column summary. [CURRENT]

## 8.2 Address Management
- Select saved address or add new; fields: name, phone, line1/2, city, **state (INDIAN_STATES)** [CURRENT], pincode, country=India. Pincode serviceability check. Validation: required fields, phone (+91, 10 digits), pincode (6 digits).

## 8.3 Delivery Selection
Standard/express (if offered) with ETA + cost. ETA from carrier SLAs + pincode.

## 8.4 Payment Selection
Razorpay methods: cards, UPI, netbanking, wallets. Quick Checkout opens Razorpay directly. [CURRENT]

## 8.5 Order Summary
Items Total, Shipping (Free), Duties & Taxes (Included), Discounts (if any), Grand Total. [CURRENT]

## 8.6 Order Placement & Razorpay Integration (production)
1. `POST /checkout/validate` → server re-prices cart, re-checks stock, **checks KYC gate** (§9.10).
2. `POST /orders` (idempotency-key) → order `PENDING_PAYMENT`, inventory **reserved** (TTL).
3. Create Razorpay order; client opens checkout with `razorpayOrderId`.
4. On client success → `POST /payments/verify` with `{razorpay_payment_id, order_id, signature}` → **server verifies HMAC signature**.
5. Razorpay **webhook** `payment.captured` (source of truth) → Payment marks captured → emits `payment.captured` → Order → `CONFIRMED`, reservation **committed**.
6. Confirmation screen + email/SMS.

## 8.7 Payment Success
Order `CONFIRMED`; cart cleared; appears in My Orders; fulfilment planning begins.

## 8.8 Payment Failure
Declined/cancelled/timeout → order stays `PENDING_PAYMENT`; inventory reservation released after TTL; show retry. **Never** confirm from client signal alone (always reconcile with webhook).

## 8.9 Retry Logic
Up to **3** attempts within the reservation TTL **[RECOMMENDATION: 15 min]**; user may switch method. After TTL → reservation released; order auto-cancels (`PAYMENT_TIMEOUT`) and can be re-initiated.

## 8.10 Abandonment & Recovery
- Abandoned = checkout started, no capture within TTL. Persist cart; send recovery email/notification after **1h / 24h** [RECOMMENDATION]; deep link back to checkout.
- Saved address/payment selections restored.

## 8.11 Acceptance Criteria (Checkout)
- **AC-CHK-1** Invalid/missing address → submit blocked, inline errors.
- **AC-CHK-2** Place order → server re-prices; if mismatch, show new total + require re-confirm.
- **AC-CHK-3** Payment success only confirms after server signature verification + webhook reconciliation.
- **AC-CHK-4** Payment failure → order not confirmed, inventory released, retry available.
- **AC-CHK-5** Duplicate submit (double-click) → single order (idempotency key).
- **AC-CHK-6** KYC required and not verified → placement blocked with CTA to KYC.

## 8.12 Edge Cases
Duplicate payment, captured-but-no-order, inventory gone post-payment, price change at place-time, address un-serviceable, partial stock — all in §22.

---

# SECTION 9 — KYC SYSTEM (CRITICAL)

> Mandatory for personal imports into India (Customs Act + FEMA). One verified KYC unblocks importing; without it, orders requiring import clearance cannot ship.

## 9.1 Captured Information
- **Full name** (as per Aadhaar). [CURRENT]
- **PAN document** upload. [CURRENT]
- **Aadhaar document** upload. [CURRENT]
- **[Stored/derived]:** reference id (`KYC-YYYY-#####`), address, submittedAt, reviewedAt, verifiedAt. [CURRENT: kycStore]
- **[RECOMMENDATION]:** PAN number + Aadhaar number (masked at rest), DOB, consent timestamp, IP.

## 9.2 Upload Rules [CURRENT]
- Formats: JPG, PNG, PDF. Max size **10 MB** each. Drag-or-click upload; preview; replace/remove; "View".
- **[RECOMMENDATION]:** virus scan, server-side type sniffing (not just extension), image quality/legibility check, EXIF strip, store encrypted.

## 9.3 Reference Generation
On submit, generate `KYC-{year}-{5 digits}`; unique; shown on status/verified screens. [CURRENT]

## 9.4 Verification Timeline [CURRENT]
Documents Submitted (timestamp) → Reviewed/Under review → Verification Complete (timestamp). Reusable, status-driven. Future states: Rejected, Additional Documents Required.

## 9.5 Status Definitions (state machine)
| Status | Meaning | Customer sees |
|---|---|---|
| `NOT_STARTED` | No submission. | KYC form. [CURRENT] |
| `DRAFT` [REC] | Started, not submitted. | Form with saved values. |
| `SUBMITTED` | Sent for review. | "Under review" dashboard. [CURRENT: pending] |
| `UNDER_REVIEW` | Reviewer working. | "Under review". |
| `ADDITIONAL_DOCS_REQUIRED` [REC] | Needs more/better docs. | Reason + re-upload CTA. |
| `APPROVED` / `VERIFICATION_COMPLETE` | Identity verified. | "Verified" dashboard (status, timeline, customer details). [CURRENT: verified] |
| `REJECTED` | Failed verification. | Reason + resubmit CTA. |
| `EXPIRED` [REC] | Verification aged out. | Re-verify CTA. |

**Transitions:** `NOT_STARTED→SUBMITTED [submit]`; `SUBMITTED→UNDER_REVIEW [reviewer opens]`; `UNDER_REVIEW→{APPROVED|REJECTED|ADDITIONAL_DOCS_REQUIRED} [decision]`; `ADDITIONAL_DOCS_REQUIRED→SUBMITTED [resubmit]`; `REJECTED→SUBMITTED [resubmit, if allowed]`; `APPROVED→EXPIRED [time/policy]`.

## 9.6 Document Validation
- **Auto [RECOMMENDATION]:** format/size/type, legibility, face/text presence, name match vs entered name, PAN/Aadhaar format/checksum, optional government verification API, duplicate-document detection (same doc across accounts → fraud flag).
- **Manual:** reviewer confirms authenticity, name consistency, no tampering.

## 9.7 Admin Review Process
Queue (oldest first / SLA-prioritised) → open record → view docs → decision (Approve / Reject{reason} / Request more) → audit logged. SLA: P50 ≤ 24h, P95 ≤ 48h. Two-person review for high-risk flags [RECOMMENDATION].

## 9.8 Resubmission Process
Rejected / additional-docs → customer edits + re-uploads → new `SUBMITTED`; history retained; max **3** resubmissions before manual escalation [RECOMMENDATION].

## 9.9 Failure & Fraud Scenarios
- Mismatched name/doc → reject with reason.
- Same Aadhaar/PAN on multiple accounts → fraud review, block.
- Tampered/edited image → reject + flag.
- Expired/illegible doc → request new.
- Upload exploit (malware, oversized, wrong type) → blocked server-side.

## 9.10 KYC Business Rules (the gate)
- **BR-KYC-1** Orders requiring import clearance **MUST NOT** ship without an `APPROVED` KYC on the account.
- **BR-KYC-2 [RECOMMENDATION]:** Allow browse + cart + **order placement & payment** without KYC, but place the order on **`KYC_HOLD`** until verified (reduces purchase friction; matches "compliance as a smooth step"). *Alternative (stricter): block placement until verified.* Pick one product-wide; default = `KYC_HOLD`.
- **BR-KYC-3** KYC is one-time per customer unless `EXPIRED`/policy change.
- **BR-KYC-4** KYC docs retained per legal requirement (§17), access-restricted + audited.

## 9.11 Compliance Rules
Explicit consent + purpose at collection; encryption in transit + at rest; access logged; retention + deletion per law; right to access/erase (subject to legal holds).

## 9.12 Acceptance Criteria (KYC)
- **AC-KYC-1** Submit with name + valid PAN + valid Aadhaar → status `SUBMITTED`, reference generated, "Under review" shown.
- **AC-KYC-2** Upload > 10 MB or wrong type → inline error, not submitted.
- **AC-KYC-3** Approve → "Verified" dashboard with timeline + customer details + reference.
- **AC-KYC-4** Reject → reason + resubmit path; resubmit returns to review.
- **AC-KYC-5** Order requiring import + no approved KYC → does not ship (held or blocked per BR-KYC-2).
- **AC-KYC-6** KYC documents are encrypted at rest and access is audited.

---

# SECTION 10 — ORDER MANAGEMENT

## 10.1 Order Lifecycle (order-level, derived from packages)
`PENDING_PAYMENT → CONFIRMED → PROCESSING → (per-package fulfilment) → PARTIALLY_SHIPPED → SHIPPED → PARTIALLY_DELIVERED → DELIVERED → (COMPLETED)`; side states `CANCELLED, RETURN_IN_PROGRESS, RETURNED, REFUNDED, REPLACED, KYC_HOLD, ON_HOLD`.

## 10.2 Status Definitions
| Status | Meaning |
|---|---|
| `PENDING_PAYMENT` | Created, awaiting capture. |
| `KYC_HOLD` | Paid but awaiting KYC approval (per BR-KYC-2). |
| `CONFIRMED` | Paid + (KYC ok); ready to fulfil. |
| `PROCESSING` | Being prepared/packed. |
| `PACKED` | Packages created, labels generated. |
| `SHIPPED` | All packages handed to carrier(s). |
| `IN_TRANSIT` | Moving. |
| `OUT_FOR_DELIVERY` | Last mile. |
| `DELIVERED` | All packages delivered. |
| `PARTIALLY_SHIPPED/DELIVERED` | Some packages ahead of others. |
| `CANCELLED` | Cancelled pre-ship. |
| `RETURNED` | Returned post-delivery. |
| `REFUNDED` | Money returned. |
| `REPLACED` | Replacement issued. |

## 10.3 Transitions & Guards (key)
- `PENDING_PAYMENT→CONFIRMED [payment.captured] {kyc ok}` else `→KYC_HOLD`.
- `KYC_HOLD→CONFIRMED [kyc.approved]`; `KYC_HOLD→CANCELLED+REFUND [kyc.rejected & customer cancels / policy]`.
- `CONFIRMED→PROCESSING→PACKED→SHIPPED→IN_TRANSIT→OUT_FOR_DELIVERY→DELIVERED` (order status = aggregate of package statuses).
- `{CONFIRMED|PROCESSING}→CANCELLED [customer/ops, pre-ship] → REFUND`.
- `DELIVERED→RETURN_IN_PROGRESS [return approved] → RETURNED → REFUNDED|REPLACED`.

## 10.4 Allowed Actions by Status [CURRENT mapping]
| Order/Package status | Customer actions |
|---|---|
| Confirmed / Processing / Shipped / In transit / OFD | View Tracking History · Cancel (pre-ship only) |
| Delivered | View Tracking History · Return/Replace · Buy Again |
| Cancelled | Buy Again |
| Returned/Refunded | Buy Again · View refund status |

## 10.5 Notifications per transition
Confirmed, KYC hold/approved, shipped (per package), out-for-delivery, delivered, cancelled, return received, refund initiated/completed → email/SMS/WhatsApp/in-app per prefs.

## 10.6 Business Logic
- Order total is immutable post-confirmation except via refunds/adjustments (audited).
- Cancellation allowed only while **no** package is `SHIPPED`; partial cancellation at package/line level if some shipped (§11).
- "Buy Again" re-adds the same SKUs to cart at current price/stock. [CURRENT]

## 10.7 Acceptance Criteria (Orders)
- **AC-ORD-1** Confirmed order shows correct items, totals, ship-to, payment, packages.
- **AC-ORD-2** Cancel before shipment → order `CANCELLED` + refund initiated.
- **AC-ORD-3** Cancel attempt after shipment → blocked with message; return path offered.
- **AC-ORD-4** Order status reflects the aggregate of its package statuses.
- **AC-ORD-5** Every status change emits the correct notification(s).

---

# SECTION 11 — MULTI-PACKAGE FULFILMENT (CRITICAL)

## 11.1 Model [CURRENT: orders contain packages]
`Order 1—* Package`; `Package{ id, orderId, lines[], carrier, trackingNumber, status, eta, shippedAt, deliveredAt, cancelledOn }`. Each package has its **own** status, carrier, tracking, ETA. [CURRENT: per-package status/headings/actions]

## 11.2 Why split
Items ship from different origins/warehouses, different weights/dims, partial stock, or carrier optimisation. The platform **MUST** support N packages per order and never merge their identities.

## 11.3 Multiple carriers / tracking numbers
Each package may use a different carrier (Delhivery, Shadowfax, …) and has a unique tracking number → standalone `/track-order/:trackingNumber`. [CURRENT]

## 11.4 Partial deliveries / split shipments
Order can be `PARTIALLY_SHIPPED` / `PARTIALLY_DELIVERED`. UI shows "Package N of M" + per-package status. [CURRENT]

## 11.5 Package exceptions
- **Failure (lost/damaged):** mark package `EXCEPTION`; trigger replacement/refund for that package's lines only.
- **Delay:** update ETA; notify; no auto-cancel.
- **Return:** per-package return; refund only that package's value.

## 11.6 Business Rules
- Cancellation: only packages not yet `SHIPPED` are cancellable; shipped packages go via returns.
- Refund math is per-package/line (never refund more than the line's paid value incl. proportional shipping/duties).
- Order completes only when **all** packages reach a terminal state.

## 11.7 Acceptance Criteria
- **AC-PKG-1** An order with 2 packages shows both, each with its own status/tracking/ETA/actions.
- **AC-PKG-2** Shipping one package moves the order to `PARTIALLY_SHIPPED`, not `SHIPPED`.
- **AC-PKG-3** Returning one package refunds only that package's lines.
- **AC-PKG-4** A package exception does not block other packages' progress.

---

# SECTION 12 — ORDER DETAILS PAGE

## 12.1 Layout [CURRENT]
Top: **Ship To** (name, full address, phone) · **Payment Method** (card/UPI/COD + amount paid) · **Order Summary** (Items Total, Shipping Free, Duties & Taxes, Discounts if any, Grand/Total amount). Below: **package cards** reusing the Orders-page layout (status heading + subtext + product rows with image, name, qty, unit price, total price) + per-status actions. Meta bar: Order # + placed date + View Invoice / Printable Order Summary.

## 12.2 Package Breakdown
One card per package (different tracking/status/ETA); never merged. [CURRENT, shared `orderPackageUI`]

## 12.3 Actions
Per package/status: View Tracking History, Return/Replace, Cancel (pre-ship), Buy Again. [CURRENT]

## 12.4 Invoice & Printable Summary
- **Invoice:** server-generated PDF (GST-compliant, duties line) stored in object storage; link on order. [RECOMMENDATION; CURRENT: link placeholder]
- **Printable Order Summary:** print-friendly view.

## 12.5 Business Rules
- Amounts shown must reconcile exactly with payment captured and any refunds.
- Returns/replacement entry points appear only for delivered, in-window, eligible lines.

## 12.6 Acceptance Criteria
- **AC-ODP-1** Ship To, Payment, Summary match the confirmed order + payment record.
- **AC-ODP-2** Each package renders with correct products, qty, unit + total price, status, actions.
- **AC-ODP-3** Invoice link downloads a valid PDF reconciling to the paid amount.

---

# SECTION 13 — TRACKING SYSTEM

## 13.1 Tracking History & Timeline [CURRENT]
Per-package chronological event list + a status timeline; standalone route `/track-order/:trackingNumber` (shareable). Each event: `{timestamp, status, location?, description, carrier}`.

## 13.2 Carrier Updates (production)
- **Ingest:** carrier webhooks (preferred) → normalise to canonical statuses; **poll** fallback every **15–30 min** if webhooks absent/late.
- **Canonical statuses:** `LABEL_CREATED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED_ATTEMPT, EXCEPTION, RTO (return to origin)`.

## 13.3 Estimated Delivery
ETA from carrier SLA + pincode + customs lead time; recompute on delays; show range. [CURRENT: date range]

## 13.4 Exception Handling
| Scenario | Behaviour |
|---|---|
| Failed delivery attempt | Show attempt + reason; auto-reschedule; notify; after **3** fails → ops + customer contact. |
| Delivered confirmation | Mark delivered (+ POD/OTP if available); start return window. |
| Lost shipment | After **X days** no scan past last event **[REC: 7]** → `EXCEPTION`; ops investigates; replace/refund. |
| Delayed shipment | Update ETA; notify; no auto-cancel. |
| Tracking unavailable | "Tracking will appear once shipped" / "updates delayed"; never blank error. |
| RTO | Notify; offer re-ship (address fix) or refund. |

## 13.5 Acceptance Criteria
- **AC-TRK-1** Each package shows its own timeline + current status + ETA.
- **AC-TRK-2** Carrier event updates the package status within ≤ 5 min of receipt.
- **AC-TRK-3** Delivered event starts the return-eligibility window.
- **AC-TRK-4** Missing tracking shows a friendly state, never an error blank.

---

# SECTION 14 — RETURNS / REFUNDS / REPLACEMENTS

## 14.1 Eligibility
- Window: **14 days** from delivery **[CURRENT positioning]**.
- Returnable category (non-returnable: opened consumables/hygiene/perishable unless damaged/defective **[RECOMMENDATION]**).
- Item delivered (not in transit), not previously refunded/replaced.

## 14.2 Reasons [CURRENT: RETURN_REASONS]
Damaged, defective, wrong item, not as described, expired/near-expiry, changed mind (if allowed), package issue. Reason may drive who pays return shipping + refund vs replace eligibility.

## 14.3 Evidence Upload [CURRENT]
Photos (and notes) required for damaged/defective/wrong-item; format/size limits as KYC; stored in object storage.

## 14.4 Flow (3-step wizard) [CURRENT]
1. Select items + return qty (per line, ≤ delivered qty). 2. Reason + photos. 3. Review + submit → `RET-…` created (`REQUESTED`).

## 14.5 Return State Machine
`REQUESTED → APPROVED|REJECTED → (APPROVED) PICKUP_SCHEDULED → IN_TRANSIT → RECEIVED → INSPECTED → {REFUNDED|REPLACED|REJECTED_AFTER_INSPECTION}`.

## 14.6 Review & Approval
- **Auto-approve [RECOMMENDATION]** for trusted reasons + low value (< ₹2,000) to reduce friction; else manual (Support/Ops).
- Inspection on receipt; mismatch (wrong/used item) → reject or partial refund with evidence.

## 14.7 Replacement Flow
Approved replacement → create linked replacement order (no charge) → fulfil as new packages → original return tracked separately. Stock check; if OOS → convert to refund.

## 14.8 Refund Flow
- Refund to **original payment method** via Razorpay refund API; amount = returned lines' paid value + proportional shipping/duties per policy.
- Idempotent; reconciled via Razorpay refund webhook; status `INITIATED → PROCESSING → COMPLETED|FAILED`.
- Failure → retry queue + manual Finance; invalid method → store credit [RECOMMENDATION].
- SLA: initiate ≤ **48h** of approval/inspection; gateway settles in its own window (show "5–7 business days").

## 14.9 Customer Communication
Status emails/notifications at each transition (requested, approved, pickup, received, refunded/replaced).

## 14.10 Business Rules
- Never refund more than paid for the line (incl. proportional shipping/duties).
- One active return per line at a time.
- Duties refundability per customs policy [RECOMMENDATION: refund product + proportional duties unless consumed].

## 14.11 Acceptance Criteria
- **AC-RET-1** Return only available for delivered, in-window, eligible lines.
- **AC-RET-2** Submit return → `RET-…` created; customer sees status.
- **AC-RET-3** Approved refund → money returns to original method; status visible; reconciled with gateway.
- **AC-RET-4** Replacement → new no-charge order linked to the return.
- **AC-RET-5** Partial/multi-package returns refund only the affected lines.

---

# SECTION 15 — ACCOUNT MANAGEMENT

## 15.1 Profile [CURRENT: AccountInfoPage]
Name, email, phone; edit with validation; email/phone change requires verification (OTP) [RECOMMENDATION].

## 15.2 Address Book [CURRENT: AddressesPage]
CRUD addresses; default flag; validation (pincode, phone, state); used at checkout.

## 15.3 Payment Methods [CURRENT: PaymentMethodsPage]
Saved cards/tokens (PCI: store **tokens only** via Razorpay, never raw PAN); add/remove; default.

## 15.4 Notifications [CURRENT: NotificationsPage]
Per-channel (email/SMS/WhatsApp/in-app) + per-type (orders, shipping, KYC, promos) preferences; opt-out honoured (except transactional/legal).

## 15.5 2FA & Security [CURRENT: TwoStepVerificationPage]
TOTP/SMS 2FA; session management; sign-out everywhere; password rules; login alerts.

## 15.6 Privacy
Data export + deletion requests (subject to legal holds); consent records; activity log.

## 15.7 Acceptance Criteria
- **AC-ACC-1** Profile/address/payment edits validate and persist; failures don't lose input.
- **AC-ACC-2** Customers only access their own data (server-enforced).
- **AC-ACC-3** Enabling 2FA requires a verified second factor before activation.
- **AC-ACC-4** Notification opt-out suppresses that channel/type (except transactional).

---

# SECTION 16 — SUPPORT SYSTEM

## 16.1 Channels [CURRENT: footer support block]
Ask a Specialist (chat, 24×7), Email (support@walherb.com), Phone (Mon–Sat 9–9 IST). Each can open a **ticket**.

## 16.2 Ticketing
`Ticket{ id(TKT-…), userId, channel, subject, body, orderRef?, kycRef?, priority, status, assignee, slaDueAt, messages[], createdAt }`. States: `NEW → OPEN → PENDING_CUSTOMER → RESOLVED → CLOSED` (+ `REOPENED`).

## 16.3 Escalations
Priority by type/value; breach of SLA auto-escalates to lead; KYC/payment/fraud tickets route to specialist queues.

## 16.4 Response SLA [RECOMMENDATION]
| Priority | First response | Resolution |
|---|---|---|
| Urgent (payment/fraud/undelivered-paid) | ≤ 1h | ≤ 24h |
| High (delivery/return/KYC) | ≤ 4h | ≤ 48h |
| Normal | ≤ 24h | ≤ 72h |

## 16.5 Acceptance Criteria
- **AC-SUP-1** Any channel creates a ticket with auto-acknowledgement.
- **AC-SUP-2** SLA timers run; breaches escalate.
- **AC-SUP-3** Agents see order/KYC context for the customer (permission-bound).

---

# SECTION 17 — LEGAL & COMPLIANCE

## 17.1 Pages [CURRENT]
Privacy Policy, Terms & Conditions, About Us (`ContentPage`), Report Infringement (`ReportInfringementPage`) — versioned CMS content; "last updated" shown.

## 17.2 Report Infringement [CURRENT]
IP-complaint form: policy accordion (trademark/copyright/other), complainant details + **email OTP verification**, infringing listing URLs (dynamic), description, evidence upload, declaration checkboxes + signature → reference id; routed to Trust & Safety queue (ticket). Production: real OTP (server), real submission storage, takedown workflow.

## 17.3 Customs Compliance
Importer-of-record obligations; HS classification; duty/tax computation + records; KYC linkage to shipments; documentation retention for audits.

## 17.4 KYC / Data Compliance
Consent, purpose limitation, encryption, access control + audit, retention schedule, erasure rights (with legal holds). Align to India DPDP Act + applicable customs/FEMA rules **[RECOMMENDATION: legal review before launch]**.

## 17.5 Data Retention [RECOMMENDATION]
| Data | Retention |
|---|---|
| KYC documents | As legally mandated (e.g., 5–8 yrs) then secure delete. |
| Orders/invoices (financial) | 8 yrs (tax/audit). |
| Support tickets | 3 yrs. |
| Marketing consent logs | Until withdrawn + 1 yr. |
| Web/analytics logs | 13 months. |

## 17.6 Acceptance Criteria
- **AC-LEG-1** Legal pages render current versioned content with "last updated".
- **AC-LEG-2** Infringement submission requires verified email + declaration; issues a reference; routes to Trust & Safety.
- **AC-LEG-3** KYC/financial data retained + deleted per schedule; access audited.

---

# SECTION 18 — ADMIN PORTAL REQUIREMENTS (future)

> The prototype is customer-facing only. The admin portal is required for operations; RBAC per §3; every mutation audited.

## 18.1 Modules
| Module | Capabilities |
|---|---|
| **Products** | CRUD products/variants, images (object storage), pricing, badges, stock, publish/unpublish, bulk import (CSV). |
| **Categories** | Manage the single canonical category tree; reparent; map products. |
| **Orders** | Search/filter; view; change status; cancel; manual refund/adjust; resend notifications; export. |
| **Packages/Fulfilment** | Create/split packages; assign carrier; generate labels; mark exceptions; reroute. |
| **Returns** | Review/approve/reject; schedule pickup; record inspection; trigger refund/replacement. |
| **KYC** | Review queue; view docs; approve/reject/request-more; fraud flags; audit. |
| **Users** | Search; view; suspend; role assignment (Super Admin); impersonate (audited, consented). |
| **Analytics** | Funnels, sales, KYC, delivery, returns dashboards. |
| **Support** | Ticket queues, SLAs, macros, escalations. |
| **Content/CMS** | Edit legal/info pages, FAQ, banners; versioning + publish. |
| **Notifications** | Templates, triggers, broadcast (consented), logs. |
| **Pricing/Duties** | HS-code duty tables, tax rules, discount/promo management. |

## 18.2 Cross-cutting
Audit log (who/what/when/before-after/reason), saved views, export, 2FA-required admin login, IP allowlist [RECOMMENDATION], read-only roles.

## 18.3 Acceptance Criteria
- **AC-ADM-1** Every admin mutation writes an audit entry.
- **AC-ADM-2** Role changes are restricted to Super Admin and logged.
- **AC-ADM-3** KYC docs are viewable only by KYC Reviewer/Super Admin, access logged.

---

# SECTION 19 — API SPECIFICATION (proposed)

## 19.1 Conventions
- Base: `/api/v1`. JSON. **Auth:** `Authorization: Bearer <JWT>` (customer) or service key (internal). Public read endpoints (catalog/search/content) need no auth.
- **Idempotency:** mutating money/order endpoints accept `Idempotency-Key` header.
- **Pagination:** `?page=&limit=` → `{ data, page, limit, total }`.
- **Standard error envelope:**
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable",
  "details": [ { "field": "email", "issue": "invalid" } ], "traceId": "..." } }
```
- **HTTP:** 200 ok, 201 created, 400 validation, 401 unauth, 403 forbidden, 404 not found, 409 conflict (stock/idempotency), 422 business rule, 429 rate-limit, 5xx server. Always include `traceId`.

## 19.2 Endpoints by Module
**Auth/Identity**
- `POST /auth/register` `{name,email,password}` → 201 `{user, tokens}`
- `POST /auth/login` → 200 `{user, tokens}` | 401
- `POST /auth/refresh` `{refreshToken}` → 200 `{tokens}`
- `POST /auth/logout` → 204
- `POST /auth/2fa/enable|verify` · `POST /auth/password/reset`

**Catalog**
- `GET /products?category=&brand=&type=&...&sort=&page=` → list + facets
- `GET /products/{slug}` → product + variants + reviews summary
- `GET /categories` → tree · `GET /brands`

**Search**
- `GET /search?q=&filters...` → `{ data, facets, total }` (DB fallback if index down)

**Cart**
- `GET /cart` · `POST /cart/items {variantId,qty}` · `PATCH /cart/items/{id} {qty}` · `DELETE /cart/items/{id}` · `POST /cart/promo {code}` · `DELETE /cart/promo/{code}` · `POST /cart/merge`

**Pricing**
- `POST /pricing/quote {lines,destinationPincode}` → `{itemsTotal,shipping,duties,tax,discount,grandTotal,breakdown}`

**Checkout/Orders**
- `POST /checkout/validate {cartId,addressId,shippingMethod}` → repriced summary + `kycGate`
- `POST /orders {cartId,addressId,shippingMethod,paymentMethod}` (Idempotency-Key) → 201 `{order, razorpayOrderId}`
- `GET /orders?status=&page=` (own) · `GET /orders/{id}` · `POST /orders/{id}/cancel`
- `GET /orders/{id}/invoice` → PDF url

**Payments**
- `POST /payments/verify {razorpayOrderId,paymentId,signature}` → 200 verified | 422
- `POST /webhooks/razorpay` (signature-verified; idempotent) — source of truth

**KYC**
- `GET /kyc` → current record/status · `POST /kyc {fullName}` + `POST /kyc/documents` (multipart: panDoc, aadhaarDoc) → `{reference,status}`
- `POST /kyc/resubmit` · (admin) `GET /admin/kyc/queue` · `POST /admin/kyc/{id}/decision {decision,reason}`

**Fulfilment/Tracking**
- `GET /orders/{id}/packages` · `GET /track/{trackingNumber}` (public) → timeline
- `POST /webhooks/carrier/{carrier}` (signature-verified) — status ingest

**Returns/Refunds**
- `POST /returns {orderId, lines:[{lineId,qty,reason}], evidence[]}` → `{returnId,status}`
- `GET /returns/{id}` · (admin) `POST /admin/returns/{id}/decision` · `POST /admin/refunds {returnId|orderId, amount}` → `{refundId,status}`

**Account**
- `GET/PATCH /account/profile` · `CRUD /account/addresses` · `CRUD /account/payment-methods` · `GET/PATCH /account/notifications`

**Support**
- `POST /support/tickets` · `GET /support/tickets` (own) · `POST /support/tickets/{id}/messages`

**Content/Legal**
- `GET /content/{slug}` (about/privacy/terms) · `POST /legal/infringement` (with email-OTP verification)

**Notifications**
- `GET /notifications` · `POST /notifications/{id}/read`

## 19.3 Auth Requirements per group
Public: catalog, search, content, `track/{n}`. Customer JWT: cart, checkout, orders, kyc, account, returns, support, notifications. Service key + signature: webhooks. Admin JWT + role: all `/admin/*`.

---

# SECTION 20 — DATABASE DESIGN (recommended)

## 20.1 Core Entities (PostgreSQL; key fields)
- **users**(id, email[uniq], phone, password_hash, name, role, status, created_at)
- **brands**(id, name, slug, verified, years_active)
- **categories**(id, slug, label, parent_id→categories) — single canonical tree
- **products**(id, slug[uniq], title, brand_id→brands, description, status, default_variant_id)
- **product_categories**(product_id, category_id) — M:N
- **variants**(id, product_id→products, label, sku[uniq], price_paise, original_paise, weight_g, hs_code)
- **inventory**(variant_id→variants, stock, reserved, available GENERATED, low_threshold)
- **product_images**(id, product_id, url, position)
- **carts**(id, user_id?→users, token, currency, updated_at)
- **cart_items**(id, cart_id→carts, variant_id, qty, unit_price_paise)
- **addresses**(id, user_id→users, name, phone, line1, line2, city, state, pincode, country, is_default)
- **orders**(id, user_id→users, status, items_total_paise, shipping_paise, duties_paise, tax_paise, discount_paise, grand_total_paise, address_snapshot(jsonb), placed_at, idempotency_key[uniq])
- **order_lines**(id, order_id→orders, variant_id, sku, title, qty, unit_price_paise, line_total_paise)
- **packages**(id, order_id→orders, carrier, tracking_number, status, eta, shipped_at, delivered_at, cancelled_on)
- **package_lines**(package_id→packages, order_line_id→order_lines, qty)
- **tracking_events**(id, package_id→packages, status, location, description, occurred_at, source)
- **payments**(id, order_id→orders, gateway, razorpay_order_id, razorpay_payment_id, amount_paise, status, signature_verified, captured_at)
- **refunds**(id, order_id→orders, return_id?→returns, gateway_refund_id, amount_paise, status, reason, created_at)
- **kyc_records**(id, user_id[uniq]→users, reference, status, full_name, address, pan_doc_url, aadhaar_doc_url, pan_masked, aadhaar_masked, submitted_at, reviewed_at, verified_at, reviewer_id, reject_reason)
- **kyc_audit**(id, kyc_id→kyc_records, actor_id, action, before, after, at)
- **returns**(id, order_id→orders, user_id, status, created_at)
- **return_lines**(id, return_id→returns, order_line_id, qty, reason, evidence_urls(jsonb))
- **support_tickets**(id, user_id, channel, subject, priority, status, assignee_id, order_ref, kyc_ref, sla_due_at, created_at)
- **ticket_messages**(id, ticket_id→support_tickets, author_id, body, created_at)
- **notifications**(id, user_id, type, channel, payload(jsonb), read_at, created_at)
- **notification_prefs**(user_id, type, channel, enabled)
- **discounts/promo_codes**(id, code[uniq], type, value, scope, min_paise, max_paise, starts_at, ends_at, usage_limit, per_user_limit, active)
- **content_pages**(slug[uniq], title, body(jsonb), version, updated_at)
- **audit_log**(id, actor_id, entity, entity_id, action, before, after, reason, at)

## 20.2 Key Relationships
`users 1—* orders 1—* order_lines`; `orders 1—* packages 1—* package_lines —1 order_lines`; `packages 1—* tracking_events`; `orders 1—* payments`, `1—* refunds`; `users 1—1 kyc_records`; `orders 1—* returns 1—* return_lines`; `products 1—* variants 1—1 inventory`; `products *—* categories`.

## 20.3 Integrity Rules
- Money columns `*_paise` are `BIGINT NOT NULL CHECK >= 0`. `grand_total = items + shipping + duties + tax − discount` (enforced in app + check).
- `Σ package_lines.qty per order_line ≤ order_line.qty`.
- Refund total per line ≤ line paid value.
- `inventory.available = stock − reserved >= 0`.
- Address stored as **snapshot** on the order (immutable post-placement).
- Soft-delete (deleted_at) for user-facing entities; hard-delete only via retention jobs.

---

# SECTION 21 — QA TEST STRATEGY

> For each module: **Positive · Negative · Boundary · Failure · Security · Regression**. Test IDs `T-<MODULE>-<n>`.

## 21.1 Catalog/Search
- Positive: filter+sort returns correct set + facet counts; search finds by title/brand/type.
- Negative: invalid filter ignored; empty query no-op.
- Boundary: price range at min/max; 0 results; 10k results pagination.
- Failure: index down → DB fallback; product image 404 → placeholder.
- Security: no SQL/NoSQL injection via `q`/filters; XSS in product fields escaped.
- Regression: category keyword-fallback still yields non-empty grid.

## 21.2 Cart
- Positive: add/update/remove/merge; totals correct.
- Negative: qty 0/negative/over-stock rejected.
- Boundary: qty = stock; qty = perOrderCap; empty cart checkout blocked.
- Failure: cart svc down → local copy + retry.
- Security: cannot modify another user's cart (IDOR).
- Regression: guest→login merge no loss.

## 21.3 Checkout/Payment
- Positive: full flow → confirmed after webhook.
- Negative: missing address; declined card.
- Boundary: reservation TTL expiry; max retries.
- Failure: captured-but-no-order saga; duplicate submit idempotent.
- Security: signature verification mandatory; webhook auth; no client-trust confirmation; PCI (tokens only).
- Regression: Quick Checkout opens Razorpay; totals reconcile.

## 21.4 KYC
- Positive: submit → review → approve → verified dashboard.
- Negative: >10MB / wrong type rejected; missing doc blocks submit.
- Boundary: 10MB exactly; 3rd resubmission escalation.
- Failure: storage down → graceful error, no partial record.
- Security: docs encrypted; access audited; IDOR blocked; malware upload blocked.
- Regression: KYC gate prevents shipping unverified.

## 21.5 Orders/Packages/Tracking
- Positive: multi-package statuses, partial shipped/delivered, actions per status.
- Negative: cancel after ship blocked.
- Boundary: 1 vs N packages; all terminal → order complete.
- Failure: package exception isolates; carrier feed down → last-known.
- Security: only owner views order; track endpoint reveals no PII.
- Regression: order status = aggregate of packages.

## 21.6 Returns/Refunds
- Positive: in-window return → approve → refund to source/replace.
- Negative: out-of-window/non-returnable blocked.
- Boundary: full vs partial vs multi-package return; refund ≤ paid.
- Failure: gateway refund fail → retry + manual path; idempotent.
- Security: cannot return another user's order.
- Regression: partial return refunds only affected lines.

## 21.7 Account/Support/Legal
- Profile/address/payment validate + persist; IDOR blocked; 2FA gating; notification opt-out honoured; ticket SLA timers; infringement requires verified email; content versioning.

## 21.8 Cross-cutting
- Accessibility (WCAG 2.1 AA), responsive (xs/sm/md/lg), i18n-readiness, performance budgets, security scans (OWASP Top 10), load/soak tests, contract tests (API), E2E (Playwright/Cypress) for the journeys in §4.

---

# SECTION 22 — EDGE CASE MASTER LIST (exhaustive)

| # | Scenario | Required behaviour |
|---|---|---|
| 1 | Payment success but order creation failed | Saga: auto-retry create; if still fails → auto-refund + alert; never lose money. |
| 2 | Order created but inventory unavailable | Fulfil available lines; refund unfulfillable lines; notify; never oversell. |
| 3 | KYC approved after order placed (KYC_HOLD) | Release hold → CONFIRMED → fulfil; notify. |
| 4 | KYC rejected after order placed | Hold; offer fix/cancel; on cancel → full refund. |
| 5 | Customer changes address after shipment | Block change; route via carrier redirect if possible, else RTO + re-ship. |
| 6 | Customer changes address pre-ship | Allowed; update package plan. |
| 7 | Package lost | Mark EXCEPTION; replace or refund affected lines; isolate other packages. |
| 8 | Carrier unavailable/outage | Re-assign carrier; if none → hold + notify; SLA recalculated. |
| 9 | Duplicate payment (double charge) | Detect via idempotency/reference; auto-refund duplicate; alert Finance. |
| 10 | Refund timeout/failure at gateway | Retry queue; manual Finance; store-credit fallback; status visible. |
| 11 | Tracking unavailable | Friendly "not shipped yet/updates delayed"; never error blank. |
| 12 | Partial cancellation | Cancel only unshipped packages/lines; refund those; rest proceeds. |
| 13 | Partial return | Refund only returned lines + proportional shipping/duties. |
| 14 | Multiple-package return | Independent returns per package; independent refunds. |
| 15 | Customs hold | Mark package CUSTOMS_HOLD; notify; ops/customer action; ETA updated; refund if seized. |
| 16 | Fraudulent KYC (dup doc, tampered) | Reject + flag account; block import; manual review; possible suspension. |
| 17 | Abandoned checkout | Persist cart; recovery comms 1h/24h; restore selections. |
| 18 | Guest checkout recovery | Tie cart to email/token; on return/sign-in, restore + merge. |
| 19 | Price change between cart and checkout | Re-price at place; show delta; require re-confirm. |
| 20 | Stock 0 between PDP and add | Reject add with "Only N left"/OOS. |
| 21 | Promo invalid at place-time | Drop promo; recompute; inform; allow continue. |
| 22 | Webhook arrives before client return | Webhook is source of truth; client reconciles on next poll. |
| 23 | Webhook never arrives | Reconciliation job polls gateway; resolves order. |
| 24 | Concurrent cart edits (two tabs) | Optimistic concurrency; last-write-wins with version check. |
| 25 | Session expiry mid-checkout | Re-auth; return to intent; cart intact. |
| 26 | Failed delivery (3 attempts) | Reschedule; after 3 → ops + customer; RTO or re-deliver. |
| 27 | Delivered but customer claims not received | Open dispute ticket; POD check; replace/refund per policy. |
| 28 | Negative/zero total via stacked discounts | Clamp at 0; never negative. |
| 29 | Oversized/malware KYC or evidence upload | Server-side rejection (type sniff + AV scan). |
| 30 | Image/asset host expiry (Figma URLs) | Production uses object storage/CDN; no expiring external URLs. |
| 31 | Currency rounding drift | Integer paise throughout; round once at display. |
| 32 | Reservation expiry during slow payment | Release stock; auto-cancel PAYMENT_TIMEOUT; allow re-init. |
| 33 | Replacement item OOS | Convert replacement to refund; notify. |
| 34 | Partial refund > line value | Reject; cap at line paid value. |
| 35 | Multiple promos applied | One code per cart; reject second. |
| 36 | Account deletion with open orders/holds | Block hard-delete; anonymise after legal retention; keep financial records. |

---

# SECTION 23 — NON-FUNCTIONAL REQUIREMENTS

| Area | Requirement |
|---|---|
| **Performance** | LCP ≤ 2.5s P75; API P95 ≤ 300ms (reads), ≤ 800ms (writes); search ≤ 200ms P95. Image CDN + lazy-load. |
| **Scalability** | Stateless services, horizontal autoscale; Redis cart/session; OpenSearch; read replicas; queue-based load levelling for spikes. |
| **Availability** | 99.9% target; graceful degradation (degraded flags); no single point of failure on the purchase path. |
| **Security** | OWASP Top 10; TLS 1.2+; JWT (short-lived + refresh); RBAC; secrets in vault; PCI-DSS (tokenised cards, never store PAN); KYC/PII encrypted at rest (AES-256) + field-level for identifiers; rate limiting; WAF; signed webhooks; audit logs. |
| **Privacy/Compliance** | DPDP/GDPR-style consent, export/erase; data retention (§17.5); least-privilege PII access + logging. |
| **Accessibility** | WCAG 2.1 AA: keyboard nav, focus states, ARIA, contrast, alt text. (Prototype already uses role/tabIndex/aria on custom controls.) |
| **SEO** | SSR/prerender for catalog/PDP/content [RECOMMENDATION]; semantic markup; structured data (Product, Breadcrumb, FAQ); canonical URLs; sitemap. |
| **Logging/Monitoring** | Structured logs + `traceId` propagation; metrics (RED/USE); distributed tracing; alerting on SLOs; payment/KYC dashboards. |
| **Error Handling** | Standard error envelope; user-friendly messages; never expose stack traces; idempotency on money paths; dead-letter queues + retries. |
| **Observability of money** | Daily reconciliation: payments vs orders vs refunds; alert on mismatch. |
| **Internationalisation** | INR + en-IN now; structure for future locales/currencies. |
| **Backups/DR** | DB PITR; object-storage versioning + replication; RPO ≤ 15min, RTO ≤ 1h [RECOMMENDATION]. |

---

# SECTION 24 — DEVELOPER HANDBOOK

## 24.1 Folder Structure (frontend) [CURRENT]
```text
src/
  app/                  bootstrap + home page
  pages/                full screens
    account/            account sub-screens
    static/             search + legal/info pages
  components/           reusable (home, Account, Cart, Checkout, Product, payments, category, navigation)
  context/              CartContext, AuthContext
  data/                 mock catalog (→ replace with API clients)
  design-system/        tokens, components, layouts, theme
```
**Backend [RECOMMENDATION]:** `src/modules/<domain>/{controller,service,repository,dto,events}`; `shared/{auth,errors,money,events}`; `db/migrations`.

## 24.2 Coding Standards
- TypeScript strict; ESLint + Prettier; no `any` without justification.
- Pure functions for money/pricing; integer paise; one currency formatter.
- Components: presentational vs container; props typed; no business logic in JSX.
- Server: layered (controller→service→repository); DTO validation at the boundary (zod/class-validator).

## 24.3 Naming Conventions
- Components `PascalCase.tsx`; hooks `useXxx`; constants `UPPER_SNAKE`; files match default export. Money fields `*_paise`. Events `domain.action` (e.g. `order.confirmed`). IDs prefixed (`ORD-`, `PKG-`…).

## 24.4 Component Strategy
- Reuse shared building blocks (the prototype already shares `orderPackageUI`, `QuickPayBadge`, `StaticPageShell`). New cross-page UI → a shared component, not a copy.
- Design tokens over hard-coded values (note the prototype's "honesty caveat": many inline hex values — production should consolidate to tokens/theme).

## 24.5 API Strategy
- Versioned (`/api/v1`); contract-first (OpenAPI); generated TS client for the SPA; idempotency on money; standard error envelope; pagination convention.

## 24.6 State Management
- SPA: server state via a data layer (React Query/RTK Query) replacing mock data; UI state local; cross-cutting via Context (Cart/Auth) — keep contexts thin.
- Cart/auth are **server-authoritative**; client caches.

## 24.7 Error Handling
- Frontend: error boundaries + per-request error states; never blank-screen.
- Backend: typed errors → envelope; retries + DLQ for async; sagas for multi-step money flows.

## 24.8 Testing Strategy
- Unit (Jest/Vitest) for logic/pricing; component tests (RTL); contract tests (API); E2E (Playwright) for §4 journeys; load tests (k6); security scans in CI.
- Coverage gates: ≥ 80% on money/order/KYC modules.

## 24.9 Deployment Strategy
- Trunk-based + PR review; CI: lint+typecheck+test+build (`tsc --noEmit` + `vite build` already used); preview env per PR; staging → prod via blue-green/canary; DB migrations gated + reversible; feature flags for risky rollouts; secrets via vault; IaC (Terraform).

---

# SECTION 25 — PROJECT DELIVERY PLAN

> Each phase: **Deliverables · Dependencies · Risks · Acceptance**. Phases can overlap; money/KYC paths get extra QA.

## Phase 1 — Foundation
- **Deliverables:** Auth/Identity, design system in production, API gateway/BFF skeleton, DB + migrations, CI/CD, observability, object storage, content/CMS for legal pages.
- **Dependencies:** Infra, cloud accounts, Razorpay + carrier + verification sandbox keys.
- **Risks:** Scope creep; auth/security gaps.
- **Acceptance:** User can register/login/2FA; legal pages live; CI deploys to staging; tracing works.

## Phase 2 — Catalog
- **Deliverables:** Products/variants/categories/brands, images on CDN, search index, filters/sort, PDP, home rails.
- **Dependencies:** Phase 1.
- **Risks:** Category-tree unification; search relevance.
- **Acceptance:** AC-CAT-*, AC-PDP-*; non-empty category grids; search works with fallback.

## Phase 3 — Commerce (Cart + Checkout + Payment)
- **Deliverables:** Server cart, pricing/duties, checkout, Razorpay integration (verify + webhook), order creation saga.
- **Dependencies:** Phase 2, Razorpay live.
- **Risks:** Money correctness; captured-but-no-order; duplicate charges.
- **Acceptance:** AC-CART-*, AC-CHK-*; reconciliation clean; idempotency proven.

## Phase 4 — Orders, Packages, Tracking
- **Deliverables:** Order lifecycle, multi-package fulfilment, carrier integration, tracking, order details + invoice, notifications.
- **Dependencies:** Phase 3, carriers.
- **Risks:** Multi-carrier normalisation; partial states.
- **Acceptance:** AC-ORD-*, AC-PKG-*, AC-TRK-*, AC-ODP-*.

## Phase 5 — KYC
- **Deliverables:** KYC capture + secure storage, review queue + admin, status dashboard/timeline, KYC gate on fulfilment, compliance controls.
- **Dependencies:** Phase 1 (storage/admin), verification provider.
- **Risks:** Compliance; fraud; data security.
- **Acceptance:** AC-KYC-*; encryption + audit verified; gate enforced.

## Phase 6 — Returns / Refunds / Replacements
- **Deliverables:** Returns wizard, RMA workflow, inspection, refunds (Razorpay), replacements, comms.
- **Dependencies:** Phases 3–4.
- **Risks:** Refund correctness; abuse.
- **Acceptance:** AC-RET-*; refund ≤ paid; reconciliation clean.

## Phase 7 — Support & Admin
- **Deliverables:** Ticketing + SLAs + escalations; full admin portal (§18); notifications templates; report-infringement workflow.
- **Dependencies:** All prior.
- **Risks:** RBAC/audit completeness.
- **Acceptance:** AC-SUP-*, AC-ADM-*, AC-LEG-*.

## Phase 8 — Optimization & Scale
- **Deliverables:** SEO/SSR, performance budgets, recommendations/personalisation, analytics dashboards, A/B framework, DR drills, accessibility audit.
- **Dependencies:** Live traffic.
- **Risks:** Premature optimisation.
- **Acceptance:** NFR targets (§23) met; Lighthouse/axe pass; DR test passes.

---

## Appendix A — Traceability (prototype → this FRS)
| Prototype artifact | FRS section |
|---|---|
| `App.tsx` view switcher + deep links | §2.1, §4 |
| `CartContext`, `AuthContext` | §7, §15, §2 |
| `ProductDetailPage`, `ProductPurchasePanel`, `SoldByModal`, `QuickPayBadge` | §6 |
| `CheckoutPage`, `RazorpayModal` | §8 |
| `OrdersPage`, `OrderDetailsPage`, `orderPackageUI` | §10, §11, §12 |
| `TrackingHistoryPage`, `/track-order/:id` | §13 |
| `ReturnRequestPage` | §14 |
| `KYCPage`, `kycStore` | §9 |
| Account pages | §15 |
| `Footer`, `pages/static/*` (Content, Report Infringement, Search) | §16, §17, §4.2 |
| `data/categoryData.ts`, `FilterSystem`, mega menu | §5 |
| `design-system/*` | §24, §6 |

## Appendix B — Open Decisions (need a written ruling)
1. **KYC gate:** place-with-hold (default) vs block-until-verified. (§9.10)
2. Promo stacking policy (single-code default). (§7.5)
3. Non-returnable categories list. (§14.1)
4. Duties refundability on returns. (§14.10)
5. Free-shipping policy/threshold. (§7.4)
6. Per-order quantity cap (default 10). (§6.8)

*End of FRS v1.0 — the Walherb Development Bible.*
