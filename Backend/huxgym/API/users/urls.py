from django.urls import path
from . import views

urlpatterns = [
    path('', views.CrearListarUser.as_view()),
    path('<int:id>/', views.ActualizarListarEliminarUserById.as_view()),
    path('attendance/checkin/', views.CheckInUser.as_view()),
    path('attendance/checkout/', views.CheckOutUser.as_view()),
    path('cash-register/open/', views.OpenCashRegister.as_view()),
    path('cash-register/close/', views.ClosedCashRegister.as_view()),
    path('cash-register/', views.ListCashRegisterOpen.as_view()),
    path('cash-closings/', views.ListAllCashRegister.as_view()),
    path('cash-closings/<int:id_employee>/<int:id_cash_register>/',
         views.ListUpdateDeleteCashRegister.as_view()),
    path('profile/', views.Profile.as_view())
]
