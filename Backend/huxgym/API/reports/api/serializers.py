from django.db.models import fields
from rest_framework import serializers
from API.products.models import *
from API.sales.models import *

class ProductReportSerializer(serializers.ModelSerializer):
    total = 0
    class Meta:
        model = Product
        exclude = ('status_delete', 'image', 'description', 'price_s', 'price_c',)

    def to_representation(self, instance):
       return {
            "id": instance.id,
            "name": instance.name,
            "total": self.total,
            "category": {
                "id": instance.category_id.id, 
                "name": instance.category_id.name,                
            },
            "provider": {
                "id": instance.provider_id.id, 
                "name": instance.provider_id.name,               
            },
       }

class DetailsReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleDetailsProduct

    def to_representation(self, instance):
       return {
            "id": instance.id,
            "product": instance.product.name,
            "price": instance.product.price_s,
            "amount": instance.amount,
            "total": instance.total
       }

class SaleReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

    def to_representation(self, instance):
       cambio = instance.cash - instance.total 
       return {
            "id": instance.id,
            "user": instance.user.name,
            "customer": instance.customer.name,
            "date": instance.date,
            "observation": instance.observation,
            "total": instance.total,
            "cash": instance.cash,
            "cambio": cambio    
       }

class DetailsMemReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleDetailsMembership

    def to_representation(self, instance):
       return {
            "id": instance.id,
            "product": 'Membresía ' + instance.membership.name,
            "price": instance.membership.price,
            "amount": instance.amount,
            "total": instance.total
       }