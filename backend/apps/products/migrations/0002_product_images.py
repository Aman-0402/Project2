from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='images',
            field=models.JSONField(blank=True, default=list, help_text='Array of up to 4 Cloudinary URLs'),
        ),
    ]
