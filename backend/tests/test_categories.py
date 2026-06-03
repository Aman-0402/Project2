"""
Categories API tests.
Run: python manage.py test tests.test_categories
"""
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from apps.categories.models import Category


class CategoryPublicTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Category.objects.create(name='Oud')
        Category.objects.create(name='Floral')

    def test_list_categories_public(self):
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 2)

    def test_create_category_requires_auth(self):
        response = self.client.post('/api/categories/', {'name': 'Citrus'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CategoryAdminTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin', password='admin123', email='a@test.com'
        )
        self.client.force_authenticate(user=self.admin)

    def test_admin_create_category(self):
        response = self.client.post('/api/categories/', {'name': 'Oriental'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Category.objects.filter(name='Oriental').exists())

    def test_auto_slug_generated(self):
        response = self.client.post('/api/categories/', {'name': 'Fresh Breeze'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        cat = Category.objects.get(name='Fresh Breeze')
        self.assertEqual(cat.slug, 'fresh-breeze')

    def test_admin_update_category(self):
        cat = Category.objects.create(name='OldName')
        response = self.client.put(
            f'/api/admin/categories/{cat.id}/',
            {'name': 'NewName'},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cat.refresh_from_db()
        self.assertEqual(cat.name, 'NewName')

    def test_admin_delete_category(self):
        cat = Category.objects.create(name='ToDelete')
        response = self.client.delete(f'/api/admin/categories/{cat.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Category.objects.filter(id=cat.id).exists())
