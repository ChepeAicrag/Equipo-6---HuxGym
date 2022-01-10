from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.products.api.api import ProductViewSet, CatergoryViewSet, StockViewSet, ProviderViewSet, \
                                    HistoryInventoryViewSet, OperationViewSet, OperationTypeViewSet


router = DefaultRouter()

router.register(r'productsDoc',ProductViewSet)
router.register(r'categoryDoc',CatergoryViewSet)
router.register(r'stockDoc',StockViewSet)
router.register(r'providerDoc',ProviderViewSet)
router.register(r'historyInventoryDoc',HistoryInventoryViewSet)
router.register(r'operationDoc',OperationViewSet)
router.register(r'operationTypeDoc',OperationTypeViewSet)

urlpatterns = router.urls 