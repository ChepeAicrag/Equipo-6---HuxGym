from django.db.models import fields
from rest_framework import serializers
from API.products.models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name',instance.name)
        instance.description = validated_data.get('description',instance.description)
        instance.price_s = validated_data.get('price_s',instance.price_s)
        instance.price_c = validated_data.get('price_c',instance.price_c)
        instance.image = validated_data.get('image',instance.image)
        instance.category_id = validated_data.get('category_id',instance.category_id)
        instance.provider_id = validated_data.get('provider_id',instance.provider_id)
        instance.status_delete = validated_data.get('status_delete',instance.status_delete)
        instance.save()
        return instance


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        #fields = '__all__'
        exclude = ('status_delete',)

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "amount": instance.amount,
        "product_id": {
            "id": instance.product_id.id,
            "name": instance.product_id.name,
            "category_id": {
                "id": instance.product_id.category_id.id,
                "name": instance.product_id.category_id.name
            }
        }
    }

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        exclude = ('status_delete',)

class HistoryInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryInventory
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "date": instance.date,
        "amount": instance.amount,
        "product_id": {
            instance.product_id.id,
            instance.product_id.name
        },
        "operation_id": {
            instance.operation_id.id,
            #instance.operation_id.operationType_id.name,
            instance.operation_id.description,
        }
        }

class OperationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operation
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "amount": instance.amount,
        "description": instance.description,
        "operationType_id": {
            instance.operationType_id.id,
            instance.operationType_id.name
        }
    }

class OperationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperationType
        exclude = ('status_delete',)