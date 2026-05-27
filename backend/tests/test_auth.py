"""
Authentication API tests.
Run: python manage.py test tests.test_auth
"""
from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status


class AuthLoginTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='testadmin',
            password='testpass123',
            email='admin@test.com',
        )
        self.regular_user = User.objects.create_user(
            username='regular',
            password='testpass123',
        )

    def test_admin_login_success(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testadmin',
            'password': 'testpass123',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data['data'])
        self.assertIn('refresh', response.data['data'])
        self.assertIn('user', response.data['data'])

    def test_login_invalid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'testadmin',
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_non_admin_login_rejected(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'regular',
            'password': 'testpass123',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_me_endpoint_with_token(self):
        login_response = self.client.post('/api/auth/login/', {
            'username': 'testadmin',
            'password': 'testpass123',
        })
        token = login_response.data['data']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['username'], 'testadmin')

    def test_me_endpoint_without_token(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
