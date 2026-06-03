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
├── config/
│   ├── settings/
│   │   ├── base.py          # Shared settings — JWT, DRF, throttling, GZip
│   │   ├── development.py   # Debug=True, CORS_ALLOW_ALL_ORIGINS
│   │   └── production.py    # SSL, HSTS, Cloudinary storage, Sentry init
│   ├── urls.py              # Root URL config
│   └── wsgi.py
├── apps/
│   ├── authentication/      # Login, logout, token refresh, change-password
│   ├── products/            # Product CRUD + image upload (filetype MIME validation)
│   ├── categories/          # Category + subcategory management
│   ├── site_settings/       # Key/value site settings (8-key allowlist on write)
│   └── inquiries/           # Custom fragrance requests (rate-limited public submit)
├── utils/
│   ├── response.py          # success_response(), error_response(), etc.
│   └── exceptions.py        # Custom DRF exception handler (no stack trace leaks)
├── tests/                   # test_auth.py, test_products.py, test_categories.py
├── requirements.txt
└── Dockerfile
```

### Models

| Model | Key Fields |
|-------|-----------|
| `Category` | name, slug (auto-generated) |
| `SubCategory` | name, slug, category (FK) |
| `Product` | name, slug, category (FK), subcategories (M2M), price, volume_prices (JSON), images (JSON, max 4), fragrance_notes (JSON), is_active, is_featured, image_layer_effect |
| `SiteSetting` | key, value (flat EAV store) |
| `FragranceRequest` | customer_name, customer_phone (validated), notes (JSON), status |

### Auth

- SimpleJWT — access (60 min) + refresh (7 days) tokens with rotation + blacklist
- `IsAdminUser` permission: `is_authenticated AND is_staff`
- Frontend stores tokens in cookies with `secure: true`, `sameSite: strict`
- Auto-refresh on 401 via Axios interceptor — redirects to `/admin/login` on failure
- Login rate-limited: **5 requests/minute**

### Security Conventions

- **Django admin:** URL is `/_panel/mma-internal/` — not `/admin/` or `/django-admin/`
- **Image uploads:** `filetype` library validates actual file bytes — not the `Content-Type` header
- **Inquiry endpoint:** Rate-limited **3 requests/minute** — public but throttled
- **Settings write:** Key allowlist enforced — only 8 known keys accepted
- **SECRET_KEY:** Raises `RuntimeError` if unset in non-dev mode

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
GET  /api/health/                Health check (Render uses this)
GET  /api/products/              Active products — paginated (24/page, ?category=slug, ?page=N)
GET  /api/products/featured/     Featured products (max 8, unpaginated)
GET  /api/products/{slug}/       Product detail
GET  /api/categories/            All categories (with product_count, subcategories)
GET  /api/settings/              Site settings (key:value dict)
POST /api/inquiries/             Submit fragrance inquiry [rate limit: 3/min]
```

### Auth

```
POST /api/auth/login/            Login [rate limit: 5/min]
POST /api/auth/token/refresh/
POST /api/auth/logout/           Blacklists refresh token
GET  /api/auth/me/
POST /api/auth/change-password/
```

### Admin (JWT required — `is_staff`)

```
GET|POST              /api/admin/products/         Paginated (50/page)
GET|PUT|PATCH|DELETE  /api/admin/products/{id}/
POST                  /api/admin/upload-image/     MIME-validated image upload
POST                  /api/categories/
PUT|DELETE            /api/admin/categories/{id}/
PUT                   /api/admin/settings/         Key allowlist enforced
GET                   /api/admin/inquiries/        Paginated (25/page, ?status=new|contacted|completed)
GET|PATCH|DELETE      /api/admin/inquiries/{id}/
```

---

## Important Conventions

1. **No customer accounts** — admin-only, never add customer auth
2. **WhatsApp over cart** — all conversions go through WhatsApp (`buildWhatsAppUrl()`)
3. **Currency via timezone** — IST offset → INR, else USD. No IP APIs.
4. **Images local in dev** — `media/products/` served by Django; Cloudinary active in production via `DEFAULT_FILE_STORAGE`
5. **`use client`** — mark components client-side only if they use hooks/browser APIs
6. **Framer Motion** — used for nav animations; avoid adding heavy motion to non-nav components unless intentional
7. **Admin route guard** — `frontend/middleware.ts` protects all `/admin/*` — checks cookie existence; API interceptor handles 401
8. **Throttling** — login: 5/min, inquiry create: 3/min, anon global: 200/day — do not remove these
9. **MIME validation** — image uploads use `filetype.guess(header)` on actual bytes — never trust `file.content_type`
10. **Settings allowlist** — `site_settings/serializers.py` has `ALLOWED_SETTING_KEYS` — add new keys there before using them
11. **Test setUp pattern** — admin tests use `client.force_authenticate(user=self.admin)` not API login (avoids throttle in test suite)

---

## Admin Login (dev)

URL: `http://localhost:3000/admin/login`
Username: `admin` | Password: `admin123`

> **Django built-in admin** (database-level): `http://localhost:8000/_panel/mma-internal/`  
> Same credentials. Change password before production go-live.
