from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.authentication.permissions import IsAdminUser
from utils.response import success_response, error_response
from .models import SiteSetting
from .serializers import SiteSettingSerializer, SiteSettingsBulkSerializer


class SiteSettingsView(APIView):
    """
    GET /api/settings/   — public, returns all key-value pairs as flat dict
    PUT /api/admin/settings/ — admin, bulk update settings
    """

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH']:
            return [IsAdminUser()]
        return [AllowAny()]

    def get(self, request):
        settings = SiteSetting.objects.all()
        data = {s.key: s.value for s in settings}
        return success_response(data=data)

    def put(self, request):
        serializer = SiteSettingsBulkSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)

        settings_dict = serializer.validated_data['settings']
        updated = []
        for key, value in settings_dict.items():
            obj, _ = SiteSetting.objects.update_or_create(
                key=key, defaults={'value': value}
            )
            updated.append({'key': obj.key, 'value': obj.value})

        return success_response(data=updated, message='Settings updated.')
