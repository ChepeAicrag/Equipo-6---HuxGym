# Generated by Django 3.2.3 on 2022-01-04 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0002_auto_20220104_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attendance',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='bodyattribute',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='bodyattribute_historyclinic',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='gender',
            field=models.CharField(choices=[('M', 'Mujer'), ('H', 'Hombre')], default='M', max_length=1),
        ),
        migrations.AlterField(
            model_name='customer_membership',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='historyclinic',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='nutritionalsituation',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='typeextrainformation',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='typeextrainformation_historyclinic',
            name='folio',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]