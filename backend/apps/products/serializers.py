from rest_framework import serializers
from .models import Product
from apps.categories.serializers import CategorySerializer


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'volume',
            'category', 'image', 'is_featured', 'created_at',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for product detail view."""
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'volume',
            'category', 'fragrance_notes', 'image', 'is_featured',
            'is_active', 'created_at', 'updated_at',
        ]


class ProductWriteSerializer(serializers.ModelSerializer):
    """Serializer for create/update (admin)."""

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'volume',
            'category', 'fragrance_notes', 'image',
            'is_featured', 'is_active',
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
