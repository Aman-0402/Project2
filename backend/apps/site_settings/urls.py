from django.urls import path
from .views import SiteSettingsView

urlpatterns = [
    path('settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('admin/settings/', SiteSettingsView.as_view(), name='admin-site-settings'),
]
