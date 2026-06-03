from rest_framework import serializers
from .models import Category, SubCategory


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'slug']


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'product_count', 'subcategories', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']

    def get_product_count(self, obj):
        # Prefer annotated value (set by CategoryListView) to avoid N+1
        if hasattr(obj, 'active_product_count'):
            return obj.active_product_count
        return obj.products.filter(is_active=True).count()


class CategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'description']
