from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.sales.views import SaleViewSet, SaleDetailsProductViewSet, SaleDetailsMembershipViewSet


router = DefaultRouter()

router.register(r'saleDoc',SaleViewSet)
router.register(r'saleDetailsProductDoc',SaleDetailsProductViewSet)
router.register(r'saleDetailsMembershipProductDoc',SaleDetailsMembershipViewSet)

urlpatterns = router.urls 