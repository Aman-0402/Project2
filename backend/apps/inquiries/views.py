from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from apps.authentication.permissions import IsAdminUser
from utils.response import (
    success_response, error_response, created_response, not_found_response
)
from .models import FragranceRequest
from .serializers import (
    FragranceRequestSerializer,
    FragranceRequestWriteSerializer,
    FragranceRequestStatusSerializer,
)


class FragranceRequestCreateView(APIView):
    """POST — public, no auth required. Saves custom fragrance inquiry."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = FragranceRequestWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)
        inquiry = serializer.save()
        return created_response(
            data=FragranceRequestSerializer(inquiry).data,
            message='Fragrance request saved successfully.',
        )


class AdminFragranceRequestListView(APIView):
    """GET all inquiries (admin). Optional ?status=new|contacted|completed filter."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        inquiries = FragranceRequest.objects.all()
        status_filter = request.query_params.get('status')
        if status_filter in [FragranceRequest.STATUS_NEW, FragranceRequest.STATUS_CONTACTED, FragranceRequest.STATUS_COMPLETED]:
            inquiries = inquiries.filter(status=status_filter)
        serializer = FragranceRequestSerializer(inquiries, many=True)
        return success_response(data=serializer.data)


class AdminFragranceRequestDetailView(APIView):
    """PATCH status, DELETE — admin only."""
    permission_classes = [IsAdminUser]

    def _get(self, pk):
        try:
            return FragranceRequest.objects.get(pk=pk)
        except FragranceRequest.DoesNotExist:
            return None

    def patch(self, request, pk):
        inquiry = self._get(pk)
        if not inquiry:
            return not_found_response('Inquiry not found.')
        serializer = FragranceRequestStatusSerializer(inquiry, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(errors=serializer.errors)
        serializer.save()
        return success_response(
            data=FragranceRequestSerializer(inquiry).data,
            message='Status updated.',
        )

    def delete(self, request, pk):
        inquiry = self._get(pk)
        if not inquiry:
            return not_found_response('Inquiry not found.')
        inquiry.delete()
        return success_response(message='Inquiry deleted.')
