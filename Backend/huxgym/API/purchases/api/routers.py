from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.purchases.api.api import PurchaseViewSet, Purchase_Details_ProductViewSet


router = DefaultRouter()

router.register(r'purchse',PurchaseViewSet)
router.register(r'purchaseProduct',Purchase_Details_ProductViewSet)

urlpatterns = router.urls 