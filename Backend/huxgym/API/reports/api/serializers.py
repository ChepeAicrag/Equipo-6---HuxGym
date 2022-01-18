from django.db.models import fields
from rest_framework import serializers
from API.products.models import *

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