import os
import uuid
import filetype
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination
from django.conf import settings
from apps.authentication.permissions import IsAdminUser
from utils.response import (
    success_response, error_response, created_response, not_found_response
)
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer, ProductWriteSerializer


class ProductPagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdminProductPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200

MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2 MB

# Maps validated MIME type (from file bytes) to safe extension
MIME_TO_EXT = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
}


class ProductListView(APIView):
    """GET list of active products (public, filterable by category)."""
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.filter(is_active=True).select_related('category').prefetch_related('subcategories')
        category_slug = request.query_params.get('category')
        if category_slug:
            products = products.filter(category__slug=category_slug)
        serializer = ProductListSerializer(products, many=True)
        return success_response(data=serializer.data)


class FeaturedProductsView(APIView):
    """GET featured products for homepage (public)."""
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.filter(
            is_active=True, is_featured=True
        ).select_related('category')[:8]
        serializer = ProductListSerializer(products, many=True)
        return success_response(data=serializer.data)


class ProductDetailView(APIView):
    """GET single product by slug (public)."""
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            product = Product.objects.select_related('category').get(slug=slug, is_active=True)
        except Product.DoesNotExist:
            return not_found_response('Product not found.')
        serializer = ProductDetailSerializer(product)
        return success_response(data=serializer.data)


class AdminProductListView(APIView):
    """GET all products (admin) + POST create product (admin)."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        products = Product.objects.all().select_related('category').prefetch_related('subcategories')
        serializer = ProductDetailSerializer(products, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        serializer = ProductWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)
        product = serializer.save()
        return created_response(
            data=ProductDetailSerializer(product).data,
            message='Product created.',
        )


class AdminProductDetailView(APIView):
    """PUT/PATCH update, DELETE product (admin)."""
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return not_found_response('Product not found.')
        return success_response(data=ProductDetailSerializer(product).data)

    def put(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return not_found_response('Product not found.')
        serializer = ProductWriteSerializer(product, data=request.data)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)
        product = serializer.save()
        return success_response(
            data=ProductDetailSerializer(product).data,
            message='Product updated.',
        )

    def patch(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return not_found_response('Product not found.')
        serializer = ProductWriteSerializer(product, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)
        product = serializer.save()
        return success_response(
            data=ProductDetailSerializer(product).data,
            message='Product updated.',
        )

    def delete(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return not_found_response('Product not found.')
        product.delete()
        return success_response(message='Product deleted.')


class AdminImageUploadView(APIView):
    """POST /api/admin/upload-image/ — upload one image to local media storage (admin only)."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return error_response(message='No image file provided.')

        if file.size > MAX_IMAGE_SIZE:
            return error_response(message='Image exceeds 2 MB limit.')

        # Validate actual file content — not the user-supplied Content-Type header
        header = file.read(512)
        file.seek(0)
        kind = filetype.guess(header)
        detected_mime = kind.mime if kind else None
        ext = MIME_TO_EXT.get(detected_mime)
        if not ext:
            return error_response(message='Invalid file type. Use JPEG, PNG, or WebP.')

        try:
            filename = f"{uuid.uuid4().hex}{ext}"
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'products')
            os.makedirs(upload_dir, exist_ok=True)
            filepath = os.path.join(upload_dir, filename)
            with open(filepath, 'wb') as dest:
                for chunk in file.chunks():
                    dest.write(chunk)
            url = request.build_absolute_uri(f"{settings.MEDIA_URL}products/{filename}")
        except Exception as exc:
            return error_response(message=f'Upload failed: {str(exc)}')

        return success_response(data={'url': url}, message='Image uploaded.')
