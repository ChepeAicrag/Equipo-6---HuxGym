from django.urls import path
from API.memberships.api.api import *

urlpatterns = [
    path('memberships/', membership_api_view, name = 'memberships_api'),
    path('memberships/<int:pk>/', membership_detail_api_view, name = 'memberships_detail_api')
]