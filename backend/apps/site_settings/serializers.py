from rest_framework import serializers
from .models import SiteSetting

ALLOWED_SETTING_KEYS = {
    'brand_name',
    'tagline',
    'about_text',
    'whatsapp_number',
    'whatsapp_number_2',
    'hero_headline',
    'hero_subheadline',
    'image_layer_effect',
}


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['id', 'key', 'value', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class SiteSettingsBulkSerializer(serializers.Serializer):
    """Accept a flat dict of key:value pairs for bulk update."""
    settings = serializers.DictField(child=serializers.CharField(allow_blank=True))

    def validate_settings(self, value):
        unknown = set(value.keys()) - ALLOWED_SETTING_KEYS
        if unknown:
            raise serializers.ValidationError(
                f"Unknown setting key(s): {', '.join(sorted(unknown))}. "
                f"Allowed: {', '.join(sorted(ALLOWED_SETTING_KEYS))}."
            )
        return value
