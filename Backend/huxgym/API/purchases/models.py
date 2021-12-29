from django.db import models
from API.products.models import Product
from API.users.models import CashRegister, User
# Create your models here.


class Purchase(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
    observation = models.TextField(max_length=100, null=True, blank=True)
    total = models.FloatField(null=False, blank=False)
    status_delete = models.BooleanField(default=False)

    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    cashRegister_id = models.ForeignKey(CashRegister, on_delete=models.CASCADE)
    product = models.ManyToManyField(Product, through='Purchase_Details_Product')

    class Meta:
        verbose_name = 'Purchase'
        verbose_name_plural = 'Purchases'
        db_table = 'purchase'
        ordering = ['id']

class Purchase_Details_Product(models.Model):
    id = models.AutoField(primary_key=True)
    amount = models.PositiveBigIntegerField(null=False, blank=False)
    total = models.PositiveBigIntegerField(null=False, blank=False)
    status_delete = models.BooleanField(default=False)

    purchase_id = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    product_id =models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Purchase_Details_Product'
        verbose_name_plural = 'Purchase_Details_Product'
        db_table = 'PurchaseProduct'
        ordering = ['id']

    def __str__(self):
        return self.product_id.name + " / Comprados: " + str(self.amount) + " / Pago: " + str(self.total)