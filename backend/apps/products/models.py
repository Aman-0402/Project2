from django.db import models
from django.utils.text import slugify
from apps.categories.models import Category


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    volume = models.CharField(max_length=50, blank=True, null=True, help_text='e.g. 50ml, 100ml')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
    )
    # Fragrance notes stored as JSON: {"top": [...], "middle": [...], "base": [...]}
    fragrance_notes = models.JSONField(default=dict, blank=True)
    image = models.CharField(max_length=500, blank=True, null=True, help_text='Primary Cloudinary URL (auto-set from images[0])')
    images = models.JSONField(default=list, blank=True, help_text='Array of up to 4 Cloudinary URLs')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
