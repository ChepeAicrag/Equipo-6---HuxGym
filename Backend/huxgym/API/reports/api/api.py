from API.purchases.models import *
from API.reports.api.serializers import *
from API.reports.models import *
from API.customers.models import *
from API.general.models import *
from API.sales.models import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from API.general.authentication_middleware import Authentication
from rest_framework.views import APIView
from datetime import datetime
import operator
from django.db.models import Sum
from API.products.models import Stock, OperationType, Operation, HistoryInventory

"""
Attendence reporting API
returns statistics on attendance in a range of dates, 
grouped by age, gender, and student status
"""
@api_view(['GET','POST'])
def report_attendence_view(request):
    if 'first_date' in request.data and 'last_date' in request.data:
        try:
            first_date = datetime.strptime(request.data['first_date'],'%Y-%m-%d')
            last_date = datetime.strptime(request.data['last_date'],'%Y-%m-%d')
        except ValueError:
            return Response({'message': 'Formato inválido de fechas, requiere la forma YYYY-MM-DD'},
                            status = status.HTTP_400_BAD_REQUEST)
        if first_date < last_date:
            attendances = Attendance.objects.all().filter(status_delete = False,
                                                          date__range=(first_date, last_date))

            if 'option' in request.data and 'student' in request.data:
                if request.data['option'] == 'gender':
                    total_men, total_woman = 0, 0
                    total_men_student, total_woman_student = 0, 0
                    for attendance in attendances:
                        customer = attendance.customer_id
                        if customer:
                            if customer.gender == 'M':
                                total_men += 1
                                total_men_student += 1 if customer.isStudiant else 0
                            else:
                                total_woman += 1
                                total_woman_student += 1 if customer.isStudiant else 0
                    if request.data['student']== 'yes':
                        total_men = total_men_student
                        total_woman = total_woman_student

                    return Response({'message': 'Filtrado por género', 
                                    'M': total_men,
                                    'F': total_woman}, 
                                    status = status.HTTP_200_OK)

                elif request.data['option'] == 'age':
                    ages = [0,0,0,0,0,0,0,0,0]
                    ages_student = [0,0,0,0,0,0,0,0,0]
                    clinics = HistoryClinic.objects.all()
                    for attendance in attendances:
                        customer = attendance.customer_id
                        if customer:
                            last_clinic = clinics.all().filter(
                                customer_id = customer.id).latest('id') if clinics.all().filter(
                                customer_id = customer.id).exists() else None 
                            if last_clinic != None:
                                age = last_clinic.age // 10
                                ages[age-1] += 1
                                ages_student[age-1] += 1 if customer.isStudiant else 0
                    if request.data['student'] == 'yes':
                        ages = ages_student
                    
                    return Response({'message': 'Filtrado por edad',
                                    'total': ages,}, 
                                    status = status.HTTP_200_OK)

                else:
                    return Response({'message': 'Seleccione un filtro válido'},
                                status = status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'message': 'Se debe agregar el campo option y student'},
                            status = status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'La fechas no son validas'},
                            status = status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Se requiere un rango de fechas'},
                            status = status.HTTP_400_BAD_REQUEST)


"""
Buying customers API
Returns statistics on the number of customers who purchase a product 
in relation to the total number of customers.
"""
@api_view(['GET','POST'])
def report_customer_product(request):
    if 'first_date' in request.data and 'last_date' in request.data:
        try:
            first_date = datetime.strptime(request.data['first_date'],'%Y-%m-%d')
            last_date = datetime.strptime(request.data['last_date'],'%Y-%m-%d')
        except ValueError:
            return Response({'message': 'Formato inválido de fechas, requiere la forma YYYY-MM-DD'},
                            status = status.HTTP_400_BAD_REQUEST)
        if first_date < last_date:                                                   
            buyers = Purchase.objects.all().filter(status_delete = False,
                                                   date__range=(first_date, last_date))
            buyers = buyers.values('user_id').distinct().count()
            customers = Customer.objects.all().filter(status_delete = False).count()
            
            return Response({'message': 'Clientes que compran productos',
                            'customers': customers,
                            'buyers': buyers},
                            status = status.HTTP_200_OK)
        else:
            return Response({'message': 'Rango de fechas inválido'},
                            status = status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Se requiere un rango de fechas'},
                            status = status.HTTP_400_BAD_REQUEST)

"""
Purchases report API
No bugs pending, pending due to changes to the User model
"""
@api_view(['GET','POST'])
def report_purchase_view(request):
    if 'first_date' in request.data and 'last_date' in request.data:
        try:
            first_date = datetime.strptime(request.data['first_date'],'%Y-%m-%d')
            last_date = datetime.strptime(request.data['last_date'],'%Y-%m-%d')
        except ValueError:
            return Response({'message': 'Formato inválido de fechas, requiere la forma YYYY-MM-DD'},
                            status = status.HTTP_400_BAD_REQUEST)
        if first_date < last_date:
            purchases = Purchase.objects.all().filter(status_delete = False,
                                                    date__range=(first_date, last_date))
            products = Product.objects.all().filter(status_delete = False)
            lista = list()
            for product in products:
                details = Purchase_Details_Product.objects.all().filter(status_delete = False,
                                                                    purchase_id__in=purchases,
                                                                    product_id = product.id).aggregate(
                                                                        Sum('amount'))
                if details['amount__sum'] != None:
                    product_serializer = ProductReportSerializer(product)
                    product_serializer.total = details['amount__sum']
                    lista.append(product_serializer.data)

            if 'order' in request.data:
                desc = True if request.data['order'] == 'desc' else False
            else:
                desc = False
            
            lista.sort(key=lambda x: x['total'], reverse=desc)

            return Response({'message': 'Productos',
                            'products': lista},
                            status = status.HTTP_200_OK)  

        else:
            return Response({'message': 'Rango de fechas inválido'},
                            status = status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Se requiere un rango de fechas'},
                            status = status.HTTP_400_BAD_REQUEST)

"""
Sales report API
No bugs pending, pending tests of usage, pending due to changes to the User model 
"""
@api_view(['GET','POST'])
def report_sales_view(request):
    if 'first_date' in request.data and 'last_date' in request.data:
        try:
            first_date = datetime.strptime(request.data['first_date'],'%Y-%m-%d')
            last_date = datetime.strptime(request.data['last_date'],'%Y-%m-%d')
        except ValueError:
            return Response({'message': 'Formato inválido de fechas, requiere la forma YYYY-MM-DD'},
                            status = status.HTTP_400_BAD_REQUEST)
        if first_date < last_date:
            sales = Sale.objects.all().filter(status_delete = False,
                                                    date__range=(first_date, last_date))
            products = Product.objects.all().filter(status_delete = False)
            lista = list()
            for product in products:
                details = SaleDetailsProduct.objects.all().filter(status_delete = False,
                                                                    sale__in=sales,
                                                                    product = product.id).aggregate(
                                                                        Sum('amount'))
                if details['amount__sum'] != None:
                    product_serializer = ProductReportSerializer(product)
                    product_serializer.total = details['amount__sum']
                    lista.append(product_serializer.data)

            if 'order' in request.data:
                desc = True if request.data['order'] == 'desc' else False
            else:
                desc = False
            
            lista.sort(key=lambda x: x['total'], reverse=desc)

            return Response({'message': 'Productos',
                            'products': lista},
                            status = status.HTTP_200_OK)  

        else:
            return Response({'message': 'Rango de fechas inválido'},
                            status = status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Se requiere un rango de fechas'},
                            status = status.HTTP_400_BAD_REQUEST)

"""
Memberships report API
No bugs pending 
"""
@api_view(['GET','POST'])
def report_membership_view(request):
    if request.data['first_date'] and request.data['last_date']:
        try:
            first_date = datetime.strptime(request.data['first_date'],'%Y-%m-%d')
            last_date = datetime.strptime(request.data['last_date'],'%Y-%m-%d')
        except ValueError:
            return Response({'message': 'Formato inválido de fechas, requiere la forma YYYY-MM-DD'},
                            status = status.HTTP_400_BAD_REQUEST)
        if first_date < last_date:
            memberships = Membership.objects.all().filter(status_delete = False)
            counts = dict()
            for membership in memberships:
                total = Customer_Membership.objects.all().filter(status_delete = False, 
                                                    date_register__range=(first_date, last_date),
                                                    membership_id = membership.id).count()
                
                counts[membership.name] = total

            desc = True if request.data['order'] == 'desc' else False 
            counts_sort = sorted(counts.items(), key = operator.itemgetter(1), reverse= desc)
            values = {}
            for item in enumerate(counts_sort):
                values[item[1][0]] = counts[item[1][0]]

            return Response(values,
                            status = status.HTTP_200_OK)  

        else:
            return Response({'message': 'Rango de fechas inválido'},
                            status = status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Se requiere un rango de fechas'},
                            status = status.HTTP_400_BAD_REQUEST)

"""
General employees report API
No bugs pending, pending due to changes to the User model
"""
@api_view(['GET','POST'])
def report_employees_view(request):
    if request.data['first_date'] and request.data['last_date']:
        try:
            first_date = datetime.strptime(request.data['first_date'],'%Y-%m-%d')
            last_date = datetime.strptime(request.data['last_date'],'%Y-%m-%d')
        except ValueError:
            return Response({'message': 'Formato inválido de fechas, requiere la forma YYYY-MM-DD'},
                            status = status.HTTP_400_BAD_REQUEST)
        if first_date < last_date:
            employees = User.objects.all().filter(status_delete = False)
            counts = dict()

            for employ in employees:
                total = Sale.objects.all().filter(status_delete = False, 
                                                    date__range=(first_date, last_date),
                                                    user__email = employ.email).count()
                if total > 0:
                    counts[employ.name] = total

            desc = True if request.data['order'] == 'desc' else False 
            counts_sort = sorted(counts.items(), key = operator.itemgetter(1), reverse= desc)
            values = {}
            for item in enumerate(counts_sort):
                values[item[1][0]] = counts[item[1][0]]

            return Response({'message': 'Empleados',
                            'total': values},
                            status = status.HTTP_200_OK)  

        else:
            return Response({'message': 'Rango de fechas inválido'},
                            status = status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'message': 'Se requiere un rango de fechas'},
                            status = status.HTTP_400_BAD_REQUEST)
        