from django.db import router
from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.general.views import RoleViewSet, RoleModuleViewSet

router = DefaultRouter()

router.register(r'role', RoleViewSet,)
router.register(r'roleModule', RoleModuleViewSet,)

urlpatterns = router.urls