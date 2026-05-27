from rest_framework import serializers
from .models import SiteSetting


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['id', 'key', 'value', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class SiteSettingsBulkSerializer(serializers.Serializer):
    """Accept a flat dict of key:value pairs for bulk update."""
    settings = serializers.DictField(child=serializers.CharField(allow_blank=True))
