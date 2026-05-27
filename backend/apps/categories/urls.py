from django.urls import path
from .views import CategoryListView, CategoryDetailView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('admin/categories/<int:pk>/', CategoryDetailView.as_view(), name='admin-category-detail'),
]
