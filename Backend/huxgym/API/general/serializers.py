from rest_framework import serializers

from .models import Role, RoleModule

class RoleModuleSerialzier(serializers.ModelSerializer):

    class Meta:
        model = RoleModule
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Role
        fields = '__all__'

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "name": instance.name,
            "isSuperAdmin": instance.isSuperAdmin,
            "description": instance.description,
            "modules": instance.module.all(),
        }