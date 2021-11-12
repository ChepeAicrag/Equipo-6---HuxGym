from datetime import date, datetime, timedelta
from typing import Type
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from API.general.authentication_middleware import Authentication
from .serializers import *
from API.customers.models import *
from rest_framework.permissions import AllowAny

#API PARA EL MODELO CUSTOMER

@api_view(['GET', 'POST'])
def customer_api_view(request):
   
    if  request.method == 'GET':
        customers = Customer.objects.all().filter(status_delete = False)
        customers_Membresias = customers.filter(membershipActivate = True)
        for i in customers_Membresias:
            membresia = Customer_Membership.objects.filter(customer_id = i.id).latest('id')
            if membresia.date_due  < (datetime.now()).date():
                membresia.valid = False
                membresia.save()
                i.membershipActivate = False
                i.save()

        customer_serializer = CustomerSerializer(customers, many = True)
        return Response(customer_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        customer_serializer = CustomerSerializer(data = request.data)
        if customer_serializer.is_valid():
            customer_serializer.save()
            return Response({'message': 'Cliente creado correctamente'}, status = status.HTTP_201_CREATED)
        return Response(customer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def customer_detail_api_view(request,pk=None):
    customer = Customer.objects.filter(id = pk, status_delete = False).first()

    if customer:

        if request.method == 'GET':
            membresia = Customer_Membership.objects.filter(customer_id = customer.id, status_delete=False).latest('id')
            if membresia.date_due  < (datetime.now()).date():
                membresia.valid = False
                membresia.save()
                customer.membershipActivate = False
                customer.save()
            customer_serializer = CustomerSerializer(customer)
            return Response(customer_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            customer_serializer = CustomerSerializer(customer,data = request.data)
            if customer_serializer.is_valid():
                customer_serializer.save()
                return Response({'message': 'Cliente actualizado correctamente'},  status = status.HTTP_200_OK)
            return Response(customer_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            if customer.membershipActivate == True:
                return Response({'message': 'No puedes eliminar a un cliente con membresía activa'}, status = status.HTTP_400_BAD_REQUEST)
            customer.status_delete = True
            customer.save()
            return Response({'message' : 'Cliente eliminado correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un usuario con estos datos'}, status = status.HTTP_400_BAD_REQUEST)



#API PARA EL MODELO ATTENDANCE

@api_view(['GET', 'POST'])
def attendance_api_view(request):

    if  request.method == 'GET':
        objetos = Attendance.objects.all()
        for i in objetos:
            #Verificación del status_value de customer
            if i.customer_id.status_delete == True and i.status_delete == False:
                i.status_delete = True
                i.save()
        attendance = objetos.all().filter(status_delete = False)
        attendance_serializer = AttendanceSerializer(attendance, many = True)
        return Response(attendance_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        
        attendanceAll = Attendance.objects.filter(customer_id = request.data['customer_id'])
        if attendanceAll:
            attendance = Attendance.objects.filter(customer_id = request.data['customer_id']).latest('id')
            if attendance.check_out == None:
                return Response({'message': 'No puedes hacer check in de un cliente que no ha hecho check out'}, status = status.HTTP_400_BAD_REQUEST)
             
        attendance_serializer = AttendanceSerializer(data = request.data)
        if attendance_serializer.is_valid():
            attendance_serializer.save()
            return Response({'message': 'Asistencia registrada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(attendance_serializer.errors, status = status.HTTP_400_BAD_REQUEST )


@api_view(['GET', 'PUT', 'DELETE'])
def attendance_detail_api_view(request,pk=None):
    attendance = Attendance.objects.filter(id = pk).first()

    if attendance:

        if attendance.customer_id.status_delete == True and attendance.status_delete == False:
            attendance.status_delete = True
            attendance.save()


        if attendance.status_delete == False:

            if request.method == 'GET':        
                attendance_serializer = AttendanceSerializer(attendance)
                return Response(attendance_serializer.data,  status = status.HTTP_200_OK)

            elif request.method == 'PUT':
                attendance_serializer = AttendanceSerializer(attendance,data = request.data)
                if attendance_serializer.is_valid():
                    attendance_serializer.save()
                    return Response({'message': 'Asistencia actualizada correctamente'},  status = status.HTTP_200_OK)
                return Response(attendance_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

            elif request.method == 'DELETE':
                attendance.status_delete = True
                attendance.save()
                return Response({'message': 'Registro eliminado correctamente'}, status = status.HTTP_400_BAD_REQUEST)
                #return Response({'message' : 'Situación nutricional eliminada correctamente'}, status = status.HTTP_200_OK)
            return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'No se ha encontrado una asistencia con estos datos'}, status = status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'No se ha encontrado un usuario con estos datos'}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'GET'])
def registrarCheckOut(request,id=None):
    attendanceAll = Attendance.objects.filter(customer_id = id)
    if attendanceAll:
        attendance = attendanceAll.filter(customer_id = id).latest('id')
        if attendance:

            if request.method == 'GET':
                attendance_serializer = AttendanceSerializer(attendance)
                return Response(attendance_serializer.data,  status = status.HTTP_200_OK)

            if request.method == 'PUT': 
                if attendance.check_out != None:
                    return Response({'message': 'El check out de este usuario ya se ha hecho!'},  status = status.HTTP_200_OK)    
                else:
                    attendance.check_out = timezone.now().strftime("%H:%M:%S")
                    attendance.save()
                    return Response({'message': 'Asistencia actualizada correctamente'},  status = status.HTTP_200_OK)
    return Response({'message':'No se encontró la asistencia del usuario'},status = status.HTTP_400_BAD_REQUEST )

@api_view(['GET'])
def clientesActuales(request):
    actuales = Attendance.objects.all().filter(check_out = None, status_delete = False)

    if request.method == 'GET':
            attendance_serializer = AttendanceSerializer(actuales, many = True)
            return Response(attendance_serializer.data,  status = status.HTTP_200_OK)



#API PARA EL MODELO NutritionalSituation

@api_view(['GET', 'POST'])
def nutritionalSituation_api_view(request):

    if  request.method == 'GET':
        nutritionalSituation = NutritionalSituation.objects.all().filter(status_delete = False)
        nutritionalSituation_serializer = NutritionalSituationSerializer(nutritionalSituation, many = True)
        return Response(nutritionalSituation_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        nutritionalSituation_serializer = NutritionalSituationSerializer(data = request.data)
        if nutritionalSituation_serializer.is_valid():
            nutritionalSituation_serializer.save()
            return Response(nutritionalSituation_serializer.data, status = status.HTTP_201_CREATED)
        return Response(nutritionalSituation_serializer.errors, status = status.HTTP_400_BAD_REQUEST )


@api_view(['GET', 'PUT', 'DELETE'])
def nutritionalSituation_detail_api_view(request,pk=None):
    nutritionalSituation = NutritionalSituation.objects.filter(id = pk, status_delete = False).first()

    if nutritionalSituation:

        if request.method == 'GET':
            nutritionalSituation_serializer = NutritionalSituationSerializer(nutritionalSituation)
            return Response(nutritionalSituation_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            nutritionalSituation_serializer = NutritionalSituationSerializer(nutritionalSituation,data = request.data)
            if nutritionalSituation_serializer.is_valid():
                nutritionalSituation_serializer.save()


                return Response({'message': 'Situación nutricional actualizada correctamente'},  status = status.HTTP_200_OK)
            return Response(nutritionalSituation_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            nutritionalSituation.status_delete = True
            nutritionalSituation.save()
            return Response({'message' : 'Situación nutricional eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)

#API PARA EL MODELO TypeExtraInformation

@api_view(['GET', 'POST'])
def typeExtraInformation_api_view(request):

    if  request.method == 'GET':
        typeExtraInformation = TypeExtraInformation.objects.all().filter(status_delete = False)
        typeExtraInformation_serializer = TypeExtraInformationSerializer(typeExtraInformation, many = True)
        return Response(typeExtraInformation_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        typeExtraInformation_serializer = TypeExtraInformationSerializer(data = request.data)
        if typeExtraInformation_serializer.is_valid():
            typeExtraInformation_serializer.save()
            return Response({'message': 'Información extra registrada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(typeExtraInformation_serializer.errors, status = status.HTTP_400_BAD_REQUEST )


@api_view(['GET', 'PUT', 'DELETE'])
def typeExtraInformation_detail_api_view(request,pk=None):
    typeExtraInformation = TypeExtraInformation.objects.filter(id = pk,status_delete = False).first()

    if typeExtraInformation:

        if request.method == 'GET':
            typeExtraInformation_serializer = TypeExtraInformationSerializer(typeExtraInformation)
            return Response(typeExtraInformation_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            typeExtraInformation_serializer = TypeExtraInformationSerializer(typeExtraInformation,data = request.data)
            if typeExtraInformation_serializer.is_valid():
                typeExtraInformation_serializer.save()
                return Response({'message': 'Información extra actualizada correctamente'},  status = status.HTTP_200_OK)
            return Response(typeExtraInformation_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            typeExtraInformation.status_delete = True
            typeExtraInformation.save()

            registros_typeExtraInformation_HistoryClinic = TypeExtraInformation_HistoryClinic.objects.filter(typeExtraInformation_id = typeExtraInformation.id)
            for i in registros_typeExtraInformation_HistoryClinic:
                i.status_delete = True
                i.save()

            registros_typeExtraInformation_HistoryClinic = TypeExtraInformation_HistoryClinic.objects.filter(typeExtraInformation_id = typeExtraInformation.id)
            for i in registros_typeExtraInformation_HistoryClinic:
                i.status_delete = True
                i.save()
            return Response({'message' : 'Información extra eliminada correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)


#API PARA EL MODELO BodyAttribute

@api_view(['GET', 'POST'])
def bodyAttribute_api_view(request):

    if  request.method == 'GET':
        bodyAttribute = BodyAttribute.objects.all().filter(status_delete = False)
        bodyAttribute_serializer = BodyAttributeSerializer(bodyAttribute, many = True)
        return Response(bodyAttribute_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        bodyAttribute_serializer = BodyAttributeSerializer(data = request.data)
        if bodyAttribute_serializer.is_valid():
            bodyAttribute_serializer.save()
            return Response({'message': 'Atributo de cuerpo registrada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(bodyAttribute_serializer.errors, status = status.HTTP_400_BAD_REQUEST )


@api_view(['GET', 'PUT', 'DELETE'])
def bodyAttribute_detail_api_view(request,pk=None):
    bodyAttribute = BodyAttribute.objects.filter(id = pk, status_delete = False).first()

    if bodyAttribute:

        if request.method == 'GET':
            bodyAttribute_serializer = BodyAttributeSerializer(bodyAttribute)
            return Response(bodyAttribute_serializer.data,  status = status.HTTP_200_OK)

        elif request.method == 'PUT':
            bodyAttribute_serializer = BodyAttributeSerializer(bodyAttribute,data = request.data)
            if bodyAttribute_serializer.is_valid():
                bodyAttribute_serializer.save()
                return Response({'message': 'Atributo de cuerpo actualizado correctamente'},  status = status.HTTP_200_OK)
            return Response(bodyAttribute_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

        elif request.method == 'DELETE':
            bodyAttribute.status_delete = True
            bodyAttribute.save()

            return Response({'message' : 'Atributo de cuerpo eliminado correctamente'}, status = status.HTTP_200_OK)
    
    return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)


#API PARA EL MODELO HistoryClinic

@api_view(['GET', 'POST'])
def historyClinic_api_view(request):

    if  request.method == 'GET':
        objetos = HistoryClinic.objects.all()
        for i in objetos:
            #Verificación del status_value de customer
            if i.customer_id.status_delete == True and i.status_delete == False:
                i.status_delete = True
                i.save()
        for i in objetos:
            #Verificación del status_value de NutritionalSituation
            if i.nutritionalSituation_id != None:
                if i.nutritionalSituation_id.status_delete == True and i.nutritionalSituation_id != None:
                    i.nutritionalSituation_id = None
                    i.save()
        historyClinic = objetos.all().filter(status_delete = False)
        historyClinic_serializer = HistoryClinicSerializer(historyClinic, many = True)
        return Response(historyClinic_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        historyClinic_serializer = HistoryClinicSerializer(data = request.data)
        if historyClinic_serializer.is_valid():
            historyClinic_serializer.save()
            return Response(historyClinic_serializer.data, status = status.HTTP_201_CREATED)
        return Response(historyClinic_serializer.errors, status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def historyClinic_detail_api_view(request,pk=None):
    historyClinic = HistoryClinic.objects.all().filter(id = pk).first()
    if historyClinic:
        if historyClinic.customer_id.status_delete == True and historyClinic.status_delete == False:
            historyClinic.status_delete = True
            historyClinic.save()

        if historyClinic.nutritionalSituation_id != None:
            if historyClinic.nutritionalSituation_id.status_delete == True and historyClinic.nutritionalSituation_id != None:
                historyClinic.nutritionalSituation_id = None
                historyClinic.save()

        if historyClinic.status_delete == False:

            if request.method == 'GET':
                historyClinic_serializer = HistoryClinicSerializer(historyClinic)
                return Response(historyClinic_serializer.data,  status = status.HTTP_200_OK)

            elif request.method == 'PUT':
                #Validación para editar solo el historial clínico más reciente
                objetos = HistoryClinic.objects.all().filter(customer_id = historyClinic.customer_id.id)
                if objetos:
                    historyClinicTemp = objetos.all().latest('id')
                    if historyClinicTemp.id != historyClinic.id:
                        return Response({'message' : 'Solo puedes editar el historial clínico más reciente del cliente más reciente'}, status = status.HTTP_400_BAD_REQUEST)
                
                if historyClinic.customer_id.membershipActivate == True:
                    historyClinic_serializer = HistoryClinicSerializer(historyClinic,data = request.data)
                    if historyClinic_serializer.is_valid():
                        historyClinic_serializer.save()
                        return Response({'message': 'Historial clínico actualizado correctamente'},  status = status.HTTP_200_OK)
                    return Response(historyClinic_serializer.errors,status = status.HTTP_400_BAD_REQUEST )
                return Response({'message': 'El cliente debe tener una membresía activa para poder editar su historial clínico'},status = status.HTTP_400_BAD_REQUEST )

            elif request.method == 'DELETE':
                objetos = HistoryClinic.objects.all().filter(customer_id = historyClinic.customer_id.id)
                if objetos:
                    historyClinicTemp = objetos.all().latest('id')
                    if historyClinicTemp.id == historyClinic.id:
                        return Response({'message' : 'No puedes eliminar el historial de usuario más reciente'}, status = status.HTTP_400_BAD_REQUEST)
                historyClinic.status_delete = True
                historyClinic.save()
                return Response({'message' : 'Historial clínico eliminado correctamente'}, status = status.HTTP_200_OK)
        
        return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)

#API PARA OBTENER TODAS LAS HOJAS CLÍNICAS DE UN CLIENTE
@api_view(['GET'])
def historiasClinicasCliente(request, pk = None):

    if  request.method == 'GET':
        cliente = Customer.objects.all().filter(status_delete = False, id = pk).first()
        if cliente:
            hojasClinicas = HistoryClinic.objects.all().filter(customer_id = pk, status_delete = False)
            historyClinic_serializer = HistoryClinicSerializer(hojasClinicas, many = True)
            return Response(historyClinic_serializer.data, status = status.HTTP_200_OK)
        return Response({'message': 'El cliente no existe'}, status = status.HTTP_400_BAD_REQUEST)



#API PARA EL MODELO TypeExtraInformation_HistoryClinic
@api_view(['GET', 'POST'])
def typeExtraInformation_HistoryClinic_api_view(request):

    if  request.method == 'GET':
        objetos = TypeExtraInformation_HistoryClinic.objects.all()
        for i in objetos:
            if (i.historyClinic_id.status_delete == True or i.typeExtraInformation_id.status_delete == True) and i.status_delete == False:
                i.status_delete = True
                i.save()
        typeExtraInformation_HistoryClinic = objetos.all().filter(status_delete = False)
        typeExtraInformation_HistoryClinic_serializer = TypeExtraInformation_HistoryClinicSerializer(typeExtraInformation_HistoryClinic, many = True)
        return Response(typeExtraInformation_HistoryClinic_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        typeExtraInformation_HistoryClinic_serializer = TypeExtraInformation_HistoryClinicSerializer(data = request.data)
        if typeExtraInformation_HistoryClinic_serializer.is_valid():
            typeExtraInformation_HistoryClinic_serializer.save()
            return Response({'message': 'Relación registrada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(typeExtraInformation_HistoryClinic_serializer.errors, status = status.HTTP_400_BAD_REQUEST )


@api_view(['GET', 'PUT', 'DELETE'])
def typeExtraInformation_HistoryClinic_detail_api_view(request,pk=None):
    i = TypeExtraInformation_HistoryClinic.objects.filter(id = pk).first()
    
    if i:
        if (i.historyClinic_id.status_delete == True or i.typeExtraInformation_id.status_delete == True) and i.status_delete == False:
            i.status_delete = True
            i.save()

        if i.status_delete == False:

            if request.method == 'GET':
                typeExtraInformation_HistoryClinic_serializer = TypeExtraInformation_HistoryClinicSerializer(i)
                return Response(typeExtraInformation_HistoryClinic_serializer.data,  status = status.HTTP_200_OK)

            elif request.method == 'PUT':
                typeExtraInformation_HistoryClinic_serializer = TypeExtraInformation_HistoryClinicSerializer(i,data = request.data)
                if typeExtraInformation_HistoryClinic_serializer.is_valid():
                    typeExtraInformation_HistoryClinic_serializer.save()
                    return Response({'message': 'Relación actualizada correctamente'},  status = status.HTTP_200_OK)
                return Response(typeExtraInformation_HistoryClinic_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

            elif request.method == 'DELETE':
                i.status_delete = True
                i.save()
                return Response({'message' : 'Relación eliminada correctamente'}, status = status.HTTP_200_OK)
        
        return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)
#API PARA EL MODELO BodyAttribute_HistoryClinic

@api_view(['GET', 'POST'])
def bodyAttribute_HistoryClinic_api_view(request):

    if  request.method == 'GET':
        objetos = BodyAttribute_HistoryClinic.objects.all()
        for i in objetos:
            if (i.historyClinic_id.status_delete == True or i.bodyAttribute_id.status_delete == True) and i.status_delete == False:
                i.status_delete = True
                i.save()
        bodyAttribute_HistoryClinic = objetos.all().filter(status_delete = False)
        bodyAttribute_HistoryClinic_serializer = BodyAttribute_HistoryClinicSerializer(bodyAttribute_HistoryClinic, many = True)
        return Response(bodyAttribute_HistoryClinic_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        bodyAttribute_HistoryClinic_serializer = BodyAttribute_HistoryClinicSerializer(data = request.data)
        if bodyAttribute_HistoryClinic_serializer.is_valid():
            bodyAttribute_HistoryClinic_serializer.save()
            return Response({'message': 'Relación registrada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(bodyAttribute_HistoryClinic_serializer.errors, status = status.HTTP_400_BAD_REQUEST )


@api_view(['GET', 'PUT', 'DELETE'])
def bodyAttribute_HistoryClinic_detail_api_view(request,pk=None):
    i = BodyAttribute_HistoryClinic.objects.filter(id = pk).first()
    if i:
        if (i.historyClinic_id.status_delete == True or i.bodyAttribute_id.status_delete == True) and i.status_delete == False:
            i.status_delete = True
            i.save()

        if i.status_delete == False:

            if request.method == 'GET':
                bodyAttribute_HistoryClinic_serializer = BodyAttribute_HistoryClinicSerializer(i)
                return Response(bodyAttribute_HistoryClinic_serializer.data,  status = status.HTTP_200_OK)

            elif request.method == 'PUT':
                bodyAttribute_HistoryClinic_serializer = BodyAttribute_HistoryClinicSerializer(i,data = request.data)
                if bodyAttribute_HistoryClinic_serializer.is_valid():
                    bodyAttribute_HistoryClinic_serializer.save()
                    return Response({'message': 'Relación actualizada actualizado correctamente'},  status = status.HTTP_200_OK)
                return Response(bodyAttribute_HistoryClinic_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

            elif request.method == 'DELETE':
                i.status_delete = True
                i.save()
                return Response({'message' : 'Relación eliminado correctamente'}, status = status.HTTP_200_OK)
        
        return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def obtenerAtributosDeCuerpo(request, pk = None):

    if  request.method == 'GET':
        atributos = BodyAttribute_HistoryClinic.objects.all().filter(historyClinic_id = pk)
        bodyAttribute_HistoryClinic_serializer = BodyAttribute_HistoryClinicSerializer(atributos, many = True)
        return Response(bodyAttribute_HistoryClinic_serializer.data, status = status.HTTP_200_OK)


@api_view(['GET'])
def obtenerInformaciónExtra(request, pk = None):

    if  request.method == 'GET':
        typeExtra = TypeExtraInformation_HistoryClinic.objects.all().filter(historyClinic_id = pk)
        typeExtraInformation_HistoryClinic_serializer = TypeExtraInformation_HistoryClinicSerializer(typeExtra, many = True)
        return Response(typeExtraInformation_HistoryClinic_serializer.data, status = status.HTTP_200_OK)


#API PARA EL MODELO Customer_Membership
@api_view(['GET', 'POST'])
def customer_membership_api_view(request):

    if  request.method == 'GET':
        objetos = Customer_Membership.objects.all()

        '''for i in objetos:
            if (i.customer_id.status_delete == True or i.membership_id.status_delete == True) and i.status_delete == False:
                i.status_delete = True
                i.save()
            if i.date_due  < (datetime.now()).date():
                i.valid = False
                i.save()
                cliente = Customer.objects.filter(id = i.customer_id.id).latest('id')
                cliente.membershipActivate = False
                cliente.save()
            if i.valid == True and i.customer_id.membershipActivate == False:
                cliente = Customer.objects.all().filter(id = i.customer_id.id).latest('id')
                cliente.membershipActivate = True
                cliente.save()'''
                
        customer_membership = objetos.all().filter(status_delete = False)
        customer_membership_serializer = Customer_MembershipSerializer(customer_membership, many = True)
        return Response(customer_membership_serializer.data, status = status.HTTP_200_OK)

    elif request.method == 'POST':
        objetos = Customer_Membership.objects.all().filter(customer_id = request.data['customer_id'])
        if objetos:
            customer_membership = objetos.all().filter().latest('id')
            if customer_membership.valid == True:
                return Response({'message': 'El cliente ya tiene una membresía vigente'}, status = status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        membresia = Membership.objects.filter(id = data['membership_id'], status_delete = False).first()
        data['date_due'] = (datetime.now()).date() + timedelta(days=membresia.day)
        customer_membership_serializer = Customer_MembershipSerializer(data = data)
        if customer_membership_serializer.is_valid():
            cliente = Customer.objects.filter(id = request.data['customer_id']).latest('id')
            cliente.membershipActivate = True
            cliente.save()
            customer_membership_serializer.save()
            return Response({'message': 'Membresía registrada correctamente'}, status = status.HTTP_201_CREATED)
        return Response(customer_membership_serializer.errors, status = status.HTTP_400_BAD_REQUEST )


@api_view(['GET', 'PUT', 'DELETE'])
def customer_membership_detail_api_view(request,pk=None):
    i = Customer_Membership.objects.filter(id = pk).first()

    if i:
        if (i.customer_id.status_delete == True or i.membership_id.status_delete == True) and i.status_delete == False:
            i.status_delete = True
            i.save()

        if i.status_delete == False:

            if request.method == 'GET':
                customer_membership_serializer = Customer_MembershipSerializer(i)
                return Response(customer_membership_serializer.data,  status = status.HTTP_200_OK)

            elif request.method == 'PUT':
                customer_membership_serializer = Customer_MembershipSerializer(i,data = request.data)
                if customer_membership_serializer.is_valid():
                    customer_membership_serializer.save()
                    return Response({'message': 'Relación actualizada actualizado correctamente'},  status = status.HTTP_200_OK)
                return Response(customer_membership_serializer.errors,status = status.HTTP_400_BAD_REQUEST )

            elif request.method == 'DELETE':
                i.valid = False
                i.status_delete = True
                i.save()
                cliente = Customer.objects.all().filter(id = i.customer_id.id).latest('id')
                cliente.membershipActivate = False
                cliente.save()
                return Response({'message' : 'Relación eliminada correctamente'}, status = status.HTTP_200_OK)
        
        return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'No se ha encontrado un registro con esos datos'}, status = status.HTTP_400_BAD_REQUEST)
