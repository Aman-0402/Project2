from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_product_images'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='image_layer_effect',
            field=models.BooleanField(default=True, help_text='Composite bottle (image 1) over background (image 2) on product page'),
        ),
    ]
