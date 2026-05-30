from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0002_subcategory'),
        ('products', '0003_product_image_layer_effect'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='subcategories',
            field=models.ManyToManyField(
                blank=True,
                help_text='Sub-tags within the main category',
                related_name='products',
                to='categories.subcategory',
            ),
        ),
    ]
