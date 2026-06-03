"""
Products API tests.
Run: python manage.py test tests.test_products
"""
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from apps.products.models import Product
from apps.categories.models import Category


class ProductPublicTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Oud')
        self.product = Product.objects.create(
            name='Royal Oudh',
            price='150.00',
            volume='50ml',
            category=self.category,
            is_active=True,
            is_featured=True,
            fragrance_notes={'top': ['bergamot'], 'middle': ['rose'], 'base': ['oud']},
        )
        self.inactive_product = Product.objects.create(
            name='Hidden Gem',
            price='100.00',
            is_active=False,
        )

    def test_list_products_returns_only_active(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [p['name'] for p in response.data['results']]
        self.assertIn('Royal Oudh', names)
        self.assertNotIn('Hidden Gem', names)

    def test_featured_products(self):
        response = self.client.get('/api/products/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)

    def test_product_detail_by_slug(self):
        response = self.client.get(f'/api/products/{self.product.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Royal Oudh')

    def test_product_detail_not_found(self):
        response = self.client.get('/api/products/nonexistent-slug/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_filter_by_category(self):
        response = self.client.get('/api/products/?category=oud')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class ProductAdminTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username='admin', password='admin123', email='a@test.com'
        )
        self.category = Category.objects.create(name='Floral')
        self.client.force_authenticate(user=self.admin)

    def test_admin_create_product(self):
        response = self.client.post('/api/admin/products/', {
            'name': 'Jasmine Dream',
            'price': '120.00',
            'volume': '100ml',
            'category': self.category.id,
            'fragrance_notes': {'top': ['jasmine'], 'middle': ['rose'], 'base': ['musk']},
            'is_featured': True,
            'is_active': True,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['data']['name'], 'Jasmine Dream')
        self.assertTrue(Product.objects.filter(name='Jasmine Dream').exists())

    def test_admin_update_product(self):
        product = Product.objects.create(name='Test', price='50.00', is_active=True)
        response = self.client.patch(
            f'/api/admin/products/{product.id}/',
            {'price': '75.00'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(str(product.price), '75.00')

    def test_admin_delete_product(self):
        product = Product.objects.create(name='Delete Me', price='50.00')
        response = self.client.delete(f'/api/admin/products/{product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Product.objects.filter(id=product.id).exists())

    def test_unauthenticated_cannot_create(self):
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/admin/products/', {'name': 'X', 'price': '10.00'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_price_rejected(self):
        response = self.client.post('/api/admin/products/', {
            'name': 'Bad Product',
            'price': '-10.00',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
