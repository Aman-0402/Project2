from django.urls import path
from .views import (
    ProductListView,
    FeaturedProductsView,
    ProductDetailView,
    AdminProductListView,
    AdminProductDetailView,
)

urlpatterns = [
    # Public — order matters: 'featured' before '<slug>'
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/featured/', FeaturedProductsView.as_view(), name='product-featured'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),

    # Admin — all require IsAdminUser
    path('admin/products/', AdminProductListView.as_view(), name='admin-product-list'),
    path('admin/products/<int:pk>/', AdminProductDetailView.as_view(), name='admin-product-detail'),
]
