# Walherb — Project Guide for Designers

A plain‑English map of the Walherb codebase, written for **UX/UI designers** who want to make small UI changes (text, labels, colors, spacing, simple layout tweaks) without needing a developer.

> **You don't need to understand everything.** Use this as a lookup. Find the thing you want to change in the tables, open that file in VS Code, edit the text or value, and save.

---

## How to use this guide

- New to the project? Read **Section 0 (How It All Works)** first — the architecture and step-by-step flow in plain English.
- Jump to **Section 8 (Cheat Sheet)** for the fastest "I want to change X → open this file."
- Read **Section 9 (Before Editing)** so you know which files are safe.
- Read **Section 10 (Designer Notes)** for tricks like "how do I find where this button text lives?"

A few facts that make everything else make sense:

- **Framework:** This is a **React** app written in **TypeScript**, built with **Vite**, and styled with **Material UI (MUI)**. You'll mostly see styling written inline as `sx={{ ... }}` objects (think of them as CSS-in-JavaScript).
- **Mostly no web addresses (URLs):** This is a *single-page app*. One file — [`src/App.tsx`](src/App.tsx) — keeps track of "which screen is showing" and swaps screens in and out, so most screens have **no `/products/123` style URL**. A handful of share-worthy flows *do* get real addresses now: **search** (`/search?q=…`), **tracking** (`/track-order/…`), **KYC** (`/account/kyc`), and the **legal/info pages** (`/about-us`, `/privacy-policy`, `/terms-and-conditions`, `/report-infringement`). When this guide shows a "Route" without a real URL, it just means *how you reach the screen*.
- **No live backend:** All the products, orders, addresses, etc. are **fake sample data stored in files** (in [`src/data/`](src/data/) and inside the page files themselves). Editing that data just changes what's shown on screen.
- **Mobile vs desktop:** Responsive sizing is done with MUI "breakpoints" — you'll see things like `fontSize: { xs: 16, md: 24 }`. `xs` = phone, `md` = desktop. (More in Section 10.)

---

# 0. How It All Works — Architecture & Flow (Start Here)

This section explains, in plain English, **how the whole app is put together** and **what happens step by step** as it runs. Read this once and the rest of the guide makes much more sense.

## 0.1 The big picture (a shop analogy)

Think of Walherb as a **digital department store**:

- The **building** is the browser window.
- The **front desk that decides which room you're standing in** is one special file, [`src/App.tsx`](src/App.tsx) — we call it the **"screen switcher."**
- Each **room** is a *page* (Home, Product, Category, Checkout, Account…).
- The **furniture reused in every room** (the top header, the footer, buttons, cards) are *components*.
- The store's **brand book** (colors, fonts, spacing) is the *design system*.
- The **stockroom of sample products and orders** is the *data*.
- Your **shopping cart** and **whether you're signed in** are held by two "memory" helpers called *contexts*, so they don't reset when you move between rooms.

Nothing here talks to a real server — all products, orders, and payments are **realistic fakes** baked into the files, so it behaves like the real thing for demos.

## 0.2 The technology, in one breath

- **React** = the tool that draws the screen and updates it when something changes.
- **TypeScript** = JavaScript with guard-rails (it catches typos before they ship).
- **Vite** = the engine that runs the app while you work and refreshes the screen the instant you save.
- **Material UI (MUI)** = a ready-made furniture set (buttons, dialogs, drawers) that we style with `sx={{ ... }}` (CSS written as a JavaScript object).

## 0.3 The architecture, layer by layer

From the outside in — like nested boxes:

```text
┌──────────────────────────────────────────────────────────────┐
│ Browser window                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ main.tsx        ← starts everything (the ignition key)  │ │
│  │  └─ App() in App.tsx                                    │ │
│  │      ├─ CartProvider   ← remembers your cart            │ │
│  │      └─ AuthProvider   ← remembers if you're signed in  │ │
│  │          └─ AppRoutes  ← THE SCREEN SWITCHER            │ │
│  │              │  decides which page to show right now    │ │
│  │              ├─ Home / Product / Category / Checkout …  │ │
│  │              │      └─ built from COMPONENTS            │ │
│  │              │            └─ styled by DESIGN SYSTEM    │ │
│  │              │            └─ filled with DATA           │ │
│  │              └─ Global overlays (always available):     │ │
│  │                   Cart drawer · Razorpay popup ·        │ │
│  │                   Account menu · Sign-in box            │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

| Layer | File(s) | Plain-English job |
|---|---|---|
| Ignition | [`src/main.tsx`](src/main.tsx) | Boots the app into the page. You'll never edit this. |
| Memory | [`src/context/CartContext.tsx`](src/context/CartContext.tsx), [`AuthContext.tsx`](src/context/AuthContext.tsx) | Remember the cart and sign-in across every screen. |
| Screen switcher | [`src/App.tsx`](src/App.tsx) | Holds "which screen is showing" and swaps screens. The traffic controller. |
| Rooms (pages) | [`src/pages/`](src/pages/), [`src/app/page.tsx`](src/app/page.tsx) | One file = one full screen. |
| Furniture (components) | [`src/components/`](src/components/) | Reusable parts (Header, Footer, cards, cart). |
| Brand book | [`src/design-system/`](src/design-system/) | Colors, fonts, spacing, shared button/input. |
| Stockroom (data) | [`src/data/`](src/data/) + lists inside pages | The sample products, categories, orders, etc. |

## 0.4 What happens when the app starts (step by step)

1. The browser loads **`main.tsx`** — the ignition key.
2. It mounts **`App()`**, which wraps everything in the two memory helpers: **CartProvider** (cart) and **AuthProvider** (sign-in).
3. Inside those sits **`AppRoutes`** — the screen switcher. It reads the address bar **once**:
   - A normal visit → it shows the **Home page**.
   - A deep link (e.g. `/search?q=…`, `/track-order/…`, `/account/kyc`, `/about-us`) → it jumps straight to that screen.
4. The chosen page renders, pulling in its **components**, which are **styled** by the design system and **filled** with data.
5. The always-on overlays (cart drawer, payment popup, account menu, sign-in box) are mounted too — hidden until needed.

## 0.5 How moving between screens works (the switcher pattern)

This app has **no traditional page reloads**. Instead:

1. You click something (say, a product card).
2. That click calls a small function like "show this product."
3. The **screen switcher** ([`src/App.tsx`](src/App.tsx)) updates its "current screen" memory.
4. React instantly swaps the old screen for the new one — no white flash, no reload.

A few flows also get **real web addresses** so they can be bookmarked, shared, or reached with the browser Back button: **Search** (`/search`), **Tracking** (`/track-order/…`), **KYC** (`/account/kyc`), and the **legal/info pages** (`/about-us`, `/privacy-policy`, `/terms-and-conditions`, `/report-infringement`). These use the browser's History feature; the rest just live in the switcher's memory.

## 0.6 The full shopping journey (end to end, in steps)

```text
1. Land on HOME ─────────────────────────────────────────────┐
   browse rows, search the bar, or open a category           │
2. Open a CATEGORY  → filter / sort a grid of products       │
3. Open a PRODUCT   → read details, pick a pack size         │
4. BUY NOW or ADD TO CART → the cart drawer slides in        │
5. PROCEED TO CHECKOUT → fill address, choose shipping/pay   │
6. PAY (Razorpay popup) ──────────────────────────────────── ▼
7. Order appears under MY ACCOUNT → MY ORDERS
8. From an order you can: VIEW DETAILS, TRACK, or RETURN
```

Every arrow above is a button whose label you can find and edit (see Section 6 and the Cheat Sheet). The **search bar now works**: type a term, press Enter, and you land on a results grid (`/search?q=…`).

## 0.7 The account & verification side-journey

```text
Sign-in box ─► My Account
   ├─ My Orders ─► Order Details / Tracking / Returns
   ├─ KYC ─► fill form + upload IDs ─► "Under review" ─► "Verified" dashboard
   └─ Addresses · Payment Methods · Account Info · Notifications · 2-Step
```

KYC (identity check, required for importing into India) uses **three states** that the same screen flips between: the **form**, an **"under review"** status, and a **"verified" dashboard** (a success card + a timeline + a customer-details card).

## 0.8 Where the information on screen comes from

- **Catalog products & categories:** [`src/data/categoryData.ts`](src/data/categoryData.ts).
- **Home page rows:** lists at the top of [`src/app/page.tsx`](src/app/page.tsx).
- **Orders, KYC, addresses, etc.:** sample lists inside each account page file.
- **Menu labels:** `categoryMenuData.ts` (mega menu) and `Header.tsx` (top nav).
- **Brand colors / fonts / spacing:** [`src/design-system/tokens/`](src/design-system/tokens/).

To change what a screen shows, you edit the matching list or value — there is no server involved.

---

# 1. Project Structure Overview

Everything lives in the **`src/`** folder. Here is the **real** structure of this project (the generic `hooks/`, `services/`, `routes/` folders you may have seen in other projects **do not exist here**).

```text
src/
├── app/                  ← The home page + app-wide setup
├── pages/                ← The big full screens (Product, Category, Checkout, Account…)
│   ├── account/          ← The screens inside "My Account"
│   └── static/           ← Search results + legal/info pages (About, Privacy, Terms, Report Infringement)
├── components/           ← Reusable building blocks (Header, Footer, cards, forms…)
│   ├── home/             ← Pieces of the home page + the shared Header/Footer
│   ├── Account/          ← The account sidebar + layout + sign-in box
│   ├── Cart/             ← The slide-out cart drawer
│   ├── Checkout/         ← The Razorpay payment popup
│   ├── Product/          ← The product "buy box" panel + "Sold by" modal
│   ├── payments/         ← The shared Razorpay / Quick-Checkout badge
│   ├── category/         ← The category sidebar, filters, catalog cards
│   └── navigation/       ← The mega menu + mobile category drawer
├── context/              ← The shopping-cart "memory" (what's in your cart)
├── data/                 ← Sample data (category catalog)
└── design-system/        ← Colors, fonts, spacing, and shared Button/Input
    ├── tokens/           ← Color, typography, spacing, radius definitions
    ├── components/       ← Reusable Button + Input
    └── layouts/          ← Layout helpers (Container, Stack, Grid…)

public/
└── Images/               ← Static image files (hero banners, etc.)
```

### What each folder does

| Folder | What it contains | Why it exists | If you edit here… |
|---|---|---|---|
| [`src/app/`](src/app/) | `page.tsx` is the **Home page**. `layout.tsx`, `providers.tsx`, `globals.css` are app-wide setup. | Top-level wrapper and the landing screen. | Editing `page.tsx` changes the home page. Avoid `providers.tsx`/`main.tsx` unless you know why. |
| [`src/pages/`](src/pages/) | The large screens: Product, Category, Checkout, Account. | Each file is one full page. | Safe to edit text/labels. This is where most page-level changes happen. |
| [`src/pages/account/`](src/pages/account/) | The "My Account" sub-screens (Orders, KYC, Addresses, etc.). | Keeps account screens together. | Safe to edit text/labels per screen. |
| [`src/pages/static/`](src/pages/static/) | Search results + the footer's info/legal pages (About Us, Privacy Policy, Terms, Report Infringement) and their shared shell. | Footer-linked content pages that feel native to Walherb. | Safe to edit text. Page wording lives in `ContentPage.tsx`; the form is `ReportInfringementPage.tsx`. |
| [`src/components/`](src/components/) | Reusable pieces used across many pages. | Write once, use everywhere (e.g., the Header). | **Careful** — a change to Header shows on *every* page. |
| [`src/context/`](src/context/) | `CartContext.tsx` — the cart's memory. | Remembers cart items across screens. | **Avoid** unless changing cart logic. |
| [`src/data/`](src/data/) | `categoryData.ts` — the catalog product list + category definitions. | Sample content for category pages. | Safe to edit product names/prices/categories. |
| [`src/design-system/tokens/`](src/design-system/tokens/) | Colors, fonts, spacing, corner radius. | One central place for design values. | Safe, but see the **honesty note** below. |
| [`src/design-system/components/`](src/design-system/components/) | Shared `Button` and `Input`. | Consistent buttons/inputs. | Careful — used in multiple places. |
| [`public/Images/`](public/Images/) | Static image files. | Banners and assets served as-is. | Drop a new image here and reference it by `/Images/yourfile.svg`. |

> **Honesty note about tokens:** Walherb has a central color/spacing system in `design-system/tokens/`, **but many screens were built with the exact color/size typed directly into the page** (e.g. `color: '#476D59'`). So changing a token does **not** always update every screen. When in doubt, search for the actual value inside the specific file (see Section 10).

---

# 2. Page Directory

> Reminder: "Route" = *how you reach the screen*, not a real URL. The screen that shows is decided in [`src/App.tsx`](src/App.tsx).

### Home Page
- **Route:** App opens here by default; click the **Walherb logo** to return.
- **File:** [`src/app/page.tsx`](src/app/page.tsx)
- **Purpose:** The landing screen — promo bar, hero banner, rows of products, "why us," FAQ, footer. Where shoppers browse.
- **Components used:** `AnnouncementBar`, `Header`, `HeroBanner`, `ProductSection` (used several times), `TrustBar`, `WhySection`, `FaqSection`, `Footer`. Product data lives at the top of this file (`TRENDING`, `SECTIONS`).

### Product Details Page
- **Route:** Click any product card.
- **File:** [`src/pages/ProductDetailPage.tsx`](src/pages/ProductDetailPage.tsx)
- **Purpose:** Full product info — image gallery, title, rating, price, packages, the "buy box," related products, reviews, FAQ. Where shoppers decide to buy.
- **Components used:** `AnnouncementBar`, `Header`, `Footer`, `ProductPurchasePanel` (the buy box, in [`src/components/Product/ProductPurchasePanel/`](src/components/Product/ProductPurchasePanel/)). Most sections (gallery, reviews, specs, FAQ) are defined **inside this one file**.

### Category / Catalog Page
- **Route:** Click a category in the top nav or mega menu.
- **File:** [`src/pages/CategoryPage.tsx`](src/pages/CategoryPage.tsx)
- **Purpose:** Browse a product category with filters + a grid of products.
- **Components used:** `Header`, `CategorySidebar`, `FilterSystem`, `CatalogProductCard` (all in [`src/components/category/`](src/components/category/)).

### Checkout Page
- **Route:** From the Cart Drawer → "Proceed to checkout."
- **File:** [`src/pages/CheckoutPage.tsx`](src/pages/CheckoutPage.tsx)
- **Purpose:** Enter contact + delivery details, pick shipment + payment, and pay. On mobile it shows a dark top bar and a collapsible Order Summary; on desktop the summary sits in a column on the right.
- **Components used:** Mostly self-contained. The fast "Quick Checkout" path opens `RazorpayModal` ([`src/components/Checkout/RazorpayModal.tsx`](src/components/Checkout/RazorpayModal.tsx)).

### Search Results Page
- **Route:** Type in the header search bar and press **Enter** (real URL: `/search?q=…`).
- **File:** [`src/pages/static/SearchResultsPage.tsx`](src/pages/static/SearchResultsPage.tsx)
- **Purpose:** Shows a grid of products matching the search words (matched against title, brand, type, category), with a friendly "no matches" state. Clicking a result opens that product.

### Info / Legal Pages (About, Privacy, Terms, Report Infringement)
- **Route:** Footer links (real URLs: `/about-us`, `/privacy-policy`, `/terms-and-conditions`, `/report-infringement`).
- **Files:**
  - [`src/pages/static/ContentPage.tsx`](src/pages/static/ContentPage.tsx) — the wording for **About Us, Privacy Policy, Terms & Conditions** (all three live in one content list here).
  - [`src/pages/static/ReportInfringementPage.tsx`](src/pages/static/ReportInfringementPage.tsx) — the IP-complaint form (policy accordion, email OTP, listing URLs, evidence upload, declaration, success message).
  - [`src/pages/static/StaticPageShell.tsx`](src/pages/static/StaticPageShell.tsx) — the shared wrapper (header, back button, title, footer) so these feel native.
- **Purpose:** Footer-linked support/legal content.
- **Safe to edit?** **YES** for wording — edit the text in `ContentPage.tsx`.

### My Account (shell)
- **Route:** Click **My Account** (header) or open the hamburger menu → "My Account."
- **File:** [`src/pages/AccountPage.tsx`](src/pages/AccountPage.tsx) (it picks which sub-screen to show)
- **Purpose:** Wrapper that shows the account sidebar + the selected account screen.
- **Components used:** `AccountLayout`, `AccountSidebar`, plus one of the account sub-pages below.

The account sub-screens (all in [`src/pages/account/`](src/pages/account/)):

| Screen | File | Purpose |
|---|---|---|
| My Orders | `OrdersPage.tsx` | List of orders with status, filters, and per-order actions. Also **hosts** the three screens below (they open in place). |
| Order Details | `OrderDetailsPage.tsx` | One order's full breakdown. Opens from "View Order Details." |
| Tracking History | `TrackingHistoryPage.tsx` | Shipment timeline. Opens from "View Tracking History." |
| Returns & Refunds | `ReturnRequestPage.tsx` | 3-step return wizard (pick items → reasons + photos → submit). Opens from "Returns/Refund." |
| Know Your Customer (KYC) | `KYCPage.tsx` | Identity verification form + document uploads. |
| Notification | `NotificationsPage.tsx` | Notification preferences. |
| Account Information | `AccountInfoPage.tsx` | Name/email/profile details. |
| Address Book | `AddressesPage.tsx` | Saved addresses + add/edit form. |
| Payment Methods | `PaymentMethodsPage.tsx` | Saved cards + add card form. |
| 2 Step Verification | `TwoStepVerificationPage.tsx` | Two-factor setup. |

> **There is no separate "Order Success" page.** After "Quick Checkout," the **Razorpay payment popup** (`RazorpayModal.tsx`) appears.

---

# 3. Navigation Map

How the screens connect:

```text
Home  (src/app/page.tsx)
│
├── Top nav categories  (labels in src/components/home/Header.tsx)
│   ├── All Categories ──► opens the Mega Menu / Mobile Category Drawer
│   ├── Supplements
│   ├── Sports
│   ├── Bath
│   ├── Beauty
│   ├── Baby
│   └── Pets
│        └──► Category Page  (src/pages/CategoryPage.tsx)
│                 └──► Product Details  (src/pages/ProductDetailPage.tsx)
│
├── Product Details
│   ├──► Cart Drawer (slide-out)  (src/components/Cart/CartDrawer/CartDrawer.tsx)
│   │       └──► Checkout  (src/pages/CheckoutPage.tsx)
│   │               └──► Razorpay payment popup  (src/components/Checkout/RazorpayModal.tsx)
│   │
└── My Account  (src/pages/AccountPage.tsx)
    ├── My Orders            (account/OrdersPage.tsx)
    │   ├── Order Details        (account/OrderDetailsPage.tsx)
    │   ├── Tracking History     (account/TrackingHistoryPage.tsx)
    │   └── Returns & Refunds    (account/ReturnRequestPage.tsx)
    ├── Know Your Customer   (account/KYCPage.tsx)
    ├── Notification         (account/NotificationsPage.tsx)
    ├── Account Information  (account/AccountInfoPage.tsx)
    ├── Address Book         (account/AddressesPage.tsx)
    ├── Payment Methods      (account/PaymentMethodsPage.tsx)
    └── 2 Step Verification  (account/TwoStepVerificationPage.tsx)
```

Two more entry points sit outside the main tree:

```text
Header search bar  ──► Search Results  (pages/static/SearchResultsPage.tsx)   [/search?q=…]
                          └──► Product Details

Footer links  ──► About Us            (pages/static/ContentPage.tsx)          [/about-us]
              ├──► Privacy Policy      (pages/static/ContentPage.tsx)          [/privacy-policy]
              ├──► Terms & Conditions  (pages/static/ContentPage.tsx)          [/terms-and-conditions]
              └──► Report Infringement (pages/static/ReportInfringementPage.tsx) [/report-infringement]

Signed-out "My Account" click  ──► Sign-in box  (components/Account/SignInModal.tsx)
```

**Who controls the switching?** [`src/App.tsx`](src/App.tsx). It holds a "current view" and the buttons/links call functions (like "go to checkout") that change it. You rarely need to touch this file for UI text changes.

**The hamburger menu (mobile):** [`src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx`](src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx) — contains the category accordions **and** a "My Account" section at the bottom.

---

# 4. Component Library

Reusable building blocks. Each entry says whether it's **safe to edit** (text/colors usually yes; logic usually no).

### Header (top bar + nav)
- **Purpose:** Logo, search, account button, cart button, category nav, mobile search row.
- **Used on:** Home, Product, Category, Account (basically everywhere).
- **File:** [`src/components/home/Header.tsx`](src/components/home/Header.tsx)
- **Important content:** `NAV_ITEMS` array = the category labels in the top nav.
- **Safe to edit?** **YES** for labels/colors. Remember it appears on every page.

### Announcement Bar
- **Purpose:** The thin promo strip at the very top ("Fully operational…", "Ship to India").
- **Used on:** Home, Product, Category, Account.
- **File:** [`src/components/home/AnnouncementBar.tsx`](src/components/home/AnnouncementBar.tsx)
- **Safe to edit?** **YES** (it's just text + a pill).

### Footer
- **Purpose:** The premium multi-column footer: brand intro + social icons, then **Customer Support**, **Customer Services**, and **About Walherb** columns, plus a bottom band with payment chips, a **Secure Payment** badge, copyright, and **legal links** (Privacy Policy · Terms & Conditions · Report Infringement).
- **Used on:** Home, Product, and every static/info page.
- **File:** [`src/components/home/Footer.tsx`](src/components/home/Footer.tsx) (link lists are the `CUSTOMER_SERVICES`, `ABOUT_LINKS`, and `LEGAL_LINKS` arrays near the top).
- **Safe to edit?** **YES** for link text. Links with a `path` actually navigate (to the info/legal pages); the rest are placeholders. The ↗ arrow shows automatically on links that open a real page.

### Search Bar
- **Purpose:** The "Search 50,000+ wellness products" field.
- **Used on:** Header (desktop inline + a separate mobile row).
- **File:** [`src/components/home/Header.tsx`](src/components/home/Header.tsx)
- **Safe to edit?** **YES** for placeholder text. **It now works:** typing a term and pressing Enter (or clicking the magnifier) opens the **Search Results page** (`/search?q=…`, file [`src/pages/static/SearchResultsPage.tsx`](src/pages/static/SearchResultsPage.tsx)).

### Product Card (home rails)
- **Purpose:** The small product tile (image, title, rating, price, ADD button) used in home page rows.
- **Used on:** Home page rows (`ProductSection`).
- **File:** [`src/components/home/ProductCard.tsx`](src/components/home/ProductCard.tsx)
- **Safe to edit?** **YES** for styling. Don't change the `Product` shape.

### Product Grid / Rail
- **Purpose:** A titled, horizontally scrolling row of product cards.
- **Used on:** Home page.
- **File:** [`src/components/home/ProductSection.tsx`](src/components/home/ProductSection.tsx)
- **Safe to edit?** **YES** for title/spacing.

### Catalog Product Card (category page)
- **Purpose:** The product card used in the category grid (different from the home card).
- **Used on:** Category page.
- **File:** [`src/components/category/CatalogProductCard.tsx`](src/components/category/CatalogProductCard.tsx)
- **Safe to edit?** **YES** for styling.

### Category Sidebar + Filters
- **Purpose:** Left-hand filters on the category page.
- **Used on:** Category page.
- **Files:** [`src/components/category/CategorySidebar.tsx`](src/components/category/CategorySidebar.tsx), [`src/components/category/FilterSystem.tsx`](src/components/category/FilterSystem.tsx)
- **Safe to edit?** **YES** for filter labels; be careful with filter logic.

### All Categories Mega Menu
- **Purpose:** The big dropdown panel under the nav.
- **Used on:** Header (desktop).
- **Files:** [`src/components/navigation/CategoryMegaMenu/MegaMenuPanel.tsx`](src/components/navigation/CategoryMegaMenu/MegaMenuPanel.tsx) (looks) + `categoryMenuData.ts` (the menu **content/labels**).
- **Safe to edit?** **YES** — edit labels in `categoryMenuData.ts`.

### Mobile Category Drawer (hamburger)
- **Purpose:** Slide-in menu on mobile with categories + a "My Account" section.
- **File:** [`src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx`](src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx)
- **Safe to edit?** **YES** for labels (see `ACCOUNT_ITEMS` for the account links).

### Secure Checkout Panel (a.k.a. the "buy box")
- **Purpose:** The product page panel with price, quantity, delivery estimate, payment trust badges, and Buy Now.
- **Used on:** Product Details page.
- **Files:** [`src/components/Product/ProductPurchasePanel/`](src/components/Product/ProductPurchasePanel/) — `ProductPurchasePanel.tsx` (main), plus `QuantitySelector.tsx`, `DeliveryEstimator.tsx`, `PaymentMethods.tsx`, `TrustBadges.tsx`.
- **Safe to edit?** **YES** for text/badges; careful with price/quantity logic.

### Cart Drawer
- **Purpose:** The slide-out cart from the right.
- **Used on:** Everywhere (opens from the Cart button).
- **Files:** [`src/components/Cart/CartDrawer/`](src/components/Cart/CartDrawer/) — `CartDrawer.tsx` (main), `CartItemRow.tsx`, `OrderSummary.tsx`, `PromoCode.tsx`, `CheckoutActions.tsx`, `CartNotice.tsx`.
- **Safe to edit?** **YES** for labels/styling.

### Order Card + Package Status
- **Purpose:** Each order block on My Orders. It's now **Amazon-style**: a plain status heading per package (e.g. "Arriving by Jun 20", "Delivered", "Cancelled") + a small coloured-dot subtext, and per-package action buttons — **no big coloured pill or progress stepper anymore**. One order can contain several packages, each with its own status.
- **Used on:** My Orders **and** Order Details (they share the same package-card layout).
- **Files:** [`src/pages/account/OrdersPage.tsx`](src/pages/account/OrdersPage.tsx) (the `OrderCard` and status text/logic) and [`src/pages/account/orderPackageUI.tsx`](src/pages/account/orderPackageUI.tsx) (the **shared** package card reused by both pages — status headings, the coloured dot, and the product rows live here).
- **Safe to edit?** **YES** for status wording/colors (see Section 6).

### Quick-Pay / Razorpay Badge
- **Purpose:** The little "stacked payment icons + Razorpay" badge shown on the **Buy Now** and **Quick Checkout** buttons.
- **Used on:** Product buy box, Cart drawer, Checkout page.
- **File:** [`src/components/payments/QuickPayBadge.tsx`](src/components/payments/QuickPayBadge.tsx)
- **Safe to edit?** **CAREFUL** — it's drawn with inline SVG (so it never breaks from expired image links). Edit colors/sizes; leave the SVG paths alone unless you're comfortable.

### "Sold by" Modal
- **Purpose:** The info popup that explains sourcing when you click the ⓘ next to "Sold by" on a product.
- **File:** [`src/components/Product/SoldByModal.tsx`](src/components/Product/SoldByModal.tsx)
- **Safe to edit?** **YES** for the wording/paragraphs.

### Sign-in Box
- **Purpose:** The sign-in dialog that appears when a signed-out shopper clicks **My Account**.
- **File:** [`src/components/Account/SignInModal.tsx`](src/components/Account/SignInModal.tsx)
- **Safe to edit?** **YES** for labels/text.

### Tracking Timeline
- **Purpose:** Shipment progress list.
- **File:** [`src/pages/account/TrackingHistoryPage.tsx`](src/pages/account/TrackingHistoryPage.tsx)
- **Safe to edit?** **YES** for labels.

### Return Request Form
- **Purpose:** The 3-step returns wizard.
- **File:** [`src/pages/account/ReturnRequestPage.tsx`](src/pages/account/ReturnRequestPage.tsx)
- **Safe to edit?** **YES** for labels and the `RETURN_REASONS` list; the table/stepper logic is more delicate.

### KYC Form + Verified Dashboard
- **Purpose:** Identity verification for Indian imports. It's one screen with **three states**: the **form** (Full Name + upload PAN card + upload Aadhaar card), an **"Under review"** dashboard, and a **"Verified"** dashboard (success card + timeline + customer details).
- **Files:** [`src/pages/account/KYCPage.tsx`](src/pages/account/KYCPage.tsx) (all three states) and [`src/pages/account/kycStore.ts`](src/pages/account/kycStore.ts) (the saved record: status, documents, reference id, timestamps).
- **Safe to edit?** **YES** for labels, the "Why is KYC required?" copy, and the timeline wording.

### Address Form
- **Purpose:** Saved addresses + add/edit.
- **File:** [`src/pages/account/AddressesPage.tsx`](src/pages/account/AddressesPage.tsx)
- **Safe to edit?** **YES** for labels/placeholders.

### Payment Method Card
- **Purpose:** Saved card tiles + add-card form.
- **File:** [`src/pages/account/PaymentMethodsPage.tsx`](src/pages/account/PaymentMethodsPage.tsx)
- **Safe to edit?** **YES** for labels.

### Shared Button & Input (design system)
- **Purpose:** Standardized button and input building blocks.
- **Files:** [`src/design-system/components/Button/Button.tsx`](src/design-system/components/Button/Button.tsx), [`src/design-system/components/Input/Input.tsx`](src/design-system/components/Input/Input.tsx)
- **Safe to edit?** **CAREFUL** — changes ripple anywhere these are used.

---

# 5. Styling Guide

The shared design values live in **[`src/design-system/tokens/`](src/design-system/tokens/)**.

### Colors
- **File:** [`src/design-system/tokens/colors.ts`](src/design-system/tokens/colors.ts)
- Two groups:
  - `colors` — numbered palettes (`primaryGold`, `successGreen`, `forestGreen`, `neutral`, `slate`).
  - `walherb` — the **named brand colors actually used** (e.g. `greenPrimary: '#476D59'` for the header/cart, `greenDark: '#1F322A'` for the footer, `announcement: '#D5A310'`).

```text
Want to change the main green (header/cart/logo)?
Open: src/design-system/tokens/colors.ts
Edit: walherb.greenPrimary
```

### Typography (fonts)
- **File:** [`src/design-system/tokens/typography.ts`](src/design-system/tokens/typography.ts)
- Defines font family, weights (`regular`, `medium`, `semiBold`, `bold`), and sizes (`t1–t4` titles, `b1–b4` body, plus display sizes).
- The actual fonts (DM Sans, Space Grotesk, Pacifico) are wired up in [`src/app/layout.tsx`](src/app/layout.tsx) / `globals.css`.

### Spacing
- **File:** [`src/design-system/tokens/spacing.ts`](src/design-system/tokens/spacing.ts)
- A scale (`s2`=2px … `s120`=120px) plus semantic names (`pageMobile`, `gapLg`, etc.).

```text
Want consistent spacing?
Open: src/design-system/tokens/spacing.ts
Use values like spacing.s16 (= 16px)
```

### Corner radius (rounded corners)
- **File:** [`src/design-system/tokens/radius.ts`](src/design-system/tokens/radius.ts)
- `radius2 … radius32`, plus `radiusFull` (pill/round).

### Theme
- **File:** [`src/design-system/theme.ts`](src/design-system/theme.ts) — wires the tokens into MUI.

> **Important reality check:** Because many screens use exact values typed inline (like `color: '#476D59'` or `borderRadius: '12px'`), changing a token may not update that screen. To change one specific element, open its file and edit the value right there (Section 10 shows how to find it).

---

# 6. Common UI Changes

### Change a Navigation Label (top nav)
- **Where:** The category names in the header (e.g. "Supplements").
- **File:** [`src/components/home/Header.tsx`](src/components/home/Header.tsx) → the `NAV_ITEMS` array.
- **Example:** change `{ label: 'Supplements', … }` to `{ label: 'Health Supplements', … }`.
- (Mega menu sub-labels live in [`src/components/navigation/CategoryMegaMenu/categoryMenuData.ts`](src/components/navigation/CategoryMegaMenu/categoryMenuData.ts).)

### Change Account Menu Labels
- **Files:** [`src/components/Account/AccountSidebar.tsx`](src/components/Account/AccountSidebar.tsx) (`NAV_ITEMS`) and [`src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx`](src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx) (`ACCOUNT_ITEMS`). Update **both** so desktop and mobile match.

### Add / Edit a Category
- **Where:** The catalog and menu content.
- **Files:**
  - Catalog data + category definitions: [`src/data/categoryData.ts`](src/data/categoryData.ts)
  - Mega menu structure: [`src/components/navigation/CategoryMegaMenu/categoryMenuData.ts`](src/components/navigation/CategoryMegaMenu/categoryMenuData.ts)
  - Top-nav entry: [`src/components/home/Header.tsx`](src/components/home/Header.tsx) (`NAV_ITEMS`)

### Change Button Text
- **Where:** Buttons are usually labeled right where they're used. Search the page file for the current text.
- **Examples:**
  - "Pay Now" / "Quick Checkout": [`src/pages/CheckoutPage.tsx`](src/pages/CheckoutPage.tsx)
  - "Buy Now": [`src/components/Product/ProductPurchasePanel/ProductPurchasePanel.tsx`](src/components/Product/ProductPurchasePanel/ProductPurchasePanel.tsx)
  - "ADD": [`src/components/home/ProductCard.tsx`](src/components/home/ProductCard.tsx)
  - "Proceed to checkout": [`src/components/Cart/CartDrawer/CheckoutActions.tsx`](src/components/Cart/CartDrawer/CheckoutActions.tsx)

### Change Order Status Labels / Colors
- **File:** [`src/pages/account/OrdersPage.tsx`](src/pages/account/OrdersPage.tsx)
- **Where in the file:** the `OrderStatus` list (the allowed statuses), `STATUS_STYLES` (the pill colors), and `FILTER_CHIPS` (the filter buttons: "All Order, Delivered, Processing, Shipped, Cancelled").

### Add a New Filter (category page)
- **File:** [`src/components/category/FilterSystem.tsx`](src/components/category/FilterSystem.tsx) (filter options + UI). Filter data may also reference [`src/data/categoryData.ts`](src/data/categoryData.ts).

### Edit Footer Links
- **File:** [`src/components/home/Footer.tsx`](src/components/home/Footer.tsx) — edit the `CUSTOMER_SERVICES`, `ABOUT_LINKS`, and `LEGAL_LINKS` arrays. Give a link a `path` to make it open a real page; leave `path` off to keep it a placeholder.

### Edit About / Privacy / Terms Wording
- **File:** [`src/pages/static/ContentPage.tsx`](src/pages/static/ContentPage.tsx) → the `CONTENT` object holds the title, intro, and section paragraphs for all three pages. Edit the strings.

### Edit the Report-Infringement Form
- **File:** [`src/pages/static/ReportInfringementPage.tsx`](src/pages/static/ReportInfringementPage.tsx) → labels, the `POLICY` accordion text, and the `COMPLAINT_TYPES` list. (The demo email code is `123456`.)

### Change Search Behavior / Empty-State Text
- **Files:** [`src/components/home/Header.tsx`](src/components/home/Header.tsx) (the search field + Enter handler) and [`src/pages/static/SearchResultsPage.tsx`](src/pages/static/SearchResultsPage.tsx) (results grid, "no matches" wording, and which fields are searched).

### Change Return Reasons
- **File:** [`src/pages/account/ReturnRequestPage.tsx`](src/pages/account/ReturnRequestPage.tsx) → the `RETURN_REASONS` list.

### Change KYC Wording / Timeline
- **File:** [`src/pages/account/KYCPage.tsx`](src/pages/account/KYCPage.tsx) → the form labels, the "Why is KYC required?" points (`WHY_POINTS`), and the verified-state timeline text (`buildTimeline`). The form collects a Full Name + PAN and Aadhaar uploads (no typed ID numbers).

### Change the Indian States dropdown (checkout/address)
- **File:** [`src/pages/CheckoutPage.tsx`](src/pages/CheckoutPage.tsx) → `INDIAN_STATES`.

### Change Home Page Product Rows
- **File:** [`src/app/page.tsx`](src/app/page.tsx) → `TRENDING` (the product list) and `SECTIONS` (the row titles).

---

# 7. User Flow Documentation

### Main purchase flow
```text
Product Page  (ProductDetailPage.tsx)
↓ Buy Now / Add
Cart Drawer  (Cart/CartDrawer/CartDrawer.tsx)
↓ Proceed to checkout
Checkout  (CheckoutPage.tsx)
↓ Pay Now / Quick Checkout
Razorpay popup  (Checkout/RazorpayModal.tsx)
↓
My Orders  (account/OrdersPage.tsx)
↓ View Order Details
Order Details  (account/OrderDetailsPage.tsx)
```

### Returns flow
```text
My Orders  (account/OrdersPage.tsx)
↓ Returns / Refund
Step 1: Select products + return quantity
↓
Step 2: Choose reason  (RETURN_REASONS) + upload photos
↓
Step 3: Review + Submit request
   (all inside account/ReturnRequestPage.tsx)
```

### KYC flow
```text
My Account  (AccountPage.tsx)
↓ Know Your Customer (KYC)
STATE 1 — Form: Full Name + upload PAN card + upload Aadhaar card
↓ Submit for Verification
STATE 2 — "Under review" dashboard (status card + timeline)
↓ (approved)
STATE 3 — "Verified" dashboard
          (success card + timeline + customer-details card)
   (all three states live in account/KYCPage.tsx; data in account/kycStore.ts)
```

### Search flow
```text
Header search bar  →  type a term + Enter  →  /search?q=…
Search Results grid  (pages/static/SearchResultsPage.tsx)
↓ click a result
Product Details  (ProductDetailPage.tsx)
```

### Tracking flow
```text
My Orders  →  View Tracking History  →  Tracking timeline
   (account/OrdersPage.tsx → account/TrackingHistoryPage.tsx)
```

---

# 8. Important Files Cheat Sheet

**This is the section to bookmark.**

| I want to change… | Open this file |
|---|---|
| Header / top nav / logo / search | [`src/components/home/Header.tsx`](src/components/home/Header.tsx) |
| Promo strip (top bar) | [`src/components/home/AnnouncementBar.tsx`](src/components/home/AnnouncementBar.tsx) |
| Footer | [`src/components/home/Footer.tsx`](src/components/home/Footer.tsx) |
| Top-nav category labels | [`src/components/home/Header.tsx`](src/components/home/Header.tsx) (`NAV_ITEMS`) |
| Mega menu content | [`src/components/navigation/CategoryMegaMenu/categoryMenuData.ts`](src/components/navigation/CategoryMegaMenu/categoryMenuData.ts) |
| Mobile hamburger menu | [`src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx`](src/components/navigation/CategoryMegaMenu/MobileCategoryDrawer.tsx) |
| Home page (hero, rows, sections) | [`src/app/page.tsx`](src/app/page.tsx) |
| Product card (home) | [`src/components/home/ProductCard.tsx`](src/components/home/ProductCard.tsx) |
| Product Details page | [`src/pages/ProductDetailPage.tsx`](src/pages/ProductDetailPage.tsx) |
| Product "buy box" panel | [`src/components/Product/ProductPurchasePanel/ProductPurchasePanel.tsx`](src/components/Product/ProductPurchasePanel/ProductPurchasePanel.tsx) |
| Category page + grid | [`src/pages/CategoryPage.tsx`](src/pages/CategoryPage.tsx) |
| Category filters | [`src/components/category/FilterSystem.tsx`](src/components/category/FilterSystem.tsx) |
| Checkout | [`src/pages/CheckoutPage.tsx`](src/pages/CheckoutPage.tsx) |
| Cart Drawer | [`src/components/Cart/CartDrawer/CartDrawer.tsx`](src/components/Cart/CartDrawer/CartDrawer.tsx) |
| Payment popup | [`src/components/Checkout/RazorpayModal.tsx`](src/components/Checkout/RazorpayModal.tsx) |
| Razorpay / Quick-Pay badge | [`src/components/payments/QuickPayBadge.tsx`](src/components/payments/QuickPayBadge.tsx) |
| Search results page | [`src/pages/static/SearchResultsPage.tsx`](src/pages/static/SearchResultsPage.tsx) |
| About / Privacy / Terms wording | [`src/pages/static/ContentPage.tsx`](src/pages/static/ContentPage.tsx) |
| Report Infringement form | [`src/pages/static/ReportInfringementPage.tsx`](src/pages/static/ReportInfringementPage.tsx) |
| Sign-in box | [`src/components/Account/SignInModal.tsx`](src/components/Account/SignInModal.tsx) |
| Shared package/order card | [`src/pages/account/orderPackageUI.tsx`](src/pages/account/orderPackageUI.tsx) |
| Account shell + sidebar | [`src/pages/AccountPage.tsx`](src/pages/AccountPage.tsx), [`src/components/Account/AccountSidebar.tsx`](src/components/Account/AccountSidebar.tsx) |
| My Orders + status pills | [`src/pages/account/OrdersPage.tsx`](src/pages/account/OrdersPage.tsx) |
| Order Details | [`src/pages/account/OrderDetailsPage.tsx`](src/pages/account/OrderDetailsPage.tsx) |
| Tracking History | [`src/pages/account/TrackingHistoryPage.tsx`](src/pages/account/TrackingHistoryPage.tsx) |
| Returns / Refunds | [`src/pages/account/ReturnRequestPage.tsx`](src/pages/account/ReturnRequestPage.tsx) |
| KYC | [`src/pages/account/KYCPage.tsx`](src/pages/account/KYCPage.tsx) |
| Address Book | [`src/pages/account/AddressesPage.tsx`](src/pages/account/AddressesPage.tsx) |
| Payment Methods | [`src/pages/account/PaymentMethodsPage.tsx`](src/pages/account/PaymentMethodsPage.tsx) |
| Account Information | [`src/pages/account/AccountInfoPage.tsx`](src/pages/account/AccountInfoPage.tsx) |
| Notifications | [`src/pages/account/NotificationsPage.tsx`](src/pages/account/NotificationsPage.tsx) |
| Colors | [`src/design-system/tokens/colors.ts`](src/design-system/tokens/colors.ts) |
| Fonts / type sizes | [`src/design-system/tokens/typography.ts`](src/design-system/tokens/typography.ts) |
| Spacing | [`src/design-system/tokens/spacing.ts`](src/design-system/tokens/spacing.ts) |
| Corner radius | [`src/design-system/tokens/radius.ts`](src/design-system/tokens/radius.ts) |

---

# 9. Before Editing Anything

A simple traffic-light system.

### 🟢 Safe to edit (go ahead)
These are mostly **text, labels, colors, spacing**:
- Page files in [`src/pages/`](src/pages/) and [`src/pages/account/`](src/pages/account/)
- Home pieces in [`src/components/home/`](src/components/home/) (Header, Footer, AnnouncementBar, cards)
- Menu labels in `categoryMenuData.ts`, `MobileCategoryDrawer.tsx`
- Sample data in [`src/data/categoryData.ts`](src/data/categoryData.ts) and the data lists at the top of page files (`TRENDING`, `RETURN_REASONS`, `ID_TYPES`, `INDIAN_STATES`, `FILTER_CHIPS`)
- Token values in [`src/design-system/tokens/`](src/design-system/tokens/)

**What "safe" means:** if you only change text inside quotes (`'Like this'`) or a color/number value, you generally can't break the app's behavior.

### 🟡 Edit carefully (it affects many places)
- [`src/components/home/Header.tsx`](src/components/home/Header.tsx) and `Footer.tsx` — shown on **every** page.
- [`src/design-system/components/Button/`](src/design-system/components/Button/) and `Input/` — shared building blocks.
- [`src/design-system/tokens/`](src/design-system/tokens/) — central values; a change can ripple widely.
- Anything where you'd change **structure** (adding/removing whole blocks) rather than text.

**Tip:** change one thing, save, and look at the screen before changing the next.

### 🔴 Avoid unless you really know why
These control how the app *works*, not how it *looks*:
- [`src/App.tsx`](src/App.tsx) — the screen switcher.
- [`src/main.tsx`](src/main.tsx), [`src/app/providers.tsx`](src/app/providers.tsx), [`src/app/layout.tsx`](src/app/layout.tsx) — app startup.
- [`src/context/CartContext.tsx`](src/context/CartContext.tsx) — cart logic.
- Anything that looks like logic: `useState`, `useEffect`, `.map(...)`, `onClick={...}`, function definitions. **Edit the text inside, not the surrounding code.**

### Golden rules
1. **Only change what's inside quotes** for text, and **only the value** for colors/sizes.
2. **Don't delete** brackets `{ } ( ) < >`, commas, or `import` lines.
3. If VS Code underlines something in **red** after your edit, undo (Cmd/Ctrl+Z) — that's an error.
4. When unsure, copy the file's contents somewhere first, or ask a developer.

---

# 10. Designer Notes

Practical tricks for working in VS Code without developer help.

### How to find a page quickly
- Use **Cmd+P** (Mac) / **Ctrl+P** (Windows) and type part of the file name, e.g. `Checkout` → `CheckoutPage.tsx`.
- Use the **Cheat Sheet (Section 8)** to map "thing I see" → "file."

### How to find where a piece of text comes from
This is the **most useful trick**:
1. Look at the exact words on screen (e.g. `Pay Now` or `Returns/Refund`).
2. In VS Code press **Cmd+Shift+F** (Mac) / **Ctrl+Shift+F** (Windows) — this is **search across all files**.
3. Type the text. VS Code shows every file containing it.
4. Click the result; you're taken straight to the line. Edit the text inside the quotes.

> If the text is split or dynamic (e.g. it shows a name from data), search for the **fixed part** around it (like `Items Total` or `Estimated Refund`).

### How to identify which component renders a section
- Open the page file from the Cheat Sheet.
- The big building blocks are usually **named tags** near the top of the page, e.g. `<Header />`, `<Footer />`, `<ProductPurchasePanel />`. The name tells you which file to open (a `<Header />` lives in `Header.tsx`).
- The `import` lines at the very top of each file list **exactly which files** its pieces come from — follow those paths.

### How to trace a button to its destination
- Find the button in its file (search for its label).
- Look for `onClick={...}` next to it. The name inside (e.g. `onClick={onQuickCheckout}` or `handlePayNow`) tells you what it does.
- Functions named `onBack`, `onLogoClick`, `onProceedToCheckout`, `onAccountNavigate` describe where they go. The wiring for these lives in [`src/App.tsx`](src/App.tsx).

### How to locate data sources (where the lists come from)
- Many lists are **capitalized constants** at the top of a file, e.g. `TRENDING`, `SECTIONS`, `RETURN_REASONS`, `ID_TYPES`, `INDIAN_STATES`, `STATUS_STYLES`, `FILTER_CHIPS`.
- The category catalog lives in [`src/data/categoryData.ts`](src/data/categoryData.ts); the mega-menu content in `categoryMenuData.ts`.
- Edit the values inside these lists to change what's displayed.

### How to update icons
- Icons come from **Material UI Icons**. In a file you'll see lines like `import SearchIcon from '@mui/icons-material/Search';` and then `<SearchIcon ... />`.
- To swap an icon: change the import name to another icon (browse names at the MUI Icons gallery), and update the tag to match. Example: replace `Search` with `ShoppingBag` in both the import and the tag.
- To resize/recolor: the icon usually has `sx={{ fontSize: 16, color: '#...' }}` — change those values.

### How to update images
- **Static images** (banners): drop your file into [`public/Images/`](public/Images/) and reference it as `'/Images/yourfile.svg'`. Hero banners are listed in [`src/components/home/HeroBanner.tsx`](src/components/home/HeroBanner.tsx).
- **Product images:** many point to remote Figma URLs in the data lists (these can expire). To use a permanent image, put it in [`public/Images/`](public/Images/) and replace the URL string with `'/Images/yourfile.png'`.

### Reading responsive sizes (mobile vs desktop)
- You'll see values like `fontSize: { xs: 16, md: 24 }` or `display: { xs: 'none', md: 'block' }`.
- `xs` = phone, `sm` = small tablet, `md` = desktop. So `{ xs: 16, md: 24 }` means "16px on phones, 24px on desktop."
- **To change only the phone version,** edit the `xs:` value and leave `md:` alone (and vice-versa). The project rule is: **never change the desktop (`md`) values when doing mobile tweaks.**

### A safe editing loop
1. Find the file (Section 8) → find the text/value (Cmd+Shift+F).
2. Change **one** thing.
3. Save. The running app (`npm run dev`) refreshes automatically.
4. Look at the screen. Good? Repeat. Broken/red underline? Undo.

---

*Generated from the actual Walherb codebase. If a file path here ever stops matching what you see, trust the live files — search for the on-screen text (Cmd+Shift+F) to find the current location.*
