from django.urls import path
from rest_framework import routers
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.views import TokenRefreshView

from .views import *

app_name = "Account"
router = routers.DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'employee/register', RegisterViewSet, basename='user/register')
urlpatterns = [
    path('api/token/', csrf_exempt(MyTokenObtainPairView.as_view()), name='token_obtain_pair'),
    path('api/token/refresh/', csrf_exempt(TokenRefreshView.as_view()), name='token_refresh'),
    path('employee/login/', csrf_exempt(LoginView.as_view()), name='login'),
    path('employee/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('employee/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('employee/verify-email/', VerifyOTP.as_view(), name='verify-email'),
    path("employee/logout/", Logout.as_view(), name="logout"),
]
urlpatterns += router.urls
