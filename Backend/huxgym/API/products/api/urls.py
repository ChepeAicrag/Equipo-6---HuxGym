from django.urls import path
from API.products.api.api import *

urlpatterns = [
    path('products/', product_api_view, name = 'products_api'),
    path('products/<int:pk>', product_detail_api_view, name = 'products_detail_api'),
    path('category/', category_api_view, name = 'category_api'),
    path('category/<int:pk>', category_detail_api_view, name = 'category_detail_api'),
    path('stock/', stock_api_view, name = 'stock_api'),
    path('stock/<int:pk>', stock_detail_api_view, name = 'stock_detail_api'),
    path('provider/', provider_api_view, name = 'provider_api'),
    path('provider/<int:pk>', provider_detail_api_view, name = 'provider_detail_api'),
    path('historyInventory/', historyInventory_api_view, name = 'historyInventory_api'),
    path('historyInventory/<int:pk>', historyInventory_detail_api_view, name = 'historyInventory_detail_api'),
    path('operation/', operation_api_view, name = 'operation_api'),
    path('operation/<int:pk>', operation_detail_api_view, name = 'operation_detail_api'),
    path('operationType/', operationType_api_view, name = 'operationType_api'),
    path('operationType/<int:pk>', operationType_detail_api_view, name = 'operationType_detail_api'),
    path('anadirStock/<int:pk>', anadirStock, name = 'añadir_stock'),
    path('restarStock/<int:pk>', restarStock, name = 'restar_stock'),
    path('productosPorProveedor/<int:pk>', productosPorProveedor),
    path('stockDeProducto/<int:pk>', stockDeProducto)

]