from rest_framework import serializers
from .models import Product
from apps.categories.models import SubCategory
from apps.categories.serializers import CategorySerializer, SubCategorySerializer


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    category = CategorySerializer(read_only=True)
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'volume', 'volume_prices',
            'category', 'subcategories', 'image', 'images', 'is_featured', 'image_layer_effect', 'created_at',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product detail view."""
    category = CategorySerializer(read_only=True)
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'volume', 'volume_prices',
            'category', 'subcategories', 'fragrance_notes', 'image', 'images', 'is_featured',
            'is_active', 'image_layer_effect', 'created_at', 'updated_at',
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    """Serializer for create/update (admin)."""
    subcategories = serializers.PrimaryKeyRelatedField(
        many=True, queryset=SubCategory.objects.all(), required=False
    )

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'volume', 'volume_prices',
            'category', 'subcategories', 'fragrance_notes', 'image', 'images',
            'is_featured', 'is_active', 'image_layer_effect',
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Price must be positive.')
        return value

    def validate_fragrance_notes(self, value):
        if value and not isinstance(value, dict):
            raise serializers.ValidationError(
                'fragrance_notes must be a JSON object with top/middle/base keys.'
            )
        return value

    def validate_images(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('images must be a list of URLs.')
        if len(value) > 4:
            raise serializers.ValidationError('Maximum 4 images allowed.')
        return value

    def validate(self, data):
        images = data.get('images', [])
        if images:
            data['image'] = images[0]
        # Auto-set price from lowest volume price
        volume_prices = data.get('volume_prices', {})
        if volume_prices:
            try:
                data['price'] = min(float(v) for v in volume_prices.values() if v)
            except (ValueError, TypeError):
                pass
        return data
