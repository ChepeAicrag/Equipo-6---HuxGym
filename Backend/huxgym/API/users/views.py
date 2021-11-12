from django.utils.crypto import get_random_string
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from random import randint
from datetime import datetime, time
from decouple import config

from API.general.token_generator import account_activation_token
from API.general.authentication_middleware import Authentication
from .serializers import UserSerializer, UserListSerializer, AttendanceHorarySerializer, CashRegisterSerializer
from .models import User, AttendanceHorary, CashRegister


class CrearListarUser(Authentication, APIView):

    permission_classes = (AllowAny, )

    def get(self, request):
        users = User.objects.all().filter(
            is_active=True, status_delete=False, is_superuser=False)
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        role = data.get('role', None)
        if role is None:
            return Response({'message': 'El rol es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        if int(role) == 1:
            return Response({'message': 'No puede crear un usuario con este rol'}, status=status.HTTP_400_BAD_REQUEST)
        data['role'] = int(role)
        data['password'] = get_random_string(randint(8, 15))
        user_find = User.objects.filter(email=request.data['email'])
        url = config('URL_ACTIVATE')
        if user_find.exists():
            user = User.objects.get(email=request.data['email'])
            if user.is_active and not user.status_delete:
                return Response({'message': 'Ya existe un usuario con ese correo'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                user.token = account_activation_token.make_token(user)
                user.status_delete = False
                user.is_active = False
                user.save()
                serializer = UserSerializer(instance=user, data=data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                User.email_message('Reactivación de cuenta de usuario',
                                   url, user, data['password'], 'activation.html')
                user = UserListSerializer(user, many=False)
                return Response(user.data, status=status.HTTP_200_OK)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.token = account_activation_token.make_token(user)
            user.save()
            User.email_message('Activación de cuenta de usuario',
                               url, user, data['password'], 'activation.html')
            user = UserListSerializer(user, many=False)
            return Response(user.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActualizarListarEliminarUserById(Authentication, APIView):

    def get(self, request, id=None):
        user = User.objects.filter(is_active=True, id=id, status_delete=False)
        if user.exists():
            user = User.objects.get(is_active=True, id=id, status_delete=False)
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
        attendance = AttendanceHorary.objects.create(
            user=user, check_in=time(dia.hour, dia.minute))
        serializer = AttendanceHorarySerializer(attendance, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CheckOutUser(Authentication, APIView):

    def post(self, request):
        user = self.user
        dia = datetime.now()
        attendance_find = AttendanceHorary.objects.filter(user=user, date=dia)
        if attendance_find.exists():  # Si hizo checkin
            attendance = AttendanceHorary.objects.get(user=user, date=dia)
            if(attendance.check_in != attendance.check_out and attendance.check_out != None):
                return Response({'message': 'Ya se ha realizado su salida'}, status=status.HTTP_400_BAD_REQUEST)
            data = {'check_out': time(dia.hour, dia.minute, dia.second), }
            serializer = AttendanceHorarySerializer(
                attendance, data=data, partial=True)
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
        user = self.user
        dia = datetime.now()
        attendance_find = AttendanceHorary.objects.filter(user=user, date=dia)
        if attendance_find.exists():
            if cash_init is None:
                return Response({'message': 'La cantidad inicial es requerida'}, status=status.HTTP_400_BAD_REQUEST)
            user = self.user
            dia = datetime.now()
            cash_register = CashRegister.objects.filter(
                user=user, date=dia, status=False, status_delete=False)
            if cash_register.exists():
                return Response({'message': 'No se puede abrir dos cajas por el mismo usuario en el mismo día'}, status=status.HTTP_400_BAD_REQUEST)
            cash_register = CashRegister.objects.create(
                user=user, date=dia, cash_init=cash_init, cash_end=cash_init)
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
        cash_register = CashRegister.objects.filter(
            user=user, date=dia, status_delete=False).first()
        if not cash_register:
            return Response({'message': 'Requiere abrir la caja previamente'}, status=status.HTTP_400_BAD_REQUEST)
        if not cash_register.status:
            return Response({'message': 'La caja ya fue cerrada previamente'}, status=status.HTTP_400_BAD_REQUEST)
        cash_register.status = False
        cash_register.observations = observations
        cash_register.save()
        serializer = CashRegisterSerializer(cash_register, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Profile(Authentication, APIView):

    def get(self, request):
        user = self.user
        serializer = UserListSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if 'password' in request.data:
            return Response({'message': 'Do not change the password'}, status=status.HTTP_400_BAD_REQUEST)
        user = self.user
        serializer = UserListSerializer(
            instance=user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
