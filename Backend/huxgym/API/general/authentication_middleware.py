from .authentication import ExpiringTokenAuthentication
from rest_framework.authentication import get_authorization_header
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import status

class Authentication(object):

    user = None

    def get_user(self, request): # Refresca el token y obtiene el usuario
        token = get_authorization_header(request).split()
        if token:
            try:
                token = token[1].decode()
            except:
                return None
            token_expire = ExpiringTokenAuthentication()
            user = token_expire.authenticate_credentials(token) # Token como key no como instancia
            if user != None:
                self.user = user
                return user
        return None

    def dispatch(self, request, *args, **kwargs):
        user = self.get_user(request)
        if user is not None:
            return super().dispatch(request, *args, **kwargs)
        response = Response({'message': 'Credenciales invalidas' }, status=status.HTTP_401_UNAUTHORIZED)
        response.accepted_renderer = JSONRenderer()
        response.accepted_media_type = 'application/json'
        response.renderer_context = {}
        return response

class AuthRoleModule():
    
    
    """
        user: usuario que realiza la acción (Ya existe, con validación anterior)
        module: Modulo al que accede
        action: Métedo http que realiza
        return True si la puede realizar, false de lo contrario y el msj correspondiente
    """
    @staticmethod
    def valida_role(user, module, action):
        if user.role.id != 1 and action == 'DELETE': # Solo el administrador puede eliminar
            return false, 'No tiene permiso para eliminar'
        
        return True, 'Acceso permitido'
