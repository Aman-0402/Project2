# M.M ATTARWALA

Luxury perfume brand showcase website for M.M Attarwala, Vadodara, Gujarat. Admin product management, WhatsApp-driven conversions, cinematic UI with layered product photography. No customer accounts — admin-only platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Django 5 + Django REST Framework |
| Auth | SimpleJWT (admin-only, rate-limited) |
| Database | MySQL 8 (with performance indexes) |
| Images | Cloudinary (production) / Local filesystem (dev) |
| File Validation | `filetype` — byte-level MIME detection |
| Error Tracking | Sentry (production) |
| CI/CD | GitHub Actions |
| Currency | Auto-detect INR/USD via timezone offset |
| Frontend Deploy | Vercel |
| Backend Deploy | Render / VPS (Docker) |

---

## Project Structure

```
Project2/
├── frontend/          # Next.js 14 app
├── backend/           # Django REST API
├── assets/            # Design assets
├── docs/              # Architecture docs
├── Report.md          # Security & scalability audit report
└── .github/workflows/ # CI/CD — GitHub Actions
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8 running locally
- MySQL database named `project1` created

### 1. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env         # Windows
# cp .env.example .env         # macOS/Linux
# Edit .env — set DB_NAME, DB_USER, DB_PASSWORD

# Run migrations
python manage.py migrate

# Seed categories + admin user
python manage.py seed_data

# Start server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.local.example .env.local    # Windows
# cp .env.local.example .env.local   # macOS/Linux
# Edit .env.local — verify NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Admin Access

Navigate to `http://localhost:3000/admin/login`

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

> **Change this password before deploying to production** via `/admin/change-password`.

Django built-in admin (database-level): `http://localhost:8000/_panel/mma-internal/`

---

## Environment Variables

### Backend (`backend/.env`)

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=project1
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306

# Cloudinary (optional — not active in dev, images stored locally)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=+919724586101
NEXT_PUBLIC_WHATSAPP_NUMBER_2=+919016361538
NEXT_PUBLIC_BRAND_NAME=M.M ATTARWALA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## API Reference

### Public Endpoints

```
GET  /api/health/                Health check → {"status": "ok"}
GET  /api/products/              Active products — paginated (filter: ?category=slug&page=N)
GET  /api/products/featured/     Featured products for homepage (max 8)
GET  /api/products/{slug}/       Product detail
GET  /api/categories/            All categories (with product count)
GET  /api/settings/              Site settings (key:value)
POST /api/inquiries/             Submit custom fragrance request [3/min rate limit]
```

### Auth Endpoints

```
POST /api/auth/login/            Login → {access, refresh, user} [5/min rate limit]
POST /api/auth/token/refresh/    Refresh token
POST /api/auth/logout/           Logout (blacklists token)
GET  /api/auth/me/               Current admin user (JWT required)
POST /api/auth/change-password/  Change password (JWT required)
```

### Admin Endpoints (JWT required)

```
GET|POST        /api/admin/products/
GET|PUT|PATCH|DELETE  /api/admin/products/{id}/
POST            /api/categories/
PUT             /api/admin/categories/{id}/
DELETE          /api/admin/categories/{id}/
PUT             /api/admin/settings/
GET             /api/admin/inquiries/           (filter: ?status=new|contacted|completed)
GET|PATCH|DELETE  /api/admin/inquiries/{id}/
```

---

## Pages

### Public

| Route | Description |
|-------|-------------|
| `/` | Homepage (Hero, Featured, Brand Story, Testimonials, WhatsApp CTA) |
| `/collections` | Product grid with category filter |
| `/products/[slug]` | Product detail with fragrance pyramid |
| `/about` | Brand story |
| `/contact` | WhatsApp contact options |
| `/create-fragrance` | Custom fragrance builder (5-step wizard) |

### Admin (JWT protected)

| Route | Description |
|-------|-------------|
| `/admin/login` | Login form |
| `/admin` | Dashboard (stat cards + recent products) |
| `/admin/products` | Product list with inline active/featured NeoToggle |
| `/admin/products/new` | Add product (multi-image, fragrance tag input, volume select) |
| `/admin/products/[id]/edit` | Edit product |
| `/admin/categories` | Category management |
| `/admin/settings` | Site settings + Feature Flags |

---

## Design System

```
Ivory:        #F8F4EC   backgrounds
Golden Brown: #B08D57   accents, CTAs, borders
Deep Brown:   #4A3428   headings, strong text
Soft Beige:   #E8DED1   cards, secondary backgrounds

Headings: Cormorant Garamond (elegant serif)
Body:     Poppins (clean sans-serif)
```

---

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project in Vercel dashboard
3. Set environment variables (copy from `frontend/.env.production.example`)
4. Deploy

### Backend → Render

1. Push to GitHub
2. New Web Service → connect repo
3. Render auto-detects `render.yaml`
4. Set secret env vars in Render dashboard:
   - `SECRET_KEY` (required — app refuses to start without it)
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `CORS_ALLOWED_ORIGINS` (your Vercel URL)
   - `SENTRY_DSN` (optional — from sentry.io project)
5. **Upgrade plan from free to Starter** — free tier has no persistent disk and spins down
6. Deploy

See `backend/.env.production.example` and `frontend/.env.production.example` for all required production variables.

> **Health check:** Render monitors `GET /api/health/` — configure this in the Render dashboard under Health & Alerts.

---

## Running Tests

```bash
cd backend
venv\Scripts\python manage.py test tests --verbosity=2
```

21 tests — auth (5), products (9), categories (7).

Tests run automatically on every push to `main` via GitHub Actions (`.github/workflows/ci.yml`).

---

## Database Seed Data

Running `python manage.py seed_data` creates:

- **6 categories:** Oud, Floral, Citrus, Oriental, Woody, Fresh
- **7 site settings:** brand_name, tagline, about_text, whatsapp_number, hero_headline, hero_subheadline, image_layer_effect
- **Admin user:** admin / admin123

---

## Key Features

### Branding
- Logo: `frontend/public/logo.png` — displayed in Navbar and Footer beside brand name
- Favicon: `frontend/app/icon.png` — auto-detected by Next.js App Router

### Product Images
- Up to **4 images** per product (min 1, max 2MB each, **3:4 portrait ratio** recommended)
- **Image Layer Effect** — image 1 (bottle PNG, transparent background) composited over image 2 (scene background) with hover zoom on product detail page
- Toggle per-product (`image_layer_effect`) and globally via admin Settings

### Currency Detection
- India visitors (IST timezone, UTC+5:30) → **₹ INR**
- International visitors → **$ USD**
- Detected client-side via `new Date().getTimezoneOffset()` — no IP API needed

### Custom Fragrance Builder
- 5-step interactive wizard at `/create-fragrance`: Family → Notes → Intensity → Name → Enquiry
- 6 fragrance families (Oud, Floral, Musk, Fresh, Oriental, Woody) with family-specific note palettes (up to 2 per layer)
- Live animated bottle SVG — fill level and accent color update per selection
- Submits inquiry to backend (`POST /api/inquiries/`) and generates pre-filled WhatsApp message
- Dark cinematic theme isolated to this page via `cf-page-bg` CSS class

### WhatsApp Dual Routing
- **Buy Now** → M. Roeesh (`NEXT_PUBLIC_WHATSAPP_NUMBER`) — includes product name, price, notes
- **Ask Details** → M. Munavvar (`NEXT_PUBLIC_WHATSAPP_NUMBER_2`) — general inquiry

### Admin Features
- **NeoToggle** — animated inline toggle for active/featured status in products table
- **Fragrance Notes** — tag/keyword input with auto-suggestions per note layer (top/middle/base)
- **Volume Select** — preset options (10ml, 30ml, 50ml, 100ml) + Custom free text
- **Settings page** — live editable brand name, tagline, WhatsApp number, hero text, feature flags
- **Inquiries** — backend API ready (status tracking: new/contacted/completed); admin UI pending
