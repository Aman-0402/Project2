from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='FragranceRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(max_length=20)),
                ('occasion', models.CharField(max_length=50)),
                ('notes', models.JSONField(default=list)),
                ('intensity', models.CharField(max_length=30)),
                ('fragrance_name', models.CharField(max_length=200)),
                ('customer_name', models.CharField(max_length=200)),
                ('customer_phone', models.CharField(max_length=50)),
                ('customer_city', models.CharField(blank=True, max_length=100)),
                ('additional_notes', models.TextField(blank=True)),
                ('status', models.CharField(
                    choices=[('new', 'New'), ('contacted', 'Contacted'), ('completed', 'Completed')],
                    default='new',
                    max_length=20,
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
