from django.conf import settings
from django.core.mail import EmailMultiAlternatives, BadHeaderError
from django.contrib.auth.decorators import user_passes_test
from django.http import HttpResponse


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
