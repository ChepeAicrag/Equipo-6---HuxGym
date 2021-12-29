from rest_framework import serializers
from .models import Sale, SaleDetailsProduct, SaleDetailsMembership

class SaleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sale
        exclude = ('status_delete', )
        
    def to_representation(self, instance):
       return {
            "id": instance.id,
            "date": instance.date,
            "observation": instance.observation or 'Sin observacion',
            "total": instance.total,
            "cash": instance.cash,
            "user": {
                "id": instance.user.id, 
                "name": instance.user.name,                
            },
            "customer": {
                "id": instance.customer.id, 
                "name": instance.customer.name,                
            },
            "cash_register": {
                "id": instance.cash_register.id, 
                "cash_init": instance.cash_register.cash_init,                
                "cash_end": instance.cash_register.cash_end,                
            },
       }
       
    def update(self, instance, validated_data):
        instance.observation = validated_data.get('observation', instance.observation)
        instance.save()
        return instance
        
class SaleDetailsProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = SaleDetailsProduct
        exclude = ('status_delete', )

    def to_representation(self, instance):
        return {
            "amount": instance.amount,
            "total": instance.total,
            "product": {
                "name": instance.product.name,
                "description": instance.product.description,
                "price_s": instance.product.price_s,
                "category": {
                    "id": instance.product.category_id.id,
                    "name": instance.product.category_id.name,
                },
                "provider": {
                    "id": instance.product.provider_id.id,
                    "name": instance.product.provider_id.name,
                }
            },
        }

class SaleDetailsMembershipSerializer(serializers.ModelSerializer):

    class Meta:
        model = SaleDetailsMembership
        exclude = ('status_delete', )
    
    def to_representation(self, instance):
        return {
            "amount": instance.amount,
            "total": instance.total,
            "membership": {
                "id": instance.membership.id,
                "name": instance.membership.name,
                "price": instance.membership.price,
                "description": instance.membership.description,
            },
        }