# Generated by Django 3.2.9 on 2021-12-29 04:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memberships', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='folio',
            field=models.CharField(default='Fsd', max_length=10),
            preserve_default=False,
        ),
    ]
