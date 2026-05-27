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


class FragranceRequestStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceRequest
        fields = ['status']
