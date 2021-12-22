from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.memberships.api.api import MembershipViewSet

router = DefaultRouter()

router.register(r'memberships', MembershipViewSet, )

urlpatterns = router.urls