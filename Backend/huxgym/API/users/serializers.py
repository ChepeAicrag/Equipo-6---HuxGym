from drf_base64.serializers import ModelSerializer

from API.general.utils import calculate_age
from .models import User, AttendanceHorary, CashRegister


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        exclude = ('user_permissions', )
        extra_kwargs = {
            'password': {'write_only': True},
            'token': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(
            name=validated_data['name'],
            age = calculate_age(validated_data['birthdate']),
            email=validated_data['email'],
            gender=validated_data['gender'],
            role=validated_data['role'],
            paternal_surname=validated_data['paternal_surname'],
            mothers_maiden_name=validated_data['mothers_maiden_name'],
            birthdate=validated_data['birthdate'],
            entity_birth=validated_data['entity_birth'],
            curp=validated_data['curp'],
            phone=validated_data['phone']
        )
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.phone = validated_data.get('phone', instance.phone)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance


class UserListSerializer(ModelSerializer):

    class Meta:
        model = User
        exclude = ('is_staff', 'status_delete', 'is_active',
                   'is_superuser', 'password', 'token', 'user_permissions', 'groups')
    """
    def to_representation(self, instance):
        return {
           "id": instance.id,
           "name": instance.name,
           "age": instance.age,
           "email": instance.email,
           "phone": instance.phone,
           "image": instance.image,
           "gender": instance.gender,
           "role": {
               "id": instance.role.id,
               "name": instance.role.name,
           }
        }
    """


class UserTokenSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'image', 'role', 'name', 'paternal_surname', 'mothers_maiden_name', 'birthdate', 'entity_birth', 'curp', 'age']


class AttendanceHorarySerializer(ModelSerializer):

    class Meta:
        model = AttendanceHorary
        exclude = ('status_delete', )


class CashRegisterSerializer(ModelSerializer):
    class Meta:
        model = CashRegister
        exclude = ('status_delete', )
        # extra_kwargs = {
        #     'cash_init': {'read_only': True},
        #     'cash_end': {'read_only': True},
        #     'amount_sell': {'read_only': True},
        #     'amount_purchase': {'read_only': True},
        #     'amount_total': {'write_only': True},
        # }

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "date": instance.date,
            "folio": instance.folio,
            "observations": instance.observations or 'Sin observaciones',
            "cash_init": instance.cash_init,
            "cash_end": instance.cash_end,
            "amount_sell": instance.amount_sell,
            "amount_purchase": instance.amount_purchase,
            "amount_total": instance.amount_total,
            "cambio": instance.cambio,
            "user": {
                "id": instance.user.id,
                "name": instance.user.name,
            }
        }

