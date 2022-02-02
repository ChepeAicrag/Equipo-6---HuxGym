from django.urls import path
from API.customers.api.api import *

urlpatterns = [
    path('customers/', customer_api_view, name = 'customers_api'),
    path('customers/<int:pk>/', customer_detail_api_view, name = 'customer_detail_api_view'),
    path('attendance/', attendance_api_view, name = 'attendance_api'),
    path('attendance/<int:pk>/', attendance_detail_api_view, name = 'attendance_detail_api_view'),
    path('nutritionalSituation/', nutritionalSituation_api_view, name = 'nutritionalSituation_api'),
    path('nutritionalSituation/<int:pk>/', nutritionalSituation_detail_api_view, name = 'nutritionalSituation_detail_api_view'),
    path('typeExtraInformation/', typeExtraInformation_api_view, name = 'typeExtraInformation_api'),
    path('typeExtraInformation/<int:pk>/', typeExtraInformation_detail_api_view, name = 'typeExtraInformation_detail_api_view'),
    path('bodyAttribute/', bodyAttribute_api_view, name = 'bodyAttribute_api'),
    path('bodyAttribute/<int:pk>/', bodyAttribute_detail_api_view, name = 'bodyAttribute_detail_api_view'),
    path('historyClinic/', historyClinic_api_view, name = 'historyClinic_api'),
    path('historyClinic/<int:pk>/', historyClinic_detail_api_view, name = 'historyClinic_detail_api_view'),
    path('typeExtraInformation_HistoryClinic/', typeExtraInformation_HistoryClinic_api_view, name = 'typeExtraInformation_HistoryClinic_api'),
    path('typeExtraInformation_HistoryClinic/<int:pk>/', typeExtraInformation_HistoryClinic_detail_api_view, name = 'typeExtraInformation_HistoryClinic_detail_api_view'),
    path('bodyAttribute_HistoryClinic/', bodyAttribute_HistoryClinic_api_view, name = 'bodyAttribute_HistoryClinic_api'),
    path('bodyAttribute_HistoryClinic/<int:pk>/', bodyAttribute_HistoryClinic_detail_api_view, name = 'bodyAttribute_HistoryClinic_detail_api_view'),
    path('attendance/check_out/<int:id>', registrarCheckOut, name = 'registroCheckOut'),
    path('customer_membership/', customer_membership_api_view, name = 'customer_memberships'),
    path('customer_membership/<int:pk>/', customer_membership_detail_api_view, name = 'customer_memberships_detail_api_view'),
    path('clientesActuales/', clientesActuales, name = 'clientes_actuales'),
    path('historiasClinicasCliente/<int:pk>', historiasClinicasCliente, name = 'Historias_clínicas_de_un_cliente'),
    path('atributosHistoriaClinica/<int:pk>', obtenerAtributosDeCuerpo, name = 'Atributos_de_cuerpo_de_historia'),
    path('infoExtraHistoriaClinica/<int:pk>', obtenerInformaciónExtra, name = 'Info_Extra_de_historia')
]