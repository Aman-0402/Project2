from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_product_subcategories'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='volume_prices',
            field=models.JSONField(blank=True, default=dict, help_text='Per-volume pricing: {"10ml": 500, "50ml": 1999}'),
        ),
    ]
