"""
Management command: python manage.py seed_data

Seeds:
  - 6 luxury fragrance categories
  - Initial site settings (brand_name, tagline, about_text, whatsapp_number)
  - Creates admin superuser if none exists
"""
import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.categories.models import Category
from apps.site_settings.models import SiteSetting


CATEGORIES = [
    {'name': 'Oud', 'description': 'Deep, rich, and resinous fragrances from agarwood.'},
    {'name': 'Floral', 'description': 'Elegant bouquets of blooming flowers.'},
    {'name': 'Citrus', 'description': 'Fresh, bright, and invigorating citrus accords.'},
    {'name': 'Oriental', 'description': 'Warm, spicy, and exotic eastern-inspired scents.'},
    {'name': 'Woody', 'description': 'Earthy, grounded notes of cedar, sandalwood, and more.'},
    {'name': 'Fresh', 'description': 'Clean, airy, and modern lightweight fragrances.'},
]

INITIAL_SETTINGS = {
    'brand_name': 'M.M ATTARWALA',
    'tagline': 'The Art of Scent',
    'about_text': (
        'M.M Attarwala is a traditional Indian fragrance house based in Vadodara, Gujarat. '
        'Crafting authentic Indian attars, perfume sprays, deodorant sprays, room fresheners, '
        'car sprays, and agarbatti with timeless artistry since generations. '
        'Trusted by fragrance lovers across India and beyond.'
    ),
    'whatsapp_number': os.environ.get('WHATSAPP_NUMBER', '+919724586101'),
    'hero_headline': 'The Essence of Paradise',
    'hero_subheadline': 'Traditional Indian attars, perfumes & agarbatti — crafted with timeless artistry in Vadodara.',
}


class Command(BaseCommand):
    help = 'Seed initial data: categories, site settings, and optional admin user'

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-username',
            default='admin',
            help='Admin username (default: admin)',
        )
        parser.add_argument(
            '--admin-password',
            default='admin123',
            help='Admin password (default: admin123)',
        )
        parser.add_argument(
            '--admin-email',
            default='mmattarwala2008@rediff.com',
            help='Admin email',
        )

    def handle(self, *args, **options):
        self._seed_categories()
        self._seed_settings()
        self._seed_admin(
            options['admin_username'],
            options['admin_password'],
            options['admin_email'],
        )
        self.stdout.write(self.style.SUCCESS('[OK] Seed data complete.'))

    def _seed_categories(self):
        created = 0
        for cat_data in CATEGORIES:
            _, is_new = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']},
            )
            if is_new:
                created += 1
        self.stdout.write(f'  Categories: {created} created, {len(CATEGORIES) - created} already existed.')

    def _seed_settings(self):
        created = 0
        for key, value in INITIAL_SETTINGS.items():
            _, is_new = SiteSetting.objects.get_or_create(key=key, defaults={'value': value})
            if is_new:
                created += 1
        self.stdout.write(f'  Settings: {created} created, {len(INITIAL_SETTINGS) - created} already existed.')

    def _seed_admin(self, username, password, email):
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write('  Admin: superuser already exists, skipping.')
            return
        User.objects.create_superuser(username=username, password=password, email=email)
        self.stdout.write(
            self.style.WARNING(
                f'  Admin: created superuser "{username}" with password "{password}" - CHANGE IN PRODUCTION.'
            )
        )
