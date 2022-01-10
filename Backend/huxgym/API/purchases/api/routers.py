from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.purchases.api.api import PurchaseViewSet, Purchase_Details_ProductViewSet


router = DefaultRouter()

router.register(r'purchseDoc',PurchaseViewSet)
router.register(r'purchaseProductDoc',Purchase_Details_ProductViewSet)

urlpatterns = router.urls 