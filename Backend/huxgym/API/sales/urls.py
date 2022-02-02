from django.urls import path
from . import views

urlpatterns = [
    path('', views.CreateListSale.as_view()),
    path('<int:id>/', views.ListUpdateDeleteSaleLogueado.as_view()),
    path('<int:id_employee>/<int:id_sale>/', views.ListUpdateDeleteSaleAdmin.as_view())
]