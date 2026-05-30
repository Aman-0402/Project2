from django.urls import path
from .views import CategoryListView, CategoryDetailView, SubCategoryListView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/subcategories/', SubCategoryListView.as_view(), name='subcategory-list'),
    path('admin/categories/<int:pk>/', CategoryDetailView.as_view(), name='admin-category-detail'),
]
