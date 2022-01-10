from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from API.customers.api.api import CustomerViewSet, AttendanceViewSet,\
                                 NutritionalSituationViewSet,TypeExtraInformationViewSet, \
                                BodyAttributeViewSet, HistoryClinicViewSet, TypeExtraInformation_HistoryClinicViewSet, \
                                BodyAttribute_HistoryClinicViewSet, Customer_MembershipViewSet



router = DefaultRouter()

router.register(r'customersDoc', CustomerViewSet, )
router.register(r'attendanceDoc', AttendanceViewSet, )
router.register(r'nutritionalSituationDoc', NutritionalSituationViewSet, )
router.register(r'typeExtraInformationDoc', TypeExtraInformationViewSet, )
router.register(r'bodyAttributeDoc', BodyAttributeViewSet, )
router.register(r'historyClinicDoc', HistoryClinicViewSet, )
router.register(r'typeExtraInformation_HistoryClinicDoc', TypeExtraInformation_HistoryClinicViewSet, )
router.register(r'bodyAttribute_HistoryClinicDoc', BodyAttribute_HistoryClinicViewSet, )
router.register(r'Customer_MembershipDoc', Customer_MembershipViewSet, )

urlpatterns = router.urls