from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.products.api.api import ProductViewSet, CatergoryViewSet, StockViewSet, ProviderViewSet, \
                                    HistoryInventoryViewSet, OperationViewSet, OperationTypeViewSet


router = DefaultRouter()

router.register(r'products',ProductViewSet)
router.register(r'category',CatergoryViewSet)
router.register(r'stock',StockViewSet)
router.register(r'provider',ProviderViewSet)
router.register(r'historyInventory',HistoryInventoryViewSet)
router.register(r'operation',OperationViewSet)
router.register(r'operationType',OperationTypeViewSet)

urlpatterns = router.urls