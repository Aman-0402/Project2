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
[Next.js Frontend] <-> [DRF Backend API] <-> [MySQL Database: project1]
        |                     |
   Vercel Deploy         VPS / Render
        |                     |
  /admin routes         Cloudinary (images)
  (JWT protected)       SimpleJWT (auth)
```

- Frontend: Next.js 14 App Router, Tailwind CSS, Framer Motion
- Backend: Django 5, Django REST Framework
- Database: MySQL (DB: project1, User: root)
- Image Storage: Cloudinary (dev: local FileSystem)
- Auth: JWT via SimpleJWT (admin-only, is_staff=True)
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

### categories (table: categories_category)
| Column      | Type         | Notes          |
|-------------|--------------|----------------|
| id          | BIGINT PK AI |                |
| name        | VARCHAR(100) | unique         |
| slug        | VARCHAR(100) | unique, auto   |
| description | TEXT         | nullable       |
| created_at  | DATETIME(6)  | auto           |

### products (table: products_product)
| Column          | Type           | Notes                    |
|-----------------|----------------|--------------------------|
| id              | BIGINT PK AI   |                          |
| name            | VARCHAR(255)   |                          |
| slug            | VARCHAR(255)   | unique, auto-generated   |
| description     | TEXT           | nullable                 |
| price           | DECIMAL(10,2)  |                          |
| volume          | VARCHAR(50)    | e.g. "50ml", "100ml"     |
| category_id     | BIGINT FK      | -> categories_category.id|
| fragrance_notes | JSON           | {top, middle, base}      |
| image           | VARCHAR(500)   | Cloudinary URL           |
| is_featured     | TINYINT(1)     | default 0                |
| is_active       | TINYINT(1)     | default 1                |
| created_at      | DATETIME(6)    | auto                     |
| updated_at      | DATETIME(6)    | auto_now                 |

### site_settings (table: site_settings_sitesetting)
| Column     | Type         | Notes   |
|------------|--------------|---------|
| id         | BIGINT PK AI |         |
| key        | VARCHAR(100) | unique  |
| value      | LONGTEXT     | nullable|
| updated_at | DATETIME(6)  | auto    |

**Seeded site_settings keys:** brand_name, tagline, about_text, whatsapp_number, hero_headline, hero_subheadline
**Seeded categories:** Oud, Floral, Citrus, Oriental, Woody, Fresh
**Admin user:** username=admin, password=admin123 (CHANGE IN PRODUCTION)

---

## API STRUCTURE

### Base URL (dev): http://localhost:8000

### Public Endpoints
```
GET  /api/products/              List active products (filterable: ?category=slug)
GET  /api/products/featured/     Featured products for homepage
GET  /api/products/{slug}/       Product detail
GET  /api/categories/            List all categories
GET  /api/settings/              Site settings (flat key:value dict)
```

### Auth Endpoints
```
POST /api/auth/login/            Admin login -> {access, refresh, user}
POST /api/auth/token/refresh/    Refresh access token -> {access, refresh}
POST /api/auth/logout/           Logout (blacklists refresh token)
GET  /api/auth/me/               Get current admin user info (JWT required)
```

### Admin Endpoints (JWT Bearer required, is_staff=True)
```
GET    /api/admin/products/          List ALL products (incl. inactive)
POST   /api/admin/products/          Create product
GET    /api/admin/products/{id}/     Get product by ID
PUT    /api/admin/products/{id}/     Full update
PATCH  /api/admin/products/{id}/     Partial update
DELETE /api/admin/products/{id}/     Delete product

POST   /api/categories/              Create category
PUT    /api/admin/categories/{id}/   Update category
DELETE /api/admin/categories/{id}/   Delete category

PUT    /api/admin/settings/          Bulk update settings ({settings: {key: value}})
```

### Response Format
```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
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
1. Navbar (sticky, transparent -> solid on scroll)
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

### Backend Utils
- `utils/response.py` — success_response, error_response, created_response, not_found_response, unauthorized_response, forbidden_response
- `utils/validators.py` — validate_price, validate_phone_number
- `services/cloudinary_service.py` — upload_image, delete_image, extract_public_id
- `apps.authentication.permissions.IsAdminUser` — DRF permission class for all admin endpoints

### Frontend UI Components (Phase 3+)
- Button, Card, Input, Modal, Badge, LoadingSpinner
- Navbar, Footer, MobileMenu
- ProductCard, ProductGrid, ProductImageGallery
- WhatsAppButton (floating), WhatsAppCTALink
- AdminSidebar, AdminNavbar, ProductForm

---

## PROGRESS

**Overall Progress: 100%**

| Phase | Name                    | Status      | Progress |
|-------|-------------------------|-------------|----------|
| 1     | Project Setup           | COMPLETE    | 100%     |
| 2     | Backend Foundation      | COMPLETE    | 100%     |
| 3     | Frontend Foundation     | COMPLETE    | 100%     |
| 4     | Admin System            | COMPLETE    | 100%     |
| 5     | Frontend Pages          | COMPLETE    | 100%     |
| 6     | WhatsApp Integration    | COMPLETE    | 100%     |
| 7     | Responsive + Polish     | COMPLETE    | 100%     |
| 8     | Deployment Preparation  | COMPLETE    | 100%     |

**Current Phase:** ALL PHASES COMPLETE
**Next Phase:** Production deployment

---

## COMPLETED TASKS

### Phase 1 - Project Setup [DONE]
- [x] Root folder structure (frontend/, backend/, assets/, docs/)
- [x] .gitignore, AGENT.md, requirements.txt, .env.example files
- [x] Initial git commit

### Phase 2 - Backend Foundation [DONE]
- [x] Python venv created (backend/venv/)
- [x] All packages installed (Django 5.0.6, DRF, SimpleJWT, etc.)
- [x] Django project with split settings (base/development/production)
- [x] MySQL connected (DB: project1, root, no password)
- [x] 4 apps created: authentication, products, categories, site_settings
- [x] Models: Category, Product (with JSON fragrance_notes), SiteSetting
- [x] Migrations created and applied - 15 tables in MySQL
- [x] Seed data: 6 categories, 6 site settings, admin user
- [x] Authentication APIs: login, logout, refresh, /me
- [x] Products APIs: public list/featured/detail, admin CRUD
- [x] Categories APIs: public list, admin create/update/delete
- [x] Site Settings APIs: public GET, admin PUT (bulk)
- [x] Standardized response format (utils/response.py)
- [x] IsAdminUser permission class
- [x] Cloudinary service helper
- [x] 21 tests written and passing (auth: 5, products: 9, categories: 7)

---

## PENDING TASKS

### Phase 3 - Frontend Foundation [DONE]
- [x] Next.js 14.2.5 (App Router, TypeScript, Tailwind)
- [x] Luxury Tailwind theme (ivory, gold, brown, beige + gradients + animations)
- [x] Google Fonts: Cormorant Garamond + Poppins via next/font
- [x] constants/colors.ts, constants/config.ts (brand, routes, token keys)
- [x] types/: Product, Category, ApiResponse, AuthTokens (with index re-export)
- [x] components/ui/: Button, Card, Input, Textarea, Badge, LoadingSpinner, Modal, ConfirmModal
- [x] components/navigation/: Navbar (sticky, scroll-aware, mobile hamburger), Footer
- [x] components/whatsapp/: WhatsAppButton (floating), WhatsAppCTALink
- [x] context/AuthContext.tsx (user state, login, logout, JWT hydration)
- [x] services/api.ts (Axios + JWT interceptors + auto-refresh)
- [x] services/auth.ts, products.ts, categories.ts
- [x] utils/whatsapp.ts (URL builder), utils/formatters.ts
- [x] app/layout.tsx (root with fonts, metadata, AuthProvider, WhatsAppButton)
- [x] app/(public)/layout.tsx (Navbar + Footer wrapper)
- [x] npm run build: PASS (0 TypeScript errors, 0 lint errors)

### Phase 4 - Admin System [DONE]
- [x] middleware.ts — JWT cookie check, redirect /admin/* → /admin/login if unauthenticated
- [x] /admin/login — luxury dark form (Suspense-wrapped for useSearchParams), error display, redirect on success
- [x] AdminSidebar — animated active indicator, user info, logout button
- [x] AdminNavbar — breadcrumb navigation, "View Site" link
- [x] /admin — dashboard overview with stat cards + recent products table
- [x] /admin/products — full product list table (image, category, price, status, featured)
- [x] /admin/products/new — product create form
- [x] /admin/products/[id]/edit — product edit form (hydrates from API)
- [x] /admin/categories — inline create/edit + delete with Suspense-style list
- [x] ProductForm — reusable form with all fields (fragrance notes, image URL, toggles)
- [x] ConfirmModal used for delete confirmation
- [x] npm run build: PASS — 9 routes, 0 TypeScript errors, middleware 26.9 kB

### Phase 5 - Frontend Pages [DONE]
- [x] HeroSection — parallax, scroll-fade, cinematic entrance, dual CTAs
- [x] FeaturedPerfumes — API-driven, skeleton loading, 4-col grid
- [x] BrandStory — decorative frame, dark bg, stat counters
- [x] CustomFragranceCTA — bespoke CTA with WhatsApp link
- [x] ProductShowcase — API-driven, category filter tabs, 8 products
- [x] Testimonials — animated carousel with dot navigation
- [x] WhatsAppCTASection — dark cinematic, dual CTAs
- [x] /collections — full grid, category filter, count badges
- [x] /products/[slug] — image, price, fragrance pyramid, Buy+Ask buttons
- [x] /about — pillars grid, philosophy text, CTA section
- [x] /contact — 3 WhatsApp contact cards + general CTA
- [x] npm run build: PASS — 12 routes, 0 errors

### Phase 6 - WhatsApp Integration [DONE]
- [x] utils/whatsapp.ts — 4 URL builder functions
- [x] WhatsAppButton — floating sticky (spring animation)
- [x] WhatsAppCTALink — Buy Now + Ask Details on product pages
- [x] All pages wired to WhatsApp number from env

### Phase 7 - Responsive + Polish [DONE]
- [x] Admin mobile sidebar — AnimatePresence slide-in overlay, backdrop, route-change close
- [x] AdminLayoutClient.tsx — manages sidebarOpen state, passes toggle to AdminNavbar
- [x] AdminNavbar — mobile hamburger button (lg:hidden), type="button" set
- [x] Admin layout — now server component wrapping AdminLayoutClient
- [x] Collections — server wrapper + CollectionsClient.tsx (metadata export works)
- [x] Product detail — server wrapper + ProductDetailClient.tsx + generateMetadata (dynamic OG)
- [x] app/not-found.tsx — branded 404 page on dark bg, Home + Collections CTAs
- [x] loading.tsx — public route, collections, product detail skeleton loaders
- [x] app/sitemap.ts — static routes + dynamic product routes from API
- [x] app/robots.ts — disallow /admin/*, sitemap link
- [x] npm run build: PASS — 14 routes, sitemap.xml, robots.txt, 0 errors

### Phase 8 - Deployment Preparation [DONE]
- [x] `frontend/vercel.json` — framework config, security headers, env var refs (@secrets)
- [x] `frontend/.env.production.example` — production env vars template for Vercel
- [x] `backend/Dockerfile` — python:3.11-slim, mysqlclient deps, gunicorn entrypoint
- [x] `backend/render.yaml` — Render Blueprint (web service, env vars, build/start commands)
- [x] `backend/Procfile` — gunicorn bind $PORT, 2 workers/threads, gthread class
- [x] `backend/build.sh` — pip install + collectstatic + migrate for Render build
- [x] `backend/.env.production.example` — production env vars template with all required keys
- [x] Production settings: DEBUG=False, SECURE_SSL_REDIRECT, HSTS, CSRF_COOKIE_SECURE

---

## KNOWN ISSUES

- Staticfiles directory needed (whitenoise warning in tests) - created as empty dir
- Backend .env is committed to git (dev only) - excluded via .gitignore in production

---

## TESTING STATUS

| Phase | Test Suite          | Tests | Passed | Failed | Status   |
|-------|---------------------|-------|--------|--------|----------|
| 1     | Structure check     | -     | -      | -      | PASS     |
| 2     | Auth API tests      | 5     | 5      | 0      | PASS     |
| 2     | Products API tests  | 9     | 9      | 0      | PASS     |
| 2     | Categories tests    | 7     | 7      | 0      | PASS     |
| 3     | Build check         | -     | -      | -      | PASS     |
| 4     | Admin build check   | -     | -      | -      | PASS     |
| 5     | UI visual           | -     | -      | -      | Pending  |

---

## DEVELOPMENT NOTES

- Run backend: `cd backend && venv/Scripts/python manage.py runserver`
- Run tests: `venv/Scripts/python manage.py test tests --verbosity=2`
- Seed data: `venv/Scripts/python manage.py seed_data`
- Dev settings: DJANGO_SETTINGS_MODULE=config.settings.development (default in manage.py)
- Prod settings: DJANGO_SETTINGS_MODULE=config.settings.production (set in wsgi.py/asgi.py)
- Cloudinary disabled in dev (uses local FileSystem storage)
- CORS in dev: allow all origins
- Admin credentials: admin / admin123 - CHANGE BEFORE PRODUCTION
- fragrance_notes JSON format: {"top": ["bergamot"], "middle": ["rose"], "base": ["oud"]}

---

## GIT COMMIT HISTORY

| Hash        | Message                                      | Phase | Date       |
|-------------|----------------------------------------------|-------|------------|
| d369089     | feat: phase 1 - project setup and architecture | 1   | 2026-05-27 |
| (phase 2)   | feat: phase 2 - backend foundation complete  | 2     | 2026-05-27 |
