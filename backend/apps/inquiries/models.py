from django.db import models


class FragranceRequest(models.Model):
    STATUS_NEW = 'new'
    STATUS_CONTACTED = 'contacted'
    STATUS_COMPLETED = 'completed'
    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_CONTACTED, 'Contacted'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    gender = models.CharField(max_length=20)
    occasion = models.CharField(max_length=50)
    notes = models.JSONField(default=list)
    intensity = models.CharField(max_length=30)
    fragrance_name = models.CharField(max_length=200)
    customer_name = models.CharField(max_length=200)
    customer_phone = models.CharField(max_length=50)
    customer_city = models.CharField(max_length=100, blank=True)
    additional_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status'], name='idx_inquiry_status'),
            models.Index(fields=['-created_at'], name='idx_inquiry_created_at'),
        ]

    def __str__(self):
        return f'"{self.fragrance_name}" by {self.customer_name}'
