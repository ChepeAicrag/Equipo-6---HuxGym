from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.Login.as_view()),
    path('logout/', views.Logout.as_view()),
    path('refresh-token/', views.RefreshToken.as_view()),
    path('activate-account/<str:uidb64>/<str:token>/', views.ActivateAccount.as_view()),
    path('restore-password/', views.RestorePassword.as_view()),
    path('change-password/', views.ChangePassword.as_view()),
    path('confirm-password/<str:uidb64>/<str:token>/<str:password>/', views.ConfirmPassword.as_view()),
    path('role/', views.ListRole.as_view()),
    path('state/', views.ListStates.as_view()),
    path('data_curp/', views.GetDataWithCurp.as_view()),
]