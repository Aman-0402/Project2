# LUXE PARFUM — AGENT.md
> Living project tracking document. Update after every completed step.

---

## PROJECT OVERVIEW

**Name:** LUXE PARFUM (placeholder — configurable via env)
**Type:** Luxury Perfume Brand Showcase Website
**Model:** Admin-only platform. No customer accounts. WhatsApp-driven conversions.
**Goal:** Premium perfume showcase with cinematic UI, admin product management, and WhatsApp contact integration.

---

## ARCHITECTURE

```
[Next.js Frontend] ←→ [DRF Backend API] ←→ [MySQL Database]
        ↓                     ↓
   Vercel Deploy         VPS / Render
        ↓                     ↓
  /admin routes         Cloudinary (images)
  (JWT protected)       SimpleJWT (auth)
```

- Frontend: Next.js 14 App Router, Tailwind CSS, Framer Motion
- Backend: Django 5, Django REST Framework
- Database: MySQL
- Image Storage: Cloudinary
- Auth: JWT via SimpleJWT (admin-only)
- Frontend Deploy: Vercel
- Backend Deploy: VPS or Render

---

## TECH STACK

| Layer         | Technology                    | Version  |
|---------------|-------------------------------|----------|
| Frontend      | Next.js                       | 14.x     |
| Styling       | Tailwind CSS                  | 3.x      |
| Animation     | Framer Motion                 | 11.x     |
| Backend       | Django                        | 5.0.6    |
| API           | Django REST Framework         | 3.15.2   |
| Auth          | SimpleJWT                     | 5.3.1    |
| Database      | MySQL                         | 8.x      |
| Images        | Cloudinary                    | 1.40.0   |
| CORS          | django-cors-headers           | 4.4.0    |
| Fonts         | Cormorant Garamond + Poppins  | Google   |

---

## DESIGN SYSTEM

```
Color Palette:
  Ivory:        #F8F4EC   (backgrounds)
  Golden Brown: #B08D57   (accents, CTAs, borders)
  Deep Brown:   #4A3428   (headings, strong text)
  Soft Beige:   #E8DED1   (cards, secondary backgrounds)

Typography:
  Headings: Cormorant Garamond (elegant serif)
  Body:     Poppins (clean sans-serif)

Animation:
  Style: smooth, subtle, cinematic
  Library: Framer Motion
  Triggers: scroll-based, hover, entrance
```

---

## DATABASE STRUCTURE

### categories
| Column      | Type         | Notes          |
|-------------|--------------|----------------|
| id          | INT PK AI    |                |
| name        | VARCHAR(100) | e.g. "Oud"     |
| slug        | VARCHAR(100) | unique, indexed|
| description | TEXT         | nullable       |
| created_at  | DATETIME     | auto           |

### products
| Column          | Type           | Notes                    |
|-----------------|----------------|--------------------------|
| id              | INT PK AI      |                          |
| name            | VARCHAR(255)   |                          |
| slug            | VARCHAR(255)   | unique, auto-generated   |
| description     | TEXT           |                          |
| price           | DECIMAL(10,2)  |                          |
| volume          | VARCHAR(50)    | e.g. "50ml", "100ml"     |
| category_id     | INT FK         | → categories.id          |
| fragrance_notes | JSON           | {top, middle, base}      |
| image           | VARCHAR(500)   | Cloudinary URL           |
| is_featured     | BOOLEAN        | default False            |
| is_active       | BOOLEAN        | default True             |
| created_at      | DATETIME       | auto                     |
| updated_at      | DATETIME       | auto_now                 |

### site_settings
| Column     | Type         | Notes              |
|------------|--------------|--------------------|
| id         | INT PK AI    |                    |
| key        | VARCHAR(100) | unique             |
| value      | TEXT         |                    |
| updated_at | DATETIME     | auto_now           |

**Initial seed data:**
- categories: Oud, Floral, Citrus, Oriental, Woody, Fresh
- site_settings: brand_name, tagline, about_text, whatsapp_number

---

## API STRUCTURE

### Public Endpoints
```
GET  /api/products/              List active products (filterable by category)
GET  /api/products/featured/     Featured products for homepage
GET  /api/products/{slug}/       Product detail
GET  /api/categories/            List all categories
GET  /api/settings/              Site settings (brand_name, tagline, etc.)
```

### Auth Endpoints
```
POST /api/auth/login/            Admin login → {access, refresh}
POST /api/auth/token/refresh/    Refresh access token
POST /api/auth/logout/           Logout (blacklist refresh token)
```

### Admin Endpoints (JWT required)
```
POST   /api/admin/products/          Create product
PUT    /api/admin/products/{id}/     Update product
PATCH  /api/admin/products/{id}/     Partial update
DELETE /api/admin/products/{id}/     Delete product

POST   /api/admin/categories/        Create category
PUT    /api/admin/categories/{id}/   Update category
DELETE /api/admin/categories/{id}/   Delete category

PUT    /api/admin/settings/          Update site settings
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "...",
  "errors": null
}
```

---

## UI STRUCTURE

### Public Pages
```
/                    Homepage (9 sections)
/collections         Product grid with category filter
/products/[slug]     Product detail page
/about               Brand story page
/contact             Contact + WhatsApp CTA
```

### Admin Pages
```
/admin/login         Login form
/admin               Dashboard overview
/admin/products      Product list (edit/delete actions)
/admin/products/new  Add new product
/admin/products/[id]/edit  Edit product
/admin/categories    Category management
```

### Homepage Sections
1. Navbar (sticky, transparent → solid on scroll)
2. Hero Section (full-screen, cinematic)
3. Featured Perfumes (3-4 products, horizontal scroll on mobile)
4. Brand Story (text + elegant imagery)
5. Custom Fragrance CTA (bespoke service call-to-action)
6. Product Showcase (grid, all featured products)
7. Testimonials (elegant quote carousel)
8. WhatsApp CTA (full-width conversion section)
9. Footer (links, brand info, social)

---

## REUSABLE COMPONENTS

### UI Components (frontend/components/ui/)
- `Button` — variants: primary (golden), secondary (outline), ghost
- `Card` — luxury card with hover shadow
- `Input` — styled form input with label
- `Modal` — confirm/alert modal
- `Badge` — category badge
- `LoadingSpinner` — elegant gold spinner

### Navigation
- `Navbar` — sticky, responsive, mobile hamburger
- `Footer` — brand footer with links
- `MobileMenu` — slide-in mobile nav

### Product Components
- `ProductCard` — image, name, price, category, WhatsApp CTA
- `ProductGrid` — responsive grid layout
- `ProductImageGallery` — lightbox-style image viewer

### WhatsApp Components
- `WhatsAppButton` — floating sticky button (bottom-right)
- `WhatsAppCTALink` — product-specific buy/ask links

### Admin Components
- `AdminSidebar` — navigation sidebar
- `AdminNavbar` — top admin nav
- `ProductForm` — create/edit form with Cloudinary upload

---

## PROGRESS

**Overall Progress: 12%**

| Phase | Name                    | Status      | Progress |
|-------|-------------------------|-------------|----------|
| 1     | Project Setup           | ✅ Complete  | 100%     |
| 2     | Backend Foundation      | 🔄 Pending   | 0%       |
| 3     | Frontend Foundation     | 🔄 Pending   | 0%       |
| 4     | Admin System            | 🔄 Pending   | 0%       |
| 5     | Frontend Pages          | 🔄 Pending   | 0%       |
| 6     | WhatsApp Integration    | 🔄 Pending   | 0%       |
| 7     | Responsive + Polish     | 🔄 Pending   | 0%       |
| 8     | Deployment Preparation  | 🔄 Pending   | 0%       |

**Current Phase:** Phase 1 complete — waiting for NEXT to start Phase 2
**Next Phase:** Phase 2 — Backend Foundation

---

## COMPLETED TASKS

### Phase 1 — Project Setup ✅
- [x] Root folder structure created (frontend/, backend/, assets/, docs/)
- [x] docs/superpowers/plans/ created with plan document
- [x] .gitignore created (Python + Node + env coverage)
- [x] backend/AGENT.md created (this file)
- [x] backend/.env.example created
- [x] backend/requirements.txt created
- [x] frontend/.env.local.example created
- [x] Initial git commit

---

## PENDING TASKS

### Phase 2 — Backend Foundation
- [ ] Django project scaffold with split settings
- [ ] MySQL database connection
- [ ] All 4 apps created (authentication, products, categories, site_settings)
- [ ] Models built and migrated
- [ ] Management command: seed categories + create admin
- [ ] All REST API endpoints
- [ ] API tests
- [ ] CORS configured

### Phase 3 — Frontend Foundation
- [ ] Next.js 14 project init
- [ ] Tailwind luxury theme config
- [ ] Google Fonts setup
- [ ] Design system constants
- [ ] Reusable UI components
- [ ] Navbar + Footer
- [ ] AuthContext + API service

### Phase 4 — Admin System
- [ ] Admin login page
- [ ] Protected route middleware
- [ ] Dashboard layout
- [ ] Product CRUD pages
- [ ] Cloudinary image upload
- [ ] Category management

### Phase 5 — Frontend Pages
- [ ] Homepage (9 sections)
- [ ] Collections page
- [ ] Product detail page
- [ ] About page
- [ ] Contact page
- [ ] Framer Motion animations

### Phase 6 — WhatsApp Integration
- [ ] WhatsApp URL utility
- [ ] Floating sticky button
- [ ] Product buy/ask buttons
- [ ] Homepage CTA section

### Phase 7 — Responsive + Polish
- [ ] Mobile-first audit
- [ ] Image optimization
- [ ] SEO meta tags
- [ ] Loading states
- [ ] Performance optimization

### Phase 8 — Deployment Preparation
- [ ] Vercel config
- [ ] Django production settings
- [ ] CORS production config
- [ ] Security audit

---

## KNOWN ISSUES

None — Phase 1 complete, no issues identified.

---

## TESTING STATUS

| Phase | Test Type      | Status  | Notes              |
|-------|----------------|---------|--------------------|
| 1     | Structure check| ✅ Pass  | All files created  |
| 2     | API tests      | Pending |                    |
| 3     | Build check    | Pending |                    |
| 4     | Auth flow      | Pending |                    |
| 5     | UI visual      | Pending |                    |
| 6     | WhatsApp links | Pending |                    |

---

## DEVELOPMENT NOTES

- Django settings split into base/development/production — use `DJANGO_SETTINGS_MODULE=config.settings.development` in dev
- Fragrance notes stored as JSON field: `{"top": ["bergamot"], "middle": ["rose"], "base": ["oud"]}`
- Admin route protection: Next.js `middleware.ts` checks for valid JWT in cookies, redirects to /admin/login if missing
- WhatsApp URL format: `https://wa.me/{PHONE}?text=Hello%2C%20I%20am%20interested%20in%20{PRODUCT_NAME}`
- Cloudinary images: store URL in DB after upload; delete from Cloudinary on product delete

---

## GIT COMMIT HISTORY

| Hash | Message | Phase | Date |
|------|---------|-------|------|
| (see git log) | feat: phase 1 - project setup and architecture | 1 | 2026-05-27 |
