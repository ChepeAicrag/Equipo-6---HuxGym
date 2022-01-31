from django.utils.crypto import get_random_string
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from random import randint
from datetime import date, datetime, time
from decouple import config 

from API.general.token_generator import account_activation_token
from API.general.authentication_middleware import Authentication
from API.general.utils import validate_data_curp
from API.sales.models import Sale, SaleDetailsMembership, SaleDetailsProduct
from API.sales.serializers import SaleDetailsMembershipSerializer, SaleDetailsProductSerializer, SaleSerializer
from API.purchases.models import Purchase, Purchase_Details_Product
from API.purchases.api.serializers import PurchaseProductSerializer, PurchaseSerializer
from .models import  User, AttendanceHorary, CashRegister
from .serializers import  UserSerializer, UserListSerializer, AttendanceHorarySerializer, CashRegisterSerializer
from ..general.api import  API 

class CrearListarUser(Authentication, APIView):

    permission_classes = (AllowAny, )

    def get(self, request):
        users = User.objects.all().filter(is_active=True, status_delete=False, is_superuser=False)
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        role = data.get('role', None)
        if role is None:
            return Response({ 'message': 'El rol es requerido' }, status=status.HTTP_400_BAD_REQUEST)
        if int(role) == 1:
            return Response({ 'message': 'No puede crear un usuario con este rol' }, status=status.HTTP_400_BAD_REQUEST)
        payload = {
            "paternal_surname": data.get('paternal_surname', None),
            "mothers_maiden_name": data.get('mothers_maiden_name', None),
            "names": data.get('name', None),
            "entity_birth": data.get('entity_birth', None),
            "birthdate": data.get('birthdate', None),
            "sex": data.get('gender', None),
            "curp": data.get('curp', None)
        }
        if payload["curp"] is None:
            return Response({ 'message': 'La curp es requerida' }, status=status.HTTP_400_BAD_REQUEST)
        """
        response_api, error = API().validate_curp(payload["curp"])
        if(error):
            return Response({ 'message': response_api }, status=status.HTTP_400_BAD_REQUEST)
        validate, msg = validate_data_curp(payload, response_api)
        if not validate:
            return Response({ 'message': msg }, status=status.HTTP_400_BAD_REQUEST)
        """
        data['role'] = int(role)
        data['password'] = get_random_string(randint(8, 15)).strip()
        user = User.objects.filter(email=request.data['email']).first()
        url = config('URL_ACTIVATE')
        if user:
            if user.is_active and not user.status_delete:
                return Response({ 'message': 'Ya existe un usuario con ese correo' }, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.filter(curp=request.data['curp']).first()
            if user and user.is_active and not user.status_delete:
                return Response({ 'message': 'Ya existe un usuario con esa curp registrado' }, status=status.HTTP_400_BAD_REQUEST)          
            user = self.reactivate_user(user, data, request.data['email'])
            User.email_message('Reactivación de cuenta de usuario', url, user, data['password'], 'activation.html')
            user = UserListSerializer(user, many=False)
            return Response(user.data, status=status.HTTP_200_OK)
        user = User.objects.filter(curp=request.data['curp']).first()
        if user:
            if user.is_active and not user.status_delete:
                return Response({ 'message': 'Ya existe un usuario con esa curp registrado' }, status=status.HTTP_400_BAD_REQUEST)            
            user = self.reactivate_user(user, data, request.data['email'])
            User.email_message('Reactivación de cuenta de usuario', url, user, data['password'], 'activation.html')
            user = UserListSerializer(user, many=False)
            return Response(user.data, status=status.HTTP_200_OK)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.token = account_activation_token.make_token(user)
            user.save()
            User.email_message('Activación de cuenta de usuario', url, user, data['password'], 'activation.html')
            user = UserListSerializer(user, many=False)
            return Response(user.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def reactivate_user(self, user, data, email):
        user.token = account_activation_token.make_token(user)
        user.email = email
        user.status_delete = False
        user.is_active = False
        user.save()
        serializer = UserSerializer(instance=user, data=data)  
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return user
class ActualizarListarEliminarUserById(Authentication, APIView):

    def get(self, request, id=None):
        user = User.objects.filter(is_active=True, id=id, status_delete=False)
        if user.exists():
            user = User.objects.get(is_active=True, id=id, status_delete=False)
            serializer = UserListSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user = User.objects.filter(is_active=True, id=id, status_delete=False)
        if user.exists():
            user = User.objects.get(is_active=True, id=id, status_delete=False)
            user.status_delete = True
            user.save()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        
    def put(self, request, id):
        user = User.objects.filter(is_active=True, id=id, status_delete=False)
        if 'password' in request.data:
            return Response({'message': 'Do not change the password'}, status=status.HTTP_400_BAD_REQUEST)     
        if user.exists():
            user = User.objects.get(is_active=True, id=id, status_delete=False)
            serializer = UserSerializer(instance=user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            serializer = UserListSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)

class CheckInUser(Authentication, APIView):

    def post(self, request):
        user = self.user
        dia = datetime.now()
        attendance_find = AttendanceHorary.objects.filter(user=user, date=dia)
        if attendance_find.exists():
           return Response({'message': 'Ya se ha realizado su entrada'}, status=status.HTTP_400_BAD_REQUEST)    
        attendance = AttendanceHorary.objects.create(user=user, check_in=time(dia.hour, dia.minute))
        serializer = AttendanceHorarySerializer(attendance, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CheckOutUser(Authentication, APIView):

    def post(self, request):
        user = self.user
        dia = datetime.now() 
        attendance_find = AttendanceHorary.objects.filter(user=user, date=dia)
        if attendance_find.exists(): # Si hizo checkin
            attendance = AttendanceHorary.objects.get(user=user, date=dia)
            if(attendance.check_in != attendance.check_out and attendance.check_out != None):
                return Response({'message': 'Ya se ha realizado su salida'}, status=status.HTTP_400_BAD_REQUEST)
            data = { 'check_out': time(dia.hour, dia.minute, dia.second),}
            serializer = AttendanceHorarySerializer(attendance, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            attendance = AttendanceHorary.objects.create(user=user)
            serializer = AttendanceHorarySerializer(attendance, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
class OpenCashRegister(Authentication, APIView):

    def post(self, request):
        cash_init = request.data.get('cash_init', None)
        count_cr = CashRegister.objects.all().count()
        fecha = date.today()
        folio = 'CR' + str(count_cr) + str(fecha.year) + str(fecha.month) + str(fecha.day)
        user = self.user
        dia = datetime.now()
        attendance_find = AttendanceHorary.objects.filter(user=user, date=dia)
        if attendance_find.exists():
            if cash_init is None:
                return Response({'message': 'La cantidad inicial es requerida'}, status=status.HTTP_400_BAD_REQUEST)
            user = self.user
            dia = datetime.now()
            cash_register = CashRegister.objects.filter(user=user, date=dia, status=False, status_delete = False)
            if cash_register.exists():
                return Response({'message': 'No se puede abrir dos cajas por el mismo usuario en el mismo día'}, status=status.HTTP_400_BAD_REQUEST)
            cash_register = CashRegister.objects.create(user=user, date=dia, cash_init=cash_init, cash_end=cash_init, folio=folio)
            serializer = CashRegisterSerializer(cash_register, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'message': 'Necesita registrar su entrada previamente'}, status=status.HTTP_400_BAD_REQUEST)

class ClosedCashRegister(Authentication, APIView):
    
    def post(self, request):
        user = self.user
        dia = datetime.now()
        observations = request.data.get('observations', None)
        if observations is None or observations == '':
            return Response({'message': 'Se requiere las observaciones del cierre de caja'}, status=status.HTTP_400_BAD_REQUEST)
        cash_register = CashRegister.objects.filter(user=user, date=dia, status_delete=False).first()
        if not cash_register:
            return Response({'message': 'Requiere abrir la caja previamente'}, status=status.HTTP_400_BAD_REQUEST)
        if not cash_register.status:
            return Response({'message': 'La caja ya fue cerrada previamente'}, status=status.HTTP_400_BAD_REQUEST)
        cash_register.status = False
        cash_register.observations = observations
        cash_register.save()
        serializer = CashRegisterSerializer(cash_register, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListCashRegisterOpen(Authentication, APIView):
        
    def get(self, request):
        user = self.user
        dia = datetime.now()
        cash_register = CashRegister.objects.filter(user=user, date=dia, status_delete=False, status=True).first()
        if cash_register:
            
            cash_register_serializer = CashRegisterSerializer(cash_register, many=False)
            
            sales = Sale.objects.all().filter(status_delete=False, cash_register=cash_register)
            response_sale = []
            for sale in sales:
                if sale.user.is_active and not sale.user.status_delete:
                    serializer_venta = SaleSerializer(sale, many=False)
                    sale_detail = SaleDetailsProduct.objects.all().filter(sale=sale, status_delete=False)
                    if len(sale_detail) > 0:
                        product = True
                        serializer_detail_venta = SaleDetailsProductSerializer(sale_detail, many=True) 
                    else:
                        product = False
                        sale_detail = SaleDetailsMembership.objects.filter(sale=sale, status_delete=False)
                        serializer_detail_venta = SaleDetailsMembershipSerializer(sale_detail, many=True)
                    response_sale.append({ 'sale': serializer_venta.data, 'sale_detail': serializer_detail_venta.data, 'is_product': product})
            response_puchase = []
            purchases = Purchase.objects.all().filter(status_delete=False, cashRegister_id=cash_register)
            for purchase in purchases:
                if purchase.user_id.is_active and not purchase.user_id.status_delete:
                    serializer_purchase = PurchaseSerializer(purchase, many=False)
                    purchase_detail = Purchase_Details_Product.objects.all().filter(purchase_id=purchase.id, status_delete=False)
                    serializer_detail_purchase = PurchaseProductSerializer(purchase_detail, many=True) 
                    response_puchase.append({ 'Purchase': serializer_purchase.data, 'purchase_detail': serializer_detail_purchase.data})
            return Response({"cash_register": cash_register_serializer.data, "sales": response_sale, "purchases": response_puchase}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No tiene una caja abierta actualmente'}, status=status.HTTP_400_BAD_REQUEST)
            
class ListAllCashRegister(Authentication, APIView):

    def get(self, request):
        cash_register = CashRegister.objects.filter(status_delete=False, status=False)
        cash_register_serializer = CashRegisterSerializer(cash_register, many=True)
        return Response(cash_register_serializer.data, status=status.HTTP_200_OK)

class ListUpdateDeleteCashRegister(Authentication, APIView):

    def validated_user(self, id_employee):
        user = User.objects.filter(is_active=True, id=id_employee, status_delete=False).first()
        if not user:
            return None, {'message': 'Usuario no encontrado'}
        return user, None

    def validated_cash_register(self, id_cash_register):
        cash_register = CashRegister.objects.filter(id=id_cash_register, status_delete=False).first()
        if not cash_register:
            return None, {'message': f'Caja con id = {id_cash_register} no encontrada'}
        return cash_register, None

    def validated_user_cash_register(self, id_employee, id_cash_register):
        user, msj = self.validated_user(id_employee)
        if user is None:
            return None, None, msj
        cash_register, msj = self.validated_cash_register(id_cash_register)
        if cash_register is None:
            return None, None, msj    
        if cash_register.user != user:
            return None, None, {'message': f'Esta caja no pertenece al usuario dado'}    
        return user, cash_register, None

    def get(self, request, id_employee, id_cash_register):
        user, msj = self.validated_user(id_employee)
        if user is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)
        cash_register_serializer = None 
        if id_cash_register == 0:
            cash_register = CashRegister.objects.all().filter(user=user, status_delete=False, status=False)
            cash_register_serializer = CashRegisterSerializer(cash_register, many=True)
            return Response(cash_register_serializer.data, status=status.HTTP_200_OK)
        else:
            _, cash_register, msj = self.validated_user_cash_register(id_employee, id_cash_register)
            if not msj is None:
                return Response(msj, status=status.HTTP_400_BAD_REQUEST)        
            
            cash_register_serializer = CashRegisterSerializer(cash_register, many=False)
            
            sales = Sale.objects.all().filter(status_delete=False, cash_register=cash_register)
            response_sale = []
            for sale in sales:
                if sale.user.is_active and not sale.user.status_delete:
                    serializer_venta = SaleSerializer(sale, many=False)
                    sale_detail = SaleDetailsProduct.objects.all().filter(sale=sale, status_delete=False)
                    if len(sale_detail) > 0:
                        product = True
                        serializer_detail_venta = SaleDetailsProductSerializer(sale_detail, many=True) 
                    else:
                        product = False
                        sale_detail = SaleDetailsMembership.objects.filter(sale=sale, status_delete=False)
                        serializer_detail_venta = SaleDetailsMembershipSerializer(sale_detail, many=True)
                    response_sale.append({ 'sale': serializer_venta.data, 'sale_detail': serializer_detail_venta.data, 'is_product': product})
            response_puchase = []
            purchases = Purchase.objects.all().filter(status_delete=False, cashRegister_id=cash_register)
            for purchase in purchases:
                if purchase.user_id.is_active and not purchase.user_id.status_delete:
                    serializer_purchase = PurchaseSerializer(purchase, many=False)
                    purchase_detail = Purchase_Details_Product.objects.all().filter(purchase_id=purchase.id, status_delete=False)
                    serializer_detail_purchase = PurchaseProductSerializer(purchase_detail, many=True) 
                    response_puchase.append({ 'Purchase': serializer_purchase.data, 'purchase_detail': serializer_detail_purchase.data})
            return Response({"cash_register": cash_register_serializer.data, "sales": response_sale, "purchases": response_puchase}, status=status.HTTP_200_OK)
            
    def put(self, request, id_employee, id_cash_register):
        observations = request.data.get('observations', None)
        if observations is None:
            return Response({'message': 'Se requiere las observaciones a editar'}, status=status.HTTP_400_BAD_REQUEST)
        user, cash_register, msj = self.validated_user_cash_register(id_employee, id_cash_register)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)
        if cash_register.status:
            return Response({'message': 'No puede editar una caja que está en uso'}, status=status.HTTP_400_BAD_REQUEST)    
        cash_register.observations = observations
        cash_register.save()
        cash_register_serializer = CashRegisterSerializer(cash_register, many=False)
        return Response(cash_register_serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id_employee, id_cash_register):
        user, cash_register, msj = self.validated_user_cash_register(id_employee, id_cash_register)
        if not msj is None:
            return Response(msj, status=status.HTTP_400_BAD_REQUEST)
        if cash_register.status:
            return Response({'message': 'No puede eliminar una caja que está en uso'}, status=status.HTTP_400_BAD_REQUEST)    
        
        sales = Sale.objects.all().filter(status_delete=False, cash_register=cash_register)
        for sale in sales:
            if sale.user.is_active and not sale.user.status_delete:
                sale_detail = SaleDetailsProduct.objects.all().filter(sale=sale, status_delete=False)
                if sale_detail:
                    for sd in sale_detail:
                        sd.status_delete = True
                else:
                    sale_detail = SaleDetailsMembership.objects.all().filter(sale=sale, status_delete=False)
                    for sd in sale_detail:
                        sd.status_delete = True
                sale.status_delete = True
        purchases = Purchase.objects.all().filter(status_delete=False, cashRegister_id=cash_register)
        for purchase in purchases:
            if purchase.user_id.is_active and not purchase.user_id.status_delete:
                purchase_detail = Purchase_Details_Product.objects.all().filter(purchase_id=purchase.id, status_delete=False)
                for pd in purchase_detail:
                    pd.status_delete = True                
                purchase.status_delete = True

        cash_register.status_delete = True
        cash_register.save()
        return Response({'message': 'Corte de caja eliminado correctamente'}, status=status.HTTP_200_OK)

class Profile(Authentication, APIView):

    def get(self, request):
        user = self.user
        serializer = UserListSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        if 'password' in request.data:
            return Response({'message': 'Do not change the password'}, status=status.HTTP_400_BAD_REQUEST)     
        user = self.user
        serializer = UserListSerializer(instance=user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
