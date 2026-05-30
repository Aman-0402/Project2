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
    {'name': 'Attar', 'description': 'Traditional Indian attars — pure, concentrated fragrance oils crafted from natural ingredients.'},
    {'name': 'Perfume', 'description': 'Premium perfume sprays — long-lasting luxury fragrances for every occasion.'},
    {'name': 'Agarbatti', 'description': 'Handcrafted incense sticks — fill your space with the sacred aroma of the finest ingredients.'},
    {'name': 'Room Fragrance', 'description': 'Elegant room freshener sprays — transform any space into a sanctuary of scent.'},
    {'name': 'Car Perfume', 'description': 'Premium car perfumes — carry luxury with you on every journey.'},
    {'name': 'Car Freshener', 'description': 'Long-lasting car fresheners — crisp, clean fragrance for your drive.'},
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
    'whatsapp_number_2': os.environ.get('WHATSAPP_NUMBER_2', '+919016361538'),
    'hero_headline': 'The Essence of Paradise',
    'hero_subheadline': 'Traditional Indian attars, perfumes & agarbatti — crafted with timeless artistry in Vadodara.',
    'image_layer_effect': 'true',
    'instagram_url': 'https://www.instagram.com/mmattarwala/',
    'facebook_url': 'https://www.facebook.com/mmattarwala/',
    'youtube_url': 'https://www.youtube.com/@mmattarwala',
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
        # Remove categories not in the new list (old scent-family categories)
        new_names = {c['name'] for c in CATEGORIES}
        deleted, _ = Category.objects.exclude(name__in=new_names).delete()
        if deleted:
            self.stdout.write(f'  Categories: removed {deleted} old categories.')
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
