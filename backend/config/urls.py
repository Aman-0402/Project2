"""Root URL configuration for LUXE PARFUM backend."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('_panel/mma-internal/', admin.site.urls),
    path('api/health/', health_check),

    # API routes — all app routers mount at /api/
    path('api/auth/', include('apps.authentication.urls')),
    path('api/', include('apps.products.urls')),
    path('api/', include('apps.categories.urls')),
    path('api/', include('apps.site_settings.urls')),
    path('api/', include('apps.inquiries.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
