# Generated by Django 3.2.3 on 2022-01-06 04:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cashregister',
            name='folio',
            field=models.CharField(default=' ', max_length=50, unique=True),
            preserve_default=False,
        ),
    ]
