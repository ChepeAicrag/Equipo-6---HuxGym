from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.sales.views import SaleViewSet, SaleDetailsProductViewSet, SaleDetailsMembershipViewSet


router = DefaultRouter()

router.register(r'sale',SaleViewSet)
router.register(r'saleDetailsProduct',SaleDetailsProductViewSet)
router.register(r'saleDetailsMembershipProduct',SaleDetailsMembershipViewSet)

urlpatterns = router.urls 