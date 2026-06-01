# AGENTS.md — M.M ATTARWALA

Agent guide for this codebase. Read before touching anything.

---

## Project Overview

Luxury perfume brand showcase website for **M.M Attarwala**, Vadodara, Gujarat.
- Admin-only platform (no customer accounts)
- WhatsApp-driven conversions
- Django REST API + Next.js 14 frontend

---

## Repo Layout

```
Project2/
├── frontend/          # Next.js 14 (App Router, TypeScript)
├── backend/           # Django 5 + DRF
├── assets/            # Design assets
├── docs/              # Plans and architecture docs
├── README.md
└── AGENTS.md          # ← you are here
```

---

## Frontend (`frontend/`)

### Key Directories

```
frontend/
├── app/
│   ├── (public)/      # Public pages (home, collections, about, contact, etc.)
│   ├── admin/         # Admin panel pages (JWT-protected)
│   ├── globals.css    # Global styles, Tailwind base, custom utilities
│   ├── layout.tsx     # Root layout — fonts, metadata, AuthProvider
│   └── icon.png       # Favicon (auto-detected by Next.js)
├── components/
│   ├── navigation/
│   │   ├── Navbar.tsx       # Top nav — logo + brand name + desktop/mobile links
│   │   └── Footer.tsx       # Footer — brand column, nav links, social, admin link
│   ├── ui/                  # Reusable UI components (SocialCard, etc.)
│   ├── admin/               # Admin-specific components
│   └── whatsapp/            # WhatsApp float button
├── sections/          # Homepage sections (Hero, BrandStory, WhatsAppCTA, etc.)
├── constants/
│   └── config.ts      # CONFIG object (brandName, brandTagline, social URLs, ROUTES)
├── context/
│   └── AuthContext.tsx  # JWT auth state, login/logout
├── utils/
│   └── whatsapp.ts    # buildWhatsAppUrl() helper
└── public/
    └── logo.png       # Brand logo — used in Navbar and Footer
```

### CONFIG (single source of truth)

All brand constants live in `frontend/constants/config.ts`:
- `CONFIG.brandName` — "M.M ATTARWALA"
- `CONFIG.brandTagline` — "THE ART OF SCENT"
- `CONFIG.instagram`, `CONFIG.facebook`, `CONFIG.youtube`
- `ROUTES.*` — all page routes

**Never hardcode brand name or routes. Always use CONFIG / ROUTES.**

### Styling

- Tailwind CSS with custom tokens in `tailwind.config.ts`
- Custom classes in `globals.css`: `container-luxury`, `label-luxury`, `ft-nav-link`, `ft-link-sm`, `ft-body`, `ft-copy`, `ft-tagline`, `ft-input`
- Color tokens: `gold`, `ivory`, `brown`
- Fonts: Cormorant Garamond (`font-serif`), Poppins (`font-sans`)
- Dark luxury theme on footer/hero: `bg-[#0C0700]`, gold accents `#C8A36A` / `#C6A16E`

### Logo & Favicon

- **Logo:** `frontend/public/logo.png` → referenced as `src="/logo.png"` via `next/image`
- **Favicon:** `frontend/app/icon.png` → auto-detected by Next.js App Router, no config needed

---

## Backend (`backend/`)

### Key Files

```
backend/
├── api/
│   ├── models.py      # Product, Category, SiteSettings, CustomFragranceInquiry
│   ├── views.py       # All API views
│   ├── serializers.py
│   ├── urls.py        # URL routing
│   └── management/commands/seed_data.py  # Seeds categories + admin user
├── project/
│   └── settings.py    # Django settings — reads from .env
└── requirements.txt
```

### Models

| Model | Key Fields |
|-------|-----------|
| `Category` | name, slug |
| `Product` | name, slug, category, price_inr, price_usd, images (up to 4), is_active, is_featured |
| `SiteSettings` | key, value (flat key/value store) |
| `CustomFragranceInquiry` | name, phone, fragrance_details, status |

### Auth

- SimpleJWT — access + refresh tokens
- Admin-only: `IsAdminUser` permission on all `/api/admin/*` endpoints
- Frontend stores JWT in memory (AuthContext), refresh token in httpOnly cookie

---

## Dev Commands

### Backend

```bash
cd backend
venv\Scripts\activate          # Windows
python manage.py runserver     # http://localhost:8000
python manage.py migrate
python manage.py seed_data     # Creates admin + categories
python manage.py test tests --verbosity=2
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

---

## Environment Variables

### Backend `backend/.env`

```
SECRET_KEY=
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=project1
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend `frontend/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=+919724586101
NEXT_PUBLIC_WHATSAPP_NUMBER_2=+919016361538
NEXT_PUBLIC_BRAND_NAME=M.M ATTARWALA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## API Endpoints

### Public

```
GET  /api/products/              List active products (?category=slug)
GET  /api/products/featured/     Featured products
GET  /api/products/{slug}/       Product detail
GET  /api/categories/            All categories
GET  /api/settings/              Site settings
POST /api/inquiries/             Submit fragrance inquiry
```

### Auth

```
POST /api/auth/login/
POST /api/auth/token/refresh/
POST /api/auth/logout/
GET  /api/auth/me/
```

### Admin (JWT required)

```
GET|POST              /api/admin/products/
GET|PUT|PATCH|DELETE  /api/admin/products/{id}/
POST                  /api/categories/
PUT|DELETE            /api/admin/categories/{id}/
PUT                   /api/admin/settings/
GET                   /api/admin/inquiries/
GET|PATCH|DELETE      /api/admin/inquiries/{id}/
```

---

## Important Conventions

1. **No customer accounts** — admin-only, never add customer auth
2. **WhatsApp over cart** — all conversions go through WhatsApp (`buildWhatsAppUrl()`)
3. **Currency via timezone** — IST offset → INR, else USD. No IP APIs.
4. **Images local in dev** — `media/products/` served by Django; Cloudinary for production
5. **`use client`** — mark components client-side only if they use hooks/browser APIs
6. **Framer Motion** — used for nav animations; avoid adding heavy motion to non-nav components unless intentional
7. **Admin route guard** — all `/admin/*` pages check `AuthContext` and redirect to `/admin/login` if unauthenticated

---

## Admin Login (dev)

URL: `http://localhost:3000/admin/login`
Username: `admin` | Password: `admin123`
