from django.urls import path
from .views import (
    FragranceRequestCreateView,
    AdminFragranceRequestListView,
    AdminFragranceRequestDetailView,
)

urlpatterns = [
    path('inquiries/', FragranceRequestCreateView.as_view()),
    path('admin/inquiries/', AdminFragranceRequestListView.as_view()),
    path('admin/inquiries/<int:pk>/', AdminFragranceRequestDetailView.as_view()),
]
