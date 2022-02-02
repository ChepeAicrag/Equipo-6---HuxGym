from django.urls import path
from API.purchases.api.api import *

urlpatterns = [
    path('purchase/', purchase_api_view, name = 'purchase_api'),
    path('purchase/<int:pk>', purchase_detail_api_view, name = 'purchase_api_detail'),
    path('purchaseProduct/', purchaseProduct_api_view, name = 'purchaseProduct_api'),
    path('purchaseProduct/<int:pk>', purchaseProduct_detail_api_view, name = 'purchaseProduct_api_detail'),
    path('realizarCompra/', realizarCompra.as_view(), name = 'realizarCompra'),
    path('obtenerDetallesCompra/<int:pk>', obtenerDetallesCompra, name = 'Obtener detalles'),
    path('obtenerComprasHechasAdmin/<int:pk>', obtenerComprasHechasAdmin),
    path('obtenerComprasHechasUsuario/', obtenerComprasHechasUsuario.as_view()),
    path('obtenerCompras/', obtenerCompras.as_view())
]