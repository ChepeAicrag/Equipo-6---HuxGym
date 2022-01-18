from django.conf import settings
from django.core.mail import EmailMultiAlternatives, BadHeaderError
from django.contrib.auth.decorators import user_passes_test
from django.http import HttpResponse
from dateutil.relativedelta import relativedelta
from datetime import datetime


def send_email_validation(subject, email, message):
    try:
        mail = EmailMultiAlternatives(
            subject,
            'HUX_GYM',
            settings.EMAIL_HOST_USER,
            [email],
        )
        mail.attach_alternative(message, 'text/html')
        mail.send(fail_silently=True)
    except BadHeaderError:
        return HttpResponse('Error al enviar el correo')
    return True

def find_first_vocal(string):
    for char in string.lower():
        if char == 'a' or char == 'e' or char == 'i' or char == 'o' or char == 'u':
            return char
    return None

def calculate_age(birthdate):
    fecha_nacimiento = datetime.strptime(str(birthdate), '%Y-%m-%d').date()
    edad = relativedelta(datetime.now(), fecha_nacimiento)  
    return edad.years

def validate_data_curp(user, data):
    if str(user['curp']).lower() != str(data['Curp']).lower():
        return False, "La curp no corresponde a estos datos"
    if str(user['names']).lower() != str(data['Nombre']).lower():
        return False, "El nombre no corresponde a esa curp"
    if str(user['paternal_surname']).lower() != str(data['ApellidoPaterno']).lower():
        return False, "El apellido paterno no corresponde a esa curp"
    if str(user['mothers_maiden_name']).lower() != str(data['ApellidoMaterno']).lower():
        return False, "El apellido materno no corresponde a esa curp"
    if str(user['birthdate']) != str(data['FechaNacimiento']):
        return False, "El año de nacimiento no corresponde a esa curp"
    if str(user['entity_birth']).lower() != str(data['NumEntidadReg']).lower():
        return False, "La enitdad de nacimiento no corresponde a esa curp"       
    if str(user['sex']).lower() != str(data['Sexo']).lower():
        return False, "El genero no corresponde a esa curp"
    return True, None