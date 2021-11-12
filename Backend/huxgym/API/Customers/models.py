from django.db import models
from django.db.models.base import Model
from django.db.models.deletion import CASCADE
from django.db.models.fields import DateField
from django.db.models.fields.related import ForeignKey
from .choices import genders, bloodTypes
from django.utils import timezone
from API.memberships.models import Membership
# Create your models here.

def upload_load(instance,filename):
    return f'photos_customers/{instance.name}/{filename}'

class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40, blank=False, null=False)
    gender = models.CharField(max_length=1, choices=genders, default='M')
    phone = models.CharField(max_length=10, blank=False, null=False)
    image = models.ImageField(upload_to = upload_load, max_length=255, blank=True, null = True, default='default.jpg',)
    membershipActivate = models.BooleanField(default=False)
    isStudiant = models.BooleanField(default=False)
    dateJoined = models.DateField('Fecha de registro', auto_now=True)
    status_delete = models.BooleanField(default=False)
    
    membership = models.ManyToManyField(Membership, through='Customer_Membership')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
        db_table = 'customer'
        ordering = ['id']

class Attendance(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField('Fecha de asistencia', auto_now=True)
    check_in = models.TimeField('Hora de entrada', auto_now_add=True)
    check_out = models.TimeField('Hora de salida', blank=True, null=True)
    status_delete = models.BooleanField(default=False)
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id) + " - " + self.customer_id.name + " : " + str(self.date) + " : " + str(self.check_in)

    class Meta: 
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendances'
        db_table = 'attendance'
        ordering = ['id']

class NutritionalSituation(models.Model):
    id = models.AutoField(primary_key=True)
    hour_breakfast = models.TimeField(blank= True, null= True)
    hour_collation = models.TimeField(blank= True, null= True)
    hour_lunch = models.TimeField(blank= True, null= True)
    hour_snack = models.TimeField(blank= True, null= True)
    hour_dinner = models.TimeField(blank= True, null= True)
    schedule = models.TextField(max_length=100, blank= True, null= True)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return "Situación nutricional: " + str(self.id)

    class Meta: 
        verbose_name = 'NutritionalSituation'
        verbose_name_plural = 'NutritionalSituations'
        db_table = 'nutritionalSituation'
        ordering = ['id']

class TypeExtraInformation(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, blank=False, null=False )
    description = models.TextField(max_length=150, blank=True, null=True)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return "Información extra: " + str(self.name)

    class Meta: 
        verbose_name = 'TypeExtraInformation'
        verbose_name_plural = 'TypeExtraInformations'
        db_table = 'typeExtraInformation'
        ordering = ['id']



class BodyAttribute(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=False, null=False )
    description = models.TextField(max_length=100, blank=True, null=True)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return "Atributo de cuerpo: " + str(self.name)

    class Meta: 
        verbose_name = 'BodyAttribute'
        verbose_name_plural = 'BodyAttributes'
        db_table = 'bodyAttribute'
        ordering = ['id']

class HistoryClinic(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField('Fecha de creación', auto_now_add=True)
    age =models.SmallIntegerField( blank= False, null= False)
    weigth = models.PositiveBigIntegerField(blank= False, null= False)
    heigh = models.PositiveIntegerField(blank= False, null= False)
    bloodType = models.CharField(max_length=4,blank= False, null= False, choices=bloodTypes, default='O+')
    status_delete = models.BooleanField(default=False)

    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE)
    nutritionalSituation_id = models.ForeignKey(NutritionalSituation,null=True, on_delete = models.SET_NULL, blank=True)

    typeExtraInformation = models.ManyToManyField(TypeExtraInformation, through='TypeExtraInformation_HistoryClinic')
    bodyAttribute = models.ManyToManyField(BodyAttribute, through='BodyAttribute_HistoryClinic')

    def __str__(self):
        return "Historia clínico: " + str(self.customer_id.name)

    class Meta: 
        verbose_name = 'HistoryClinic'
        verbose_name_plural = 'HistoryClinics'
        db_table = 'historyClinic'
        ordering = ['id']


class TypeExtraInformation_HistoryClinic(models.Model):
    historyClinic_id = models.ForeignKey(HistoryClinic, on_delete=CASCADE)
    typeExtraInformation_id = models.ForeignKey(TypeExtraInformation, on_delete=CASCADE)
    
    name = models.CharField(max_length=50, blank=False, null=False)
    value = models.BooleanField(default=False)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return "Historial clínico de: " + str(self.historyClinic_id.customer_id.name) + " - " + self.typeExtraInformation_id.name

    class Meta: 
        verbose_name = 'TypeExtraInformation_HistoryClinic'
        verbose_name_plural = 'TypeExtraInformation_HistoryClinics'
        db_table = 'typeExtraInformation_historyClinic'
        ordering = ['id']


class BodyAttribute_HistoryClinic(models.Model):
    bodyAttribute_id = models.ForeignKey(BodyAttribute, on_delete=models.CASCADE)
    historyClinic_id = models.ForeignKey(HistoryClinic, on_delete=models.CASCADE)

    value = models.CharField(default="Sin dato",  max_length=255)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return "Historial clínico de: " + str(self.historyClinic_id.customer_id.name) + " - " + self.bodyAttribute_id.name

    class Meta: 
        verbose_name = 'BodyAttribute_HistoryClinic'
        verbose_name_plural = 'BodyAttribute_HistoryClinics'
        db_table = 'bodyAttribute_historyClinic'
        ordering = ['id']

class Customer_Membership(models.Model):
    membership_id = models.ForeignKey(Membership, on_delete=models.CASCADE)
    customer_id = models.ForeignKey(Customer,on_delete=models.CASCADE)

    date_register = models.DateField('Fecha de registro', auto_now=True)
    date_due = models.DateField('Fecha de vencimiento', blank=False, null=False)
    valid = models.BooleanField(default=True)
    status_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.customer_id.name + " : " + self.membership_id.name

    class Meta: 
        verbose_name = 'Customer_Membership'
        verbose_name_plural = 'Customer_Memberships'
        db_table = 'customer_Membership'
        ordering = ['id']