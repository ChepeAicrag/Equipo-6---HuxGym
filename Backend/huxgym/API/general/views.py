from django.contrib.sessions.models import Session
from rest_framework import views
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import status, viewsets
from django.utils.http import urlsafe_base64_decode
from django.utils.crypto import get_random_string
from django.utils.encoding import force_bytes
from decouple import config
from datetime import datetime
from random import randint
import json

from API.general.api import API
from API.users.models import User, Log
from API.users.serializers import UserSerializer
from API.users.serializers import UserTokenSerializer
from API.general.token_generator import account_activation_token
from .authentication_middleware import Authentication
from .models import Role
from .serializers import RoleModuleSerialzier, RoleSerializer

#VIEWSETS PARA LA DOCMENTACIÓN

class RoleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    queryset = RoleSerializer.Meta.model.objects

class RoleModuleViewSet(viewsets.ModelViewSet):
    serializer_class = RoleModuleSerialzier
    queryset = RoleModuleSerialzier.Meta.model.objects


class RefreshToken(Authentication ,APIView):
    
    def post(self, request):
        try:
            user = self.user # Este usuario tiene su token de siempre o el refrescado automaticamente
            user_token, _ = Token.objects.get_or_create(user=user)
            serializer = UserTokenSerializer(user)
            return Response({
                'token': user_token.key,
                'user': serializer.data,
            }, status=status.HTTP_200_OK)
        except: # Falla cuando no se envía el token
            return Response({
                'message': 'Credentials invalid',
            }, status=status.HTTP_400_BAD_REQUEST)

class Login(ObtainAuthToken):

    permission_classes = (AllowAny, )

    def post(self, request):
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        if email is None:
            return Response({ 'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        if password is None:
            return Response({ 'message': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=email).exists()
        if user: 
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({ 'message': 'User not activated'}, status=status.HTTP_400_BAD_REQUEST)
            if not user.status_delete:
                request.data.setdefault('username', email)
                serializer = self.serializer_class(data=request.data, context={ 'request': request})
                if serializer.is_valid():
                    user = serializer.validated_data['user']
                    Log.objects.create(user_id=user.id, action='Login')
                    token, created = Token.objects.get_or_create(user=user)
                    user_serializer = UserTokenSerializer(user)
                    response = {'token': token.key, 'user': user_serializer.data,}
                    if created:
                        return Response(response, status=status.HTTP_201_CREATED)
                    else:
                        all_sessions = Session.objects.filter(expire_date__gte = datetime.now())
                        if all_sessions.exists():
                            for session in all_sessions:
                                session_data = session.get_decoded()
                                if user.id == int(session_data.get('_auth_user_id')):
                                    session.delete()
                        token.delete()
                        token = Token.objects.create(user=user)
                        response['token'] = token.key
                        return Response(response, status=status.HTTP_200_OK)
                else:
                    return Response({'message': 'Credentials incorrects'}, status=status.HTTP_400_BAD_REQUEST)
            else: 
                return Response({'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        else: 
            return Response({'message': 'No hay usuario con email dado'}, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView):

    def post(self, request):
        token = request.data.get('token', None) # Enviar en token como variable
        if token is None:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        token = Token.objects.filter(key=token).first()
        if token:
            user = token.user
            all_sessions = Session.objects.filter(expire_date__gte = datetime.now())
            if all_sessions.exists():
                for session in all_sessions:
                    session_data = session.get_decoded()
                    if user.id == int(session_data.get('_auth_user_id')):
                        session.delete()
            token.delete()
            session_message = 'Sesiones de usuario eliminadas'
            token_message = 'Token deleted'
            Log.objects.create(user_id=user.id, action='Logout')
            return Response({'token_message': token_message, 'session_message': session_message}, status=status.HTTP_200_OK)
        return Response({'error': 'User with token in use not found'}, status=status.HTTP_400_BAD_REQUEST)    
                        

class RestorePassword(APIView):

    def post(self, request):
        email = request.data.get('email', None)
        if email is None:
            return Response({ 'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.search_account_email(email=email)
        if user is None:
            return Response({ 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.is_active:
            return Response({ 'message': 'User not activated'}, status=status.HTTP_400_BAD_REQUEST)
        password = get_random_string(randint(8, 15))
        user.token = account_activation_token.make_token(user)
        user.save()
        Log.objects.create(user_id=user.id, action='Solicitud de restauración de contraseña')
        url = config('URL_CONFIRM')
        User.email_message('Solicitud para reestablecer la contraseña de su usuario en HuxGym', url, user, password, 'restore_password.html')
        return Response({'message':'Solicitud satisfactoria'},status=status.HTTP_200_OK)  

class ChangePassword(Authentication, APIView):
    
    def post(self, request):
        email = request.data.get('email', None)
        password_old = request.data.get('password_old', None)
        password = request.data.get('password', None)
        if email is None:
            return Response({ 'message': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        if password_old is None:
            return Response({ 'message': 'Old password is required'}, status=status.HTTP_400_BAD_REQUEST)
        if password is None:
            return Response({ 'message': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        if password is password_old:
            return Response({ 'message': 'New password is the same old password'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.search_account_email(email=email)
        if user is None:
            return Response({ 'message': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.is_active:
            return Response({ 'message': 'User not activated'}, status=status.HTTP_400_BAD_REQUEST)        
        if user.check_password(password_old):
            user.set_password(password)
            user.save()
            Log.objects.create(user_id=user.id, action='Cambio de contraseña')
            User.email_message('Cambio de contraseña de su usuario en HuxGym', 'login', user, password, 'change_password.html')
            return Response({'message':'Contraseña cambiada correctamente'},status=status.HTTP_200_OK)  
        return Response({'message':'Contraseña actual incorrecta'},status=status.HTTP_400_BAD_REQUEST)  

from rest_framework.renderers import TemplateHTMLRenderer
from django.shortcuts import render

class ActivateAccount(APIView):
    
    def get(self, request, uidb64, token):
        user = User.objects.filter(is_active=False, status_delete=False, token=token)
        if user.exists():
            user = User.objects.get(is_active=False, status_delete=False, token=token)
            find_user_uidb64 = User.search_account(uidb64)
            if user.id == find_user_uidb64.id:
                user.is_active = True
                user.token = account_activation_token.make_token(user)
                user.save()
                Log.objects.create(user_id=user.id, action='Activación de cuenta')            
                return render(request,'activate_ok.html', {'name': user.name})
                #return Response({'message': 'Account active successfully'}, status=status.HTTP_200_OK)
            else:
                #return Response({'message': 'El token no le pertenece a usted'}, status=status.HTTP_400_BAD_REQUEST)
                return render(request, 'message_page.html', {'message': 'Token invalido para su usuario'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return render(request, 'message_page.html', {'message': 'Token vencido'}, status=status.HTTP_400_BAD_REQUEST)
            #return Response({'message': 'Token vencido'}, status=status.HTTP_400_BAD_REQUEST)

class ConfirmPassword(APIView):

    def get(self, request, uidb64, token, password):
        user = User.objects.filter(is_active=True, status_delete=False, token=token)
        if user.exists():
            user = User.objects.get(is_active=True, status_delete=False, token=token)
            find_user_uidb64 = User.search_account(uidb64)
            if user.id == find_user_uidb64.id:
                password = force_bytes(urlsafe_base64_decode(password)).decode()
                user.set_password(password)
                user.token = account_activation_token.make_token(user)
                user.save()
                Log.objects.create(user_id=user.id, action='Cambio de contraseña')
                return render(request, 'password_ok.html', { 'name': user.name })
                #return Response({'message': 'Password confirmed successfully'}, status=status.HTTP_200_OK)
            else:
                return render(request, 'message_page.html', {'message': 'Token invalido para su usuario'}, status=status.HTTP_400_BAD_REQUEST)
                #return Response({'message': 'El token no le pertenece a usted'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return render(request, 'message_page.html', {'message': 'Token vencido'}, status=status.HTTP_400_BAD_REQUEST)
            #return Response({'message': 'Token vencido'}, status=status.HTTP_400_BAD_REQUEST)

class ListRole(APIView):

    def get(self, request):
        roles = Role.objects.all().filter(status_delete=False, isSuperAdmin=False)
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
class ListStates(APIView):

    def get(self, request):
        with open('API/general/fixtures/states.json') as file:
            data = json.load(file)
            return Response(data, status=status.HTTP_200_OK)

class GetDataWithCurp(APIView):

    def get(self, request):
        curp = request.data.get('paternal_surname', None)
        if curp is None:
            return Response({ 'message': 'El campo curp es requerido' }, status=status.HTTP_400_BAD_REQUEST)
        data, error = API().validate_curp(curp)
        if(error):
            return Response({ 'message': data }, status=status.HTTP_400_BAD_REQUEST)
        response = { 
            'curp': str(data['Curp']).upper(),
            'names': str(data['Nombre']).lower(),
            'paternal_surname': str(data['ApellidoPaterno']).lower(),
            'mothers_maiden_name': str(data['ApellidoMaterno']).lower(),
            'birthdate': str(data['FechaNacimiento']),
            'entity_birth': str(data['NumEntidadReg']).lower(),
            'sex': str(data['Sexo']).lower(),
        }
        return Response(response, status=status.HTTP_200_OK)