from django.db import models
from ..products.models import Product
from ..users.models import User, CashRegister
from ..customers.models import Customer
from ..memberships.models import Membership

# Create your models here.

class Sale(models.Model):

    user = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, null=False, on_delete=models.CASCADE)
    cash_register = models.ForeignKey(CashRegister, null=False, on_delete=models.CASCADE)
    date = models.DateField(null=False, auto_now_add=True)
    observation = models.CharField(max_length=200, null=True, blank=True)
    total = models.DecimalField(max_digits=10, null=True, decimal_places=2)
    cash = models.DecimalField(max_digits=10, null=True, decimal_places=2)
    status_delete = models.BooleanField(default=False)

    class Meta():

        verbose_name = 'Sale'
        verbose_name_plural = 'Sales'
        db_table = 'Sale'
        ordering = ['id']

class SaleDetailsProduct(models.Model):

    sale = models.ForeignKey(Sale, null=False, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=False, on_delete=models.CASCADE)
    amount = models.IntegerField(null=False, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status_delete = models.BooleanField(default=False)

    class Meta():
        verbose_name = 'Sale Details Product'
        verbose_name_plural = 'Sales Details Products'
        db_table = 'SaleDetailsProduct'
        ordering = ['id']

class SaleDetailsMembership(models.Model):

    sale = models.ForeignKey(Sale, null=False, on_delete=models.CASCADE)
    membership = models.ForeignKey(Membership, null=False, on_delete=models.CASCADE)
    amount = models.IntegerField(null=False, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status_delete = models.BooleanField(default=False)

    class Meta():
        verbose_name = 'Sale Details Membership'
        verbose_name_plural = 'Sales Details Membership'
        db_table = 'SaleDetailsMembership'
        ordering = ['id']


