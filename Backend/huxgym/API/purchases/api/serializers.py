from django.db.models import fields
from rest_framework import serializers
from API.purchases.models import *


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        exclude = ('status_delete',)

    def to_representation(self, instance):
        return {
                "id": instance.id,
                "date": instance.date,
                "observation": instance.observation,
                "total": instance.total,
                "user": {
                    "id": instance.user_id.id,
                    "name": instance.user_id.name
                },
                "cash_register": {
                    "id": instance.cashRegister_id.id, 
                    "cash_init": instance.cashRegister_id.cash_init,                
                    "cash_end": instance.cashRegister_id.cash_end,
                    "cambio": instance.cashRegister_id.cambio,
                }
            }

class PurchaseProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase_Details_Product
        exclude = ('status_delete',)

    def to_representation(self, instance):
        return {
                "id": instance.id,
                "amount": instance.amount,
                "total": instance.total,
                "purchase_id": instance.purchase_id.id,
                "product": {
                    "name": instance.product_id.name,
                    "description": instance.product_id.description,
                    "price_s": instance.product_id.price_s,
                    "price_c": instance.product_id.price_c,
                    "category": {
                        "id": instance.product_id.category_id.id,
                        "name": instance.product_id.category_id.name,
                },
                "provider": {
                    "id": instance.product_id.provider_id.id,
                    "name": instance.product_id.provider_id.name
                

            }
        }
        }

            