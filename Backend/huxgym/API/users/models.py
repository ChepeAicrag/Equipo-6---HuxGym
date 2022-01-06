from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes

from API.general.utils import send_email_validation
from API.general.models import Role
from .choices import roles

def upload_load(instance, filename):
    return f'photos_users/{instance.email}/{filename}'


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        user = self.model(
            email=self.normalize_email(email),
            is_active=True,
            is_superuser=False,
            is_staff=False,
            status_delete=False,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self.db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.model(
            email=self.normalize_email(email),
            is_active=True,
            is_superuser=True,
            is_staff=True,
            role_id = 1,
            **extra_fields,
        )
        user.set_password(password)
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=150, null=False, verbose_name='name',)
    paternal_surname = models.CharField(max_length=150, null=False, verbose_name='paternal surname',)
    mothers_maiden_name = models.CharField(max_length=150, null=False, verbose_name='mother maiden name',)
    birthdate = models.DateField(null=False, verbose_name='birthdate')
    entity_birth = models.CharField(max_length=2, null=False, verbose_name="entity birth")
    curp = models.CharField(max_length=18, null=False, verbose_name='curp', unique=True)
    age = models.PositiveIntegerField(
        null=False, default=18, verbose_name='age')
    email = models.EmailField(
        unique=True, max_length=100, null=False, verbose_name='email',)
    phone = models.CharField(verbose_name='phone', max_length=10)
    image = models.ImageField(upload_to=upload_load, default='default.jpg',
                              max_length=255, null=True, blank=True)
    gender = models.CharField(max_length=2, null=True, verbose_name='Gender')
    token = models.CharField(max_length=40,null=True,default=None)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    status_delete = models.BooleanField(default=False)
    role = models.ForeignKey(Role, choices=roles, on_delete=models.CASCADE)

    USERNAME_FIELD = 'email'
    objects = UserManager()

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        db_table = 'user'
        ordering = ('id',)

    def __str__(self):
        return f'{self.name} {self.email}'

    @staticmethod
    def email_message(subject, url, user, password, html):
        message = render_to_string(html, {
            'user': user.name,
            'email': user.email,
            'password': password,
            'url': url, 
            'uid': urlsafe_base64_encode(force_bytes(user.id)), 
            'token': user.token,
            'passwordb64': urlsafe_base64_encode(force_bytes(password)),
        })
        send_email_validation(subject, user.email, message)
        return True

    @staticmethod
    def search_account(uidb64):
        try:
            uid = force_bytes(urlsafe_base64_decode(uidb64)).decode()
            user = User.objects.get(id=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        return user

    @staticmethod
    def search_account_email(email):
        try:
            user = User.objects.get(email=email, status_delete=False)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        return user
class Log(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, verbose_name='Usuario Id')
    action = models.CharField(
        max_length=100, null=False, verbose_name='Accion')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Fecha')
    status_delete = models.BooleanField(
        default=False, verbose_name='Status Delete')

    class Meta:
        verbose_name = 'Log'
        verbose_name_plural = 'Logs'
        db_table = 'Log'
        ordering = ('id', )

class AttendanceHorary(models.Model):

    date = models.DateField('Fecha de asistencia', auto_now=True)
    check_in = models.TimeField('Hora de entrada', null=False)
    check_out = models.TimeField('Hora de salida', null=True)
    status_delete = models.BooleanField(default=False, verbose_name='Status Delete')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta: 
        verbose_name = 'AttendanceHorary'
        verbose_name_plural = 'AttendancesHorary'
        db_table = 'AttendanceHorary'
        ordering = ['id']

class CashRegister(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    observations = models.CharField(null=True, max_length=50)
    cash_init = models.FloatField(null=True, default=0)
    cash_end = models.FloatField(null=True, default=0)
    amount_sell = models.FloatField(null=True, default=0)
    amount_purchase = models.FloatField(null=True, default=0)
    amount_total = models.FloatField(null=True, default=0)
    cambio = models.FloatField(null=True, default=0)
    status_delete = models.BooleanField(default=False)
    status = models.BooleanField(default=True)
    folio = models.CharField(max_length=50, blank=False, null=False, unique=True)

    class Meta:
        verbose_name = 'Cash Register'
        verbose_name_plural = 'Cash Registers'
        db_table = 'CashRegister'
        ordering = ['id']
