# Generated by Django 3.2.3 on 2022-01-04 19:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='birthdate',
            field=models.DateField(default='2022-01-04', verbose_name='birthdate'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='curp',
            field=models.CharField(default='1234567891', max_length=18, unique=True, verbose_name='curp'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='entity_birth',
            field=models.CharField(default='AA', max_length=2, verbose_name='entity birth'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='mothers_maiden_name',
            field=models.CharField(default='null', max_length=150, verbose_name='mother maiden name'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='paternal_surname',
            field=models.CharField(default='null', max_length=150, verbose_name='paternal surname'),
            preserve_default=False,
        ),
    ]
