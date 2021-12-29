from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.customers.api.api import CustomerViewSet, AttendanceViewSet,\
                                 NutritionalSituationViewSet,TypeExtraInformationViewSet, \
                                BodyAttributeViewSet, HistoryClinicViewSet, TypeExtraInformation_HistoryClinicViewSet, \
                                BodyAttribute_HistoryClinicViewSet, Customer_MembershipViewSet



router = DefaultRouter()

router.register(r'customers', CustomerViewSet, )
router.register(r'attendance', AttendanceViewSet, )
router.register(r'nutritionalSituation', NutritionalSituationViewSet, )
router.register(r'typeExtraInformation', TypeExtraInformationViewSet, )
router.register(r'bodyAttribute', BodyAttributeViewSet, )
router.register(r'historyClinic', HistoryClinicViewSet, )
router.register(r'typeExtraInformation_HistoryClinic', TypeExtraInformation_HistoryClinicViewSet, )
router.register(r'bodyAttribute_HistoryClinic', BodyAttribute_HistoryClinicViewSet, )
router.register(r'Customer_Membership', Customer_MembershipViewSet, )

urlpatterns = router.urls