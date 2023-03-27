from django.urls import path
from rest_framework import routers
from django.views.decorators.csrf import csrf_exempt
from .views import *

app_name = "Account"
router = routers.DefaultRouter()
urlpatterns = [
    path('register/', RegisterAPI.as_view()),
    path('login/', csrf_exempt(LoginView.as_view())),
    path('forgot-password/', ForgotPasswordView.as_view()),
    path('change-password/', ChangePasswordView.as_view()),
    path('verify-email/', VerifyOTP.as_view()),
]
urlpatterns += router.urls
