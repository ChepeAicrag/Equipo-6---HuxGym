from django.db import models
from django.db.models.deletion import SET_NULL
from django.db.models.fields.files import ImageField

def upload_load(instance,filename):
    return f'photos_products/{instance.name}/{filename}'

# Create your models here.
class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40, blank=False, null=False)
    description = models.CharField(max_length=100, blank=False, null=False)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        db_table = 'category'
        ordering = ['id']

class Provider(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, blank=False, null=False)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=10, null=True, blank=True)
    rfc = models.CharField(max_length=13, null=False, blank=False)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Provider'
        verbose_name_plural = 'Providers'
        db_table = 'provider'
        ordering = ['id']

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40, blank=False, null=False)
    description = models.TextField(max_length=150, blank=False, null=False)
    price_s = models.FloatField(blank=False, null=False)
    price_c = models.FloatField(blank=False, null=False)
    image = models.ImageField(upload_to = upload_load,default='photodefault.jpg', max_length=255, blank=True, null = True)
    category_id = models.ForeignKey(Category, on_delete=models.PROTECT, null=False, blank=False)
    provider_id = models.ForeignKey(Provider, null=False, on_delete=models.PROTECT, blank=False)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        db_table = 'product'
        ordering = ['id']


class Stock(models.Model):
    id = models.AutoField(primary_key=True)
    product_id = models.OneToOneField(Product, on_delete=models.CASCADE)
    amount = models.PositiveBigIntegerField(null=False, blank=False)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.product_id.name + " : " + str(self.amount)

    class Meta:
        verbose_name = 'Stock'
        verbose_name_plural = 'Stocks'
        db_table = 'stock'
        ordering = ['id']

class OperationType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20, null=False, blank=False)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.name 

    class Meta:
        verbose_name = 'OperationType'
        verbose_name_plural = 'OperationTypes'
        db_table = 'operationType'
        ordering = ['id']

class Operation(models.Model):
    id = models.AutoField(primary_key=True)
    amount = models.IntegerField(blank=False, null=False)
    description = models.TextField(max_length=100, null=False, blank=False)
    status_delete = models.BooleanField(default=False)

    operationType_id = models.ForeignKey(OperationType, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return "(" + str(self.id) + ") " + self.operationType_id.name + " : " + str(self.amount)

    class Meta:
        verbose_name = 'Operation'
        verbose_name_plural = 'Operations'
        db_table = 'operation'
        ordering = ['id']

class HistoryInventory(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField('Fecha de acción', auto_now_add=True)
    amount = models.IntegerField(null=False, blank=False)
    status_delete = models.BooleanField(default=False)

    product_id = models.ForeignKey(Product, on_delete=models.CASCADE)
    operation_id = models.ForeignKey(Operation, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.product_id.name + " / " + self.operation_id.description + " : " + str(self.operation_id.amount) + " / actual: " + str(self.amount) + " / " + str(self.date)

    class Meta:
        verbose_name = 'HistoryInventory'
        verbose_name_plural = 'HistoryInventorys'
        db_table = 'historyInventory'
        ordering = ['id']

