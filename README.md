# LUXE PARFUM

A luxury perfume brand showcase website with admin product management and WhatsApp-driven conversions. No customer accounts — admin-only platform with cinematic UI.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Django 5 + Django REST Framework |
| Auth | SimpleJWT (admin-only) |
| Database | MySQL 8 |
| Images | Cloudinary |
| Frontend Deploy | Vercel |
| Backend Deploy | Render / VPS (Docker) |

---

## Project Structure

```
Project2/
├── frontend/          # Next.js 14 app
├── backend/           # Django REST API
├── assets/            # Design assets
└── docs/              # Architecture docs
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

> **Change this password before deploying to production.**

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

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
NEXT_PUBLIC_BRAND_NAME=LUXE PARFUM
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## API Reference

### Public Endpoints

```
GET  /api/products/              Active products (filter: ?category=slug)
GET  /api/products/featured/     Featured products for homepage
GET  /api/products/{slug}/       Product detail
GET  /api/categories/            All categories
GET  /api/settings/              Site settings (key:value)
```

### Auth Endpoints

```
POST /api/auth/login/            Login → {access, refresh, user}
POST /api/auth/token/refresh/    Refresh token
POST /api/auth/logout/           Logout (blacklists token)
GET  /api/auth/me/               Current admin user (JWT required)
```

### Admin Endpoints (JWT required)

```
GET|POST        /api/admin/products/
GET|PUT|PATCH|DELETE  /api/admin/products/{id}/
POST            /api/categories/
PUT             /api/admin/categories/{id}/
DELETE          /api/admin/categories/{id}/
PUT             /api/admin/settings/
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

### Admin (JWT protected)

| Route | Description |
|-------|-------------|
| `/admin/login` | Login form |
| `/admin` | Dashboard (stats + recent products) |
| `/admin/products` | Product list (edit/delete) |
| `/admin/products/new` | Add product |
| `/admin/products/[id]/edit` | Edit product |
| `/admin/categories` | Category management |

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
4. Set the secret env vars in Render dashboard (DB, Cloudinary, CORS)
5. Deploy

See `backend/.env.production.example` and `frontend/.env.production.example` for all required production variables.

---

## Running Tests

```bash
cd backend
venv/Scripts/python manage.py test tests --verbosity=2
```

21 tests — auth (5), products (9), categories (7).

---

## Database Seed Data

Running `python manage.py seed_data` creates:

- **6 categories:** Oud, Floral, Citrus, Oriental, Woody, Fresh
- **6 site settings:** brand_name, tagline, about_text, whatsapp_number, hero_headline, hero_subheadline
- **Admin user:** admin / admin123
