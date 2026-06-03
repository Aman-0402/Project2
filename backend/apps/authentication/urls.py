from django.urls import path
from .views import LoginView, LogoutView, MeView, ChangePasswordView, ThrottledTokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('token/refresh/', ThrottledTokenRefreshView.as_view(), name='token-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('change-password/', ChangePasswordView.as_view(), name='auth-change-password'),
]
