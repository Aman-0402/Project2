from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.authentication.permissions import IsAdminUser
from utils.response import (
    success_response, error_response, created_response, not_found_response
)
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer, ProductWriteSerializer
from services.cloudinary_service import upload_image

MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2 MB
ALLOWED_IMAGE_TYPES = ('image/jpeg', 'image/jpg', 'image/png', 'image/webp')


class ProductListView(APIView):
    """GET list of active products (public, filterable by category)."""
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.filter(is_active=True).select_related('category')
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
        products = Product.objects.all().select_related('category')
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
    """POST /api/admin/upload-image/ — upload one image to Cloudinary (admin only)."""
    permission_classes = [IsAdminUser]

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return error_response(message='No image file provided.')

        if file.content_type not in ALLOWED_IMAGE_TYPES:
            return error_response(message='Invalid file type. Use JPEG, PNG, or WebP.')

        if file.size > MAX_IMAGE_SIZE:
            return error_response(message='Image exceeds 2 MB limit.')

        try:
            url = upload_image(file, folder='mm-attarwala/products')
        except Exception as exc:
            return error_response(message=f'Upload failed: {str(exc)}')

        return success_response(data={'url': url}, message='Image uploaded.')
