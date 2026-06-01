# M.M ATTARWALA — Feature Reference

> Complete feature inventory. Update after every new feature added.

---

## PUBLIC STOREFRONT

### Homepage (`/`)
- 9-section layout: Navbar → Hero → Featured → Brand Story → Custom Fragrance CTA → Product Showcase → Testimonials → WhatsApp CTA → Footer
- Hero: full-screen cinematic, parallax scroll-fade, dual CTAs (Shop Collection + Create Fragrance)
- Featured Perfumes: API-driven, skeleton loading, 4-column grid, horizontal scroll on mobile
- Brand Story: decorative frame, dark background, animated stat counters
- Custom Fragrance CTA: bespoke service call-to-action with WhatsApp link
- Product Showcase: API-driven, category filter tabs, 8 products
- Testimonials: animated carousel, dot navigation, auto-scroll
- WhatsApp CTA: dark cinematic section, dual CTA buttons

### Collections (`/collections`)
- Full product grid with category filter chip buttons
- Category filter: All + per-category chips with count badges
- Product cards with image, name, price (auto-currency), category badge
- Skeleton loading state
- Server component wrapper + `CollectionsClient.tsx` (metadata export works)

### Product Detail (`/products/[slug]`)
- Server component + `ProductDetailClient.tsx`
- `generateMetadata` for dynamic Open Graph tags
- Layered image composite: image[0] (bottle PNG transparent) composited over image[1] (scene background)
- `AnimatePresence` slider for multiple product images
- Thumbnail strip for image selection
- Fragrance pyramid: Top / Heart / Base note display
- Price in INR or USD based on timezone detection
- Buy Now → WhatsApp (M. Roeesh, primary number)
- Ask Details → WhatsApp (M. Munavvar, secondary number)
- Image layer effect: toggle per-product and globally via site settings

### About (`/about`)
- Brand pillars grid
- Philosophy text
- WhatsApp CTA section

### Contact (`/contact`)
- 3 WhatsApp contact cards (Buy, Enquire, Custom)
- General WhatsApp CTA

### Create Fragrance (`/create-fragrance`)
**9-step bespoke fragrance design wizard:**

| Step | Name | Description |
|------|------|-------------|
| 1 | Identity | Choose gender: Male / Female / Unisex |
| 2 | Personality | 8 personalities per gender (24 total) |
| 3 | Purpose | Multi-select occasions across 4 categories (Daily / Events / Professional / Travel) |
| 4 | Impression | 12 mood options (Attractive, Royal, Mysterious, etc.) |
| 5 | Family | 13 fragrance families (Oud, Woody, Floral, Fresh, Citrus, Vanilla, Smoky, Spicy, Powdery, Green, Leather, Oriental, Musk) |
| 6 | Strength | 4 intensity levels (Skin Close → Beast Mode) |
| 7 | Climate | 4 seasons (Summer, Winter, Rainy, All Season) |
| 8 | Notes | Perfume pyramid builder — Top / Heart / Base, up to 3 per layer |
| 9 | Signature | Name fragrance + customer contact info |

**Wizard UX features:**
- Live right-panel preview: bottle fill + accent color update per step, DNA card (personality/impression/family/climate/notes accumulate), projection intensity meter
- `OptionCard` shared component: Framer Motion hover lift (`y: -4, scale: 1.02`), shimmer sweep animation, per-family accent glow via `--cf-accent` CSS custom property, animated selected ring pulse, checkmark entrance animation
- Per-family Arabic calligraphy watermark
- Personality-specific recommended notes (highlighted with ✦ in Notes step)
- Step 6: animated strength level cards with intensity bars
- Progress bar: 9-step with animated gold fill line + glow effect, completed step checkmarks
- Submission: saves to backend `FragranceRequest` model + generates pre-filled WhatsApp message
- Final screen: fragrance summary, note tags, WhatsApp CTA, Create Another button
- Dark cinematic theme isolated to this page via `cf-page-bg` CSS class

---

## WHATSAPP INTEGRATION

| Function | Route | Number |
|----------|-------|--------|
| `buildProductBuyUrl()` | Buy Now on product detail | M. Roeesh (+91 9724586101) |
| `buildProductInquiryUrl()` | Ask Details on product detail | M. Munavvar (+91 9016361538) |
| `buildCustomFragranceUrl()` | General fragrance consultation CTA | Primary |
| `buildCustomFragranceOrderUrl()` | Create Fragrance wizard submission | Primary |
| `buildWhatsAppUrl()` | Generic message builder | Primary |
| `buildWhatsAppUrl2()` | Generic message builder | Secondary |

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — primary (M. Roeesh, Buy Now)
- `NEXT_PUBLIC_WHATSAPP_NUMBER_2` — secondary (M. Munavvar, Ask Details)
- Floating WhatsApp button (spring animation, tooltip on hover)

---

## CURRENCY DETECTION

- Detected client-side via `new Date().getTimezoneOffset()`
- India (UTC offset −330 = IST) → **₹ INR** (`en-IN` locale, 0 decimals)
- All other timezones → **$ USD** (`en-US` locale)
- `useCurrency` hook defaults to INR to avoid SSR hydration mismatch
- `formatPrice(amount, currency)` via `Intl.NumberFormat`

---

## IMAGE LAYER EFFECT

- Product images: up to 4 per product (min 1, max 2 MB each, 3:4 portrait ratio recommended)
- `image_layer_effect` toggle: per-product field + global site setting
- When enabled: `images[0]` (bottle PNG, transparent background) composited over `images[1]` (scene background) on product detail page
- Hover zoom on composite image
- Toggle via Admin → Settings page (global) or per-product in product edit form

---

## ADMIN PORTAL

### Authentication
- JWT via SimpleJWT (access + refresh tokens)
- Middleware: JWT cookie check, redirects `/admin/*` → `/admin/login` if unauthenticated
- Auto-refresh via Axios interceptor on 401 response
- Token blacklist on logout

### Admin Pages

| Route | Description |
|-------|-------------|
| `/admin/login` | Luxury dark login form (Suspense-wrapped for `useSearchParams`) |
| `/admin` | Dashboard: stat cards (total/active/featured products, categories) + recent products table |
| `/admin/products` | Product list with NeoToggle for active/featured inline |
| `/admin/products/new` | Add product form |
| `/admin/products/[id]/edit` | Edit product form (hydrates from API) |
| `/admin/categories` | Inline create/edit + delete with confirm modal |
| `/admin/settings` | Site settings + Feature Flags (image_layer_effect toggle) |
| `/admin/inquiries` | Route defined; UI page pending |

### Admin Components
- **AdminSidebar**: animated active indicator, user info, logout button, mobile slide-in overlay with backdrop
- **AdminNavbar**: breadcrumb navigation, "View Site" link, mobile hamburger
- **AdminLayoutClient**: manages `sidebarOpen` state, passes toggle to AdminNavbar
- **NeoToggle**: animated CSS toggle (spectrum bars, active/featured variants, ON/OFF label)
- **ProductForm**: multi-image upload slots (up to 4), TagInput for fragrance notes (top/middle/base), volume select (10/30/50/100ml + Custom), `image_layer_effect` toggle
- **ConfirmModal**: used for delete confirmation

---

## BACKEND API

### Public Endpoints
```
GET  /api/products/              Active products (filter: ?category=slug)
GET  /api/products/featured/     Featured products (homepage)
GET  /api/products/{slug}/       Product detail
GET  /api/categories/            All categories
GET  /api/settings/              Site settings (flat key:value dict)
POST /api/inquiries/             Submit custom fragrance request
```

### Auth Endpoints
```
POST /api/auth/login/            Admin login → {access, refresh, user}
POST /api/auth/token/refresh/    Refresh access token
POST /api/auth/logout/           Logout (blacklists refresh token)
GET  /api/auth/me/               Current admin user info (JWT required)
```

### Admin Endpoints (JWT + is_staff=True)
```
GET|POST                /api/admin/products/
GET|PUT|PATCH|DELETE    /api/admin/products/{id}/
POST                    /api/admin/upload-image/        Local media upload, max 2 MB
POST                    /api/categories/
PUT                     /api/admin/categories/{id}/
DELETE                  /api/admin/categories/{id}/
PUT                     /api/admin/settings/            Bulk update {settings: {key: value}}
GET                     /api/admin/inquiries/           Filter: ?status=new|contacted|completed
GET|PATCH|DELETE        /api/admin/inquiries/{id}/
```

### Response Format
```json
{ "success": true, "message": "...", "data": {}, "errors": null }
```

---

## DATABASE MODELS

### Product
- `name`, `slug` (auto), `description`, `price` (DECIMAL 10,2), `volume` (VARCHAR 50)
- `category_id` (FK), `fragrance_notes` (JSON: {top, middle, base})
- `image` (primary, auto-set from `images[0]`), `images` (JSON array, max 4 URLs)
- `is_featured`, `is_active`, `image_layer_effect` (all TINYINT, default varies)
- `created_at`, `updated_at`

### Category
- `name`, `slug` (auto), `description`
- Seeded: Oud, Floral, Citrus, Oriental, Woody, Fresh

### SiteSetting
- `key` (unique), `value`
- Seeded keys: `brand_name`, `tagline`, `about_text`, `whatsapp_number`, `hero_headline`, `hero_subheadline`, `image_layer_effect`

### FragranceRequest (Inquiries)
- `gender`, `occasion`, `notes` (JSON array), `intensity`, `fragrance_name`
- `customer_name`, `customer_phone`, `customer_city`, `additional_notes`
- `status`: `new` / `contacted` / `completed`
- `created_at`

---

## DESIGN SYSTEM

### Color Palette
```
Ivory:        #F8F4EC   — light backgrounds (public site)
Golden Brown: #B08D57   — accents, CTAs, borders
Deep Brown:   #4A3428   — headings, strong text
Soft Beige:   #E8DED1   — cards, secondary backgrounds

Create Fragrance dark theme:
Espresso:     #1E1208   — page background base
Gold:         #C8A36A   — borders, accents, progress bar
```

### Typography
- Headings: **Cormorant Garamond** (elegant serif)
- Body: **Poppins** (clean sans-serif)
- Tagline: Devanagari / Lavishly Yours (decorative)

### CSS Utilities (globals.css)
- `.btn-luxury` — gold fill primary CTA with shine sweep
- `.btn-luxury-outline` — dark border, fills on hover
- `.btn-luxury-dark` — glass + gold glow, for dark sections
- `.btn-whatsapp-luxury` — ripple-fill WhatsApp CTA
- `.card-glass` — glass morphism card for dark sections
- `.bg-depth` — layered dark brown gradient
- `.bg-hero` — directional deep gradient for hero
- `.cf-page-bg` — multi-layer warm espresso gradient for fragrance wizard
- `.cf-family-card` — option card base (shimmer, glow, hover)
- `.cf-family-card--selected` — selected state (accent glow)
- `.cf-card-shimmer` — GPU-composited shimmer sweep animation
- `.cf-selected-ring` — pulsing accent border animation
- `.cf-arabic-wm` — Arabic calligraphy watermark style
- `.cf-check-circle` — animated checkmark circle (CSS custom property color)
- `.cf-preview-panel` — right panel card shadow
- `.collections-chip` / `.collections-chip-active` — category filter chips
- `.neo-toggle-*` — full NeoToggle animation system
- `.testimonials-track` — 60s infinite scroll animation
- Film grain overlay: `body::after` SVG noise texture at 2.8% opacity
- `.admin-portal` — elevated admin UI color overrides

### Animation
- Library: **Framer Motion**
- Style: smooth, subtle, cinematic
- Triggers: scroll-based, hover, entrance, step transitions
- Key animations: parallax hero, product card hover lift, NeoToggle spectrum bars, fragrance card shimmer sweep, progress bar fill

---

## SEO & META

- `app/sitemap.ts` — static routes + dynamic product routes from API
- `app/robots.ts` — disallow `/admin/*`, sitemap link
- `generateMetadata` on product detail (dynamic OG title/description)
- `app/not-found.tsx` — branded 404 (dark bg, Home + Collections CTAs)
- `loading.tsx` — skeleton loaders for public route, collections, product detail

---

## DEPLOYMENT

### Frontend → Vercel
- `vercel.json` — framework config, security headers, env var refs
- `.env.production.example` — all required Vercel env vars

### Backend → Render / VPS
- `Dockerfile` — python:3.11-slim, mysqlclient deps, gunicorn entrypoint
- `render.yaml` — Render Blueprint (web service + env vars)
- `Procfile` — gunicorn bind `$PORT`, 2 workers/threads, gthread class
- `build.sh` — pip install + collectstatic + migrate
- `.env.production.example` — all required production env vars
- Production settings: `DEBUG=False`, `SECURE_SSL_REDIRECT`, HSTS, `CSRF_COOKIE_SECURE`

---

## TESTING

```bash
cd backend
venv/Scripts/python manage.py test tests --verbosity=2
```

| Suite | Tests | Status |
|-------|-------|--------|
| Auth API | 5 | PASS |
| Products API | 9 | PASS |
| Categories API | 7 | PASS |
| **Total** | **21** | **PASS** |

---

## KEY ENV VARIABLES

### Backend (`backend/.env`)
```
SECRET_KEY, DEBUG, ALLOWED_HOSTS
DB_NAME=project1, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET  (future)
CORS_ALLOWED_ORIGINS
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=+919724586101       (M. Roeesh — Buy Now)
NEXT_PUBLIC_WHATSAPP_NUMBER_2=+919016361538     (M. Munavvar — Ask Details)
NEXT_PUBLIC_BRAND_NAME=M.M ATTARWALA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_FACEBOOK_URL, NEXT_PUBLIC_YOUTUBE_URL
```

---

## DEVELOPMENT COMMANDS

```bash
# Backend
cd backend
venv/Scripts/python manage.py runserver        # Start dev server
venv/Scripts/python manage.py migrate          # Run migrations
venv/Scripts/python manage.py seed_data        # Seed categories + settings + admin user
venv/Scripts/python manage.py test tests       # Run all tests

# Frontend
cd frontend
npm run dev                                     # Start dev server (localhost:3000)
npm run build                                   # Production build (0 errors required)
```

---

## ADMIN CREDENTIALS (Dev Only)

| Field | Value |
|-------|-------|
| URL | `http://localhost:3000/admin/login` |
| Username | `admin` |
| Password | `admin123` |

> **Change before production deployment.**

---

## FEATURE SUMMARY

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Homepage** | 9-section cinematic landing page with hero, featured products, brand story, testimonials |
| 2 | **Collections Page** | Product grid with category filter chips and skeleton loading |
| 3 | **Product Detail** | Image slider, fragrance pyramid, layered bottle/background composite |
| 4 | **About Page** | Brand pillars, philosophy text, WhatsApp CTA |
| 5 | **Contact Page** | 3 WhatsApp contact cards for buying, enquiry, and custom orders |
| 6 | **Create Fragrance Wizard** | 9-step bespoke fragrance builder with live preview panel |
| 7 | **WhatsApp Dual Routing** | Buy Now → M. Roeesh, Ask Details → M. Munavvar (separate numbers) |
| 8 | **Currency Auto-Detection** | INR for India (IST timezone), USD for all others — client-side, no API |
| 9 | **Image Layer Effect** | Bottle PNG composited over scene background on product detail |
| 10 | **Admin Login** | JWT-protected login with auto-refresh and token blacklist on logout |
| 11 | **Admin Dashboard** | Stat cards (products, categories) + recent products table |
| 12 | **Product Management** | Full CRUD with multi-image upload (4 images), fragrance notes, volume select |
| 13 | **NeoToggle** | Animated inline toggle for active/featured status in products table |
| 14 | **Category Management** | Inline create, edit, delete with confirm modal |
| 15 | **Site Settings** | Live-editable brand name, tagline, WhatsApp number, hero text, feature flags |
| 16 | **Fragrance Request (Inquiries)** | Backend stores custom fragrance requests with status tracking (new/contacted/completed) |
| 17 | **Fragrance DNA Preview** | Right panel in wizard shows live bottle fill, personality, notes, intensity, climate |
| 18 | **Personality System** | 24 personalities (8 per gender) each with recommended notes and visual identity |
| 19 | **Notes Pyramid Builder** | Top / Heart / Base layer selection, up to 3 per layer, with recommended highlights |
| 20 | **Projection Intensity Meter** | 4 strength levels with animated signal bars and sillage radius |
| 21 | **SEO** | Dynamic Open Graph on product pages, sitemap.xml, robots.txt, branded 404 |
| 22 | **Skeleton Loaders** | Loading states for collections, product detail, public routes |
| 23 | **Responsive Admin Sidebar** | Mobile slide-in overlay with backdrop and route-change auto-close |
| 24 | **Film Grain Texture** | Subtle SVG noise overlay on body for depth and luxury feel |
| 25 | **Deployment Ready** | Vercel (frontend) + Render/Docker (backend) configs with production security settings |
