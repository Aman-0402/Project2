from django.db import models


class SiteSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['key']

    def __str__(self):
        return f'{self.key}: {self.value[:50] if self.value else ""}'

    @classmethod
    def get(cls, key, default=None):
        """Convenience class method to fetch a setting value."""
        try:
            return cls.objects.get(key=key).value
        except cls.DoesNotExist:
            return default
