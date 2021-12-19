from django.db.models import fields
from rest_framework import serializers
from rest_framework.views import exception_handler
from API.memberships.models import *

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        #fields = '__all__'
        exclude = ('status_delete',)