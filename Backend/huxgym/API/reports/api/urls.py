from django.urls import path
from API.reports.api.api import *

urlpatterns = [
    path('attendence/', report_attendence_view, name = 'report_attendence_api'),
    path('customerproduct/', report_customer_product, name = 'report_customerproduct_api'),
    path('purchases/', report_purchase_view, name = 'report_product_api'),
    path('memberships/', report_membership_view, name = 'report_membership_api'),
    path('sales/', report_sales_view, name='report_sale_api'),
    path('employees/',report_employees_view, name='report_employees_api')
]