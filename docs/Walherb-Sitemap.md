# Walherb — Sitemap

| | |
|---|---|
| **Document** | Walherb Platform — Sitemap & Information Architecture |
| **Version** | 1.0 |
| **Status** | Reflects current prototype (React SPA, state-driven navigation) |
| **Date** | 18 September 2026 |
| **Source of truth** | `src/App.tsx` (`AppView` union + `viewFromUrl()`) |

> **How to read this document.** Walherb is a single-page app. Most screens are switched by in-memory state (`AppView`) rather than the browser URL — so most "pages" below do **not** have a real, shareable/bookmarkable link today. A handful of routes are wired to real URLs (deep links that survive refresh/back-forward); those are marked **[Deep link]** with their path. Everything else is marked **[Virtual]** — reachable only by clicking through the app from Home.

---

## 1. Top-level map

```
Home ( / )
├── Category Browse                         [Virtual]
│   └── Product Detail Page                 [Virtual]
├── Search Results                          [Deep link]  /search?q=...
├── Product Detail Page                     [Virtual]     (also reached from Home/Trending rows)
├── Cart Drawer                             (overlay, not a page)
├── Checkout                                [Virtual]
│   └── Razorpay Payment Modal              (overlay)
├── Account (signed-in area)                [Virtual, tabs below]
│   ├── My Orders
│   │   └── Order Details
│   │       └── Tracking                    [Deep link]   /track-order/:trackingNumber
│   ├── Know Your Customer (KYC)            [Deep link]   /account/kyc, /account/kyc/status, /account/kyc/verified
│   ├── Notifications
│   ├── Account Information
│   ├── Address Book
│   ├── Payment Methods
│   ├── 2-Step Verification
│   └── Returns / Refund Request
├── Static / Legal Pages
│   ├── About Us                            [Deep link]   /about-us
│   ├── Privacy Policy                      [Deep link]   /privacy-policy
│   └── Terms & Conditions                  [Deep link]   /terms-and-conditions
├── Report Infringement                     [Deep link]   /report-infringement
└── Auth
    ├── Sign In Modal                       (overlay)
    └── Settings Popup                      (overlay, menu on avatar click)
```

---

## 2. Page-by-page detail

### 2.1 Home (`/`)
- **File**: `src/app/page.tsx`
- **Access**: default view; logo click from anywhere returns here.
- **Contains**: Announcement bar → Header (with category mega menu) → Hero banner → Trust bar → 5 product carousels (Trending this week, Customer Favourites, New Arrivals, Vitamins & Supplements, Beauty & Skincare) → Why Walherb → FAQ → Footer.

### 2.2 Category Browse — `CategoryPage`
- **File**: `src/pages/CategoryPage.tsx`
- **Access**: [Virtual] — via header mega menu or category links; no URL segment per category today.
- **Categories** (`src/data/categoryData.ts`):
  - **Supplements** (`supplements`)
    - Vitamins (`vitamins`) → Vitamin C, Vitamin D, Vitamin B Complex, Multivitamins
    - Minerals (`minerals`) → Magnesium, Zinc, Iron, Calcium
    - Probiotics (`probiotics`)
    - Herbal (`herbal`) → Ashwagandha, Turmeric, Mushroom Blends
    - Sports (`sports`) → Protein, Creatine, Pre-Workout
    - Digestive Health (`digestive`)
    - Immune Support (`immune`)
    - Women's Health (`womens`)
    - Men's Health (`mens`)
    - Baby & Kids (`baby-kids`)
    - Beauty Supplements (`beauty`)
  - **Travel & Accessories** (`travel-accessories`)
    - Cable Organizers, Travel Pouches, Storage Bags, Travel Kits
- **Contains**: category sidebar (filter tree) + filter system (price, brand, rating) + product grid.

### 2.3 Search Results (`/search?q=`)
- **File**: `src/pages/static/SearchResultsPage.tsx`
- **Access**: [Deep link] — query param `q`, populated from the header search box.

### 2.4 Product Detail Page (PDP)
- **File**: `src/pages/ProductDetailPage.tsx` (+ `src/pages/pdp/` registry/templates)
- **Access**: [Virtual] — opened from any product card (Home carousels, Category grid, Search results).
- **Category-driven templates** (`src/pages/pdp/templates/registry.tsx`): `SUPPLEMENT`, `SPORTS`, `BEAUTY`, `BABY`, `PETS`, `TRAVEL_ACCESSORIES`, `PERSONAL_CARE`, `GENERAL` (generic fallback).
- **Contains**: gallery, purchase panel (variant/quantity/delivery estimator/payment methods/trust badges), "Sold by" modal, JSON-LD SEO block.

### 2.5 Cart Drawer (overlay)
- **File**: `src/components/Cart/CartDrawer/CartDrawer.tsx`
- **Access**: opens from header cart icon or after "Buy Now"; not a standalone page.
- **Contains**: item rows, promo code, order summary, checkout actions (Proceed to Checkout / Quick Checkout).

### 2.6 Checkout
- **File**: `src/pages/CheckoutPage.tsx`
- **Access**: [Virtual] — via "Proceed to Checkout" in the cart drawer.
- **Quick Checkout** opens the **Razorpay Payment Modal** (`src/components/Checkout/RazorpayModal.tsx`) as an overlay instead.

### 2.7 Account area
- **File**: `src/pages/AccountPage.tsx` + `src/components/Account/AccountLayout.tsx` / `AccountSidebar.tsx`
- **Access**: [Virtual] (except KYC, see below) — via avatar → Settings popup, or header account icon.
- **Sections** (`AccountSection` union):
  | Section | File |
  |---|---|
  | My Orders | `src/pages/account/OrdersPage.tsx` → `OrderDetailsPage.tsx` |
  | Know Your Customer (KYC) | `src/pages/account/KYCPage.tsx` — **[Deep link]** `/account/kyc`, `/account/kyc/status`, `/account/kyc/verified` |
  | Notifications | `src/pages/account/NotificationsPage.tsx` |
  | Account Information | `src/pages/account/AccountInfoPage.tsx` |
  | Address Book | `src/pages/account/AddressesPage.tsx` |
  | Payment Methods | `src/pages/account/PaymentMethodsPage.tsx` |
  | 2-Step Verification | `src/pages/account/TwoStepVerificationPage.tsx` |
  | Return Request | `src/pages/account/ReturnRequestPage.tsx` (3-step return wizard) |
- **Order Details → Tracking**: `OrderDetailsPage` links to **Tracking** (`src/pages/TrackingPage.tsx`) — **[Deep link]** `/track-order/:trackingNumber`. Back button returns to whichever screen it was opened from (Orders list or Order Details).

### 2.8 Static / legal pages
- **File**: `src/pages/static/ContentPage.tsx` (`ContentSlug = 'about' | 'privacy' | 'terms'`)
- **[Deep link]**:
  - `/about-us` → About Us
  - `/privacy-policy` → Privacy Policy
  - `/terms-and-conditions` → Terms & Conditions

### 2.9 Report Infringement (`/report-infringement`)
- **File**: `src/pages/static/ReportInfringementPage.tsx`
- **Access**: [Deep link] — linked from the footer.

### 2.10 Auth overlays
- **Sign In Modal** — `src/components/Account/SignInModal.tsx` (triggered when a signed-out user opens an account-gated action).
- **Settings Popup** — `src/components/Account/SettingsPopup.tsx` (avatar menu: navigate to account sections, sign out).

---

## 3. Deep-linkable URLs (survive refresh / back-forward today)

| Path | Resolves to |
|---|---|
| `/` | Home |
| `/search?q=...` | Search Results |
| `/about-us` | About Us |
| `/privacy-policy` | Privacy Policy |
| `/terms-and-conditions` | Terms & Conditions |
| `/report-infringement` | Report Infringement |
| `/account/kyc`, `/account/kyc/status`, `/account/kyc/verified` | Account → KYC |
| `/track-order/:trackingNumber` | Tracking page |

All other views (Category, Product Detail, Checkout, Account tabs other than KYC) are **in-memory state only** — reloading the page or sharing the URL drops back to Home. `[RECOMMENDATION]` if SEO/shareable PDP and category links are needed, extend `viewFromUrl()` / route table with `/category/:id` and `/product/:id` paths.

---

## 4. Global chrome (present on most pages)

- **Announcement Bar** — `src/components/home/AnnouncementBar.tsx`
- **Header** (logo, category mega menu, search, account, cart) — `src/components/home/Header.tsx`, mega menu in `src/components/navigation/CategoryMegaMenu/`
- **Footer** (customer service, about, legal, socials, payment badges) — `src/components/home/Footer.tsx`
- Static pages, Checkout, Account, Product Detail, Category, Search, Tracking, and Report Infringement all render their own header/back-nav via a shared `StaticPageShell` / page-level header pattern rather than the full Home header.
