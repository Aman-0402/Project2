from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from utils.response import success_response, error_response, unauthorized_response
from .serializers import LoginSerializer, AdminUserSerializer
from .permissions import IsAdminUser


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message='Login failed.',
                errors=serializer.errors,
            )

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        return success_response(
            data={
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': AdminUserSerializer(user).data,
            },
            message='Login successful.',
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return error_response(message='Refresh token required.')
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return error_response(message='Invalid or expired token.')
        return success_response(message='Logged out successfully.')


class MeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return success_response(data=AdminUserSerializer(request.user).data)


class ChangePasswordView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password     = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not all([current_password, new_password, confirm_password]):
            return error_response(message='All fields are required.')

        if not request.user.check_password(current_password):
            return error_response(message='Current password is incorrect.')

        if new_password != confirm_password:
            return error_response(message='New passwords do not match.')

        if len(new_password) < 8:
            return error_response(message='New password must be at least 8 characters.')

        request.user.set_password(new_password)
        request.user.save()
        return success_response(message='Password changed successfully.')
