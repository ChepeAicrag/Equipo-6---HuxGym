from datetime import date, datetime
from typing import Type
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view

from .serializers import *
from API.customers.models import Customer_Membership
from API.memberships.models import *

#API  PARA EL MODELO MEMBERSHIPS

@api_view(['GET', 'POST'])
def membership_api_view(request):

    if  request.method == 'GET':
        membership = Membership.objects.all().filter(status_delete = False)
        membership_serializer = MembershipSerializer(membership, many = True)
        return Response(membership_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        objetos = Membership.objects.all().filter(status_delete = False)
        name = request.data.get('name', None)
        if name is None:
            return Response({'message': 'El nombre de la membresia es requerido'},status = status.HTTP_400_BAD_REQUEST )
        for i in objetos:
            if i.name.upper() == request.data['name'].upper():
                return Response({'message': 'Ya existe una membresía con ese nombre'},status = status.HTTP_400_BAD_REQUEST )
        membership_serializer = MembershipSerializer(data = request.data)
        if membership_serializer.is_valid():
            membership_serializer.save()
            return Response({'message': 'Membresía creada correctamente'}, status = status.HTTP_201_CREATED)
        errors = []
        for k in membership_serializer.errors.keys():
            errors.append(f'El campo \'{k}\'{membership_serializer.errors.get(k)[0].lower().replace("este campo", "")}')
        return Response({'message': errors}, status= status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def membership_detail_api_view(request,pk=None):
    membership = Membership.objects.filter(id = pk, status_delete = False).first()

    if membership:

        if request.method == 'GET':
            membership_serializer = MembershipSerializer(membership)
            return Response(membership_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            objetos = Membership.objects.all().filter(status_delete = False)
            for i in objetos:
                if i.name.upper() == request.data['name'].upper() and i.id != pk:
                    return Response({'message': 'Ya existe una membresía con ese nombre'},status = status.HTTP_400_BAD_REQUEST )

            membership_serializer = MembershipSerializer(membership,data = request.data)
            if membership_serializer.is_valid():
                membership_serializer.save()
                return Response({'message': 'Membresía actualizada correctamente'},  status = status.HTTP_200_OK)
            return Response(membership_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            clientes = Customer_Membership.objects.all().filter(membership_id = membership.id, valid = True)
            if clientes:
                return Response({'message': 'Hay clientes que tienen esta membresía, no la puedes eliminar'}, status = status.HTTP_400_BAD_REQUEST)
            else:
                membership.status_delete = True
                membership.save()
                return Response({'message' : 'Membresía eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado ninguna membresía con estos datos'}, status = status.HTTP_400_BAD_REQUEST)
