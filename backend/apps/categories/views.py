from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.authentication.permissions import IsAdminUser
from utils.response import (
    success_response, error_response, created_response, not_found_response
)
from .models import Category, SubCategory
from .serializers import CategorySerializer, CategoryWriteSerializer, SubCategorySerializer


class CategoryListView(APIView):
    """GET all categories (public). POST create (admin)."""

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [AllowAny()]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        serializer = CategoryWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)
        category = serializer.save()
        return created_response(data=CategorySerializer(category).data, message='Category created.')


class CategoryDetailView(APIView):
    """PUT update, DELETE remove (admin only)."""
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return None

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return not_found_response('Category not found.')
        serializer = CategoryWriteSerializer(category, data=request.data)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)
        category = serializer.save()
        return success_response(data=CategorySerializer(category).data, message='Category updated.')

    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return not_found_response('Category not found.')
        category.delete()
        return success_response(message='Category deleted.')
