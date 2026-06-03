import re
from rest_framework import serializers
from .models import FragranceRequest


class FragranceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceRequest
        fields = '__all__'
        read_only_fields = ['id', 'status', 'created_at']


class FragranceRequestWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceRequest
        exclude = ['status', 'created_at']

    def validate_customer_phone(self, value):
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        if not re.match(r'^\+?\d{7,15}$', cleaned):
            raise serializers.ValidationError('Enter a valid phone number (7–15 digits).')
        return value

    def validate_customer_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Name must be at least 2 characters.')
        return value.strip()


class FragranceRequestStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceRequest
        fields = ['status']
