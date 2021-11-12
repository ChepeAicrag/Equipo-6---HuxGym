from django.db.models import fields
from rest_framework import serializers
from rest_framework.views import exception_handler
from API.customers.models import *

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        #fields = '__all__'
        exclude = ('status_delete',)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name',instance.name)
        instance.gender = validated_data.get('gender',instance.gender)
        instance.phone = validated_data.get('phone',instance.phone)
        instance.image = validated_data.get('image',instance.image)
        instance.membershipActivate = validated_data.get('membershipActivate',instance.membershipActivate)
        instance.isStudiant = validated_data.get('isStudiant',instance.isStudiant)
        instance.dateJoined = validated_data.get('dateJoined',instance.dateJoined)
        instance.status_delete = validated_data.get('status_delete',instance.status_delete)
        instance.save()
        return instance

class AttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "date": instance.date,
        "check_in": instance.check_in,
        "check_out": instance.check_out,
        "customer_id": {
            "id":instance.customer_id.id,
            "name":instance.customer_id.name
            }
        }
    

class NutritionalSituationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionalSituation
        fields = '__all__'

class TypeExtraInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeExtraInformation
        fields = '__all__'
    
    def to_representation(self, instance):
        return {
        "id": instance.id,
        "name": instance.name,
        "description": instance.description,
    }

class BodyAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BodyAttribute
        fields = '__all__'

    def to_representation(self, instance):
        return  {
        "id": instance.id,
        "name": instance.name,
        "description": instance.description,
        }

class HistoryClinicSerializer(serializers.ModelSerializer):

    class Meta:
        model = HistoryClinic
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "date": instance.date,
        "age": instance.age,
        "weigth": instance.weigth,
        "heigh": instance.heigh,
        "bloodType": instance.bloodType,
        "customer_id": {
            "id":instance.customer_id.id,
            "name":instance.customer_id.name,
            "gender":instance.customer_id.gender,
            "membershipActivate": instance.customer_id.membershipActivate
        },
        "nutritionalSituation_id": {
            "id": instance.nutritionalSituation_id.id if instance.nutritionalSituation_id != None else 'No tiene situación nutrimental asociada',
            "hour_breakfast": instance.nutritionalSituation_id.hour_breakfast if instance.nutritionalSituation_id != None else 'Sin hora de desayuno asignado',
            "hour_collation": instance.nutritionalSituation_id.hour_collation if instance.nutritionalSituation_id != None else 'Sin hora de almuerzo asignado',
            "hour_lunch": instance.nutritionalSituation_id.hour_lunch if instance.nutritionalSituation_id != None else 'Sin hora de colación asignada',
            "hour_snack": instance.nutritionalSituation_id.hour_snack if instance.nutritionalSituation_id != None else 'Sin hora de comida asignada',
            "hour_dinner": instance.nutritionalSituation_id.hour_dinner if instance.nutritionalSituation_id != None else 'Sin hora de cena asignada',
            "schedule": instance.nutritionalSituation_id.schedule if instance.nutritionalSituation_id != None else 'Sin planeación asignada'
        } 


    }

class TypeExtraInformation_HistoryClinicSerializer(serializers.ModelSerializer):

    class Meta:
        model = TypeExtraInformation_HistoryClinic
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "name": instance.name,
        "value": instance.value,
        "typeExtraInformation_id": {
            "id": instance.typeExtraInformation_id.id,
            "name": instance.typeExtraInformation_id.name,
            "description": instance.typeExtraInformation_id.description,
            },
        "historyClinic_id":{
            "id": instance.historyClinic_id.id,
            "date": instance.historyClinic_id.date,
            "age": instance.historyClinic_id.age,
            "weigth": instance.historyClinic_id.weigth,
            "heigh": instance.historyClinic_id.heigh,
            "bloodType": instance.historyClinic_id.bloodType,
            "customer_id": {
                "id":instance.historyClinic_id.customer_id.id,
                "name":instance.historyClinic_id.customer_id.name,
                "gender":instance.historyClinic_id.customer_id.gender,
            }
        }
    }

class BodyAttribute_HistoryClinicSerializer(serializers.ModelSerializer):

    class Meta:
        model = BodyAttribute_HistoryClinic
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "value": instance.value,
        "bodyAttribute_id": {
            "id": instance.bodyAttribute_id.id,
            "name": instance.bodyAttribute_id.name,
            "description": instance.bodyAttribute_id.description,
        },
        "historyClinic_id": {
            "id": instance.historyClinic_id.id,
            "date": instance.historyClinic_id.date,
            "age": instance.historyClinic_id.age,
            "weigth": instance.historyClinic_id.weigth,
            "heigh": instance.historyClinic_id.heigh,
            "bloodType": instance.historyClinic_id.bloodType,
            "customer_id": {
                "id":instance.historyClinic_id.customer_id.id,
                "name":instance.historyClinic_id.customer_id.name,
                "gender":instance.historyClinic_id.customer_id.gender,
            }
        }
    }

class Customer_MembershipSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer_Membership
        fields = '__all__'

    def to_representation(self, instance):
        return {
        "id": instance.id,
        "date_register": instance.date_register,
        "date_due": instance.date_due,
        "valid": instance.valid,
        "membership_id": {
            "id": instance.membership_id.id,
            "name": instance.membership_id.name
        },
        "customer_id": {
            "id": instance.customer_id.id,
            "name": instance.customer_id.name,
            "membershipActivate": instance.customer_id.membershipActivate
        }
    }
