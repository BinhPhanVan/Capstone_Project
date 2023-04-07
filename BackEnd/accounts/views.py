from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import UserManager
from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.views import APIView
# Create your views here.
from accounts.serializers import UserSerializer, VertifyEmailSerializer, LoginSerializer, \
    MyTokenObtainPairSerializer, ForgotPassWordSerializer, ChangePasswordSerializer
from .email import send_opt_via_email, send_reset_password
from .utils import check_pass, same_pass
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterAPI(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = UserSerializer(data=data)
            if serializer.is_valid():
                account = User(**serializer.data)
                account.password = make_password(serializer.data['password'])
                account.first_name = request.data["first_name"]
                account.last_name = request.data["last_name"]
                account.save()
                send_opt_via_email(serializer.data['email'])
                return Response({
                    'status': status.HTTP_200_OK,
                    'message': 'Register successfully. Please check your email',
                    'data': serializer.data,
                })
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Data invalid. Please enter again',
                'data': serializer.errors
            })
        except Exception as e:
            print(e)


class VerifyOTP(APIView):
    @swagger_auto_schema(
        request_body=VertifyEmailSerializer,  # Specify the serializer used for request data
        responses={
            status.HTTP_202_ACCEPTED: "Register successful!",  # Add response description
            status.HTTP_400_BAD_REQUEST: "Invalid data. Please enter again",  # Add response description
        },
    )
    def post(self, request):
        try:
            data = request.data
            serializer = VertifyEmailSerializer(data=data)
            if serializer.is_valid():
                email = serializer.data['email']
                otp = serializer.data['otp']
                user = User.objects.get(email=email)
                if not user:
                    return Response({
                        'status': status.HTTP_400_BAD_REQUEST,
                        'message': 'Invalid Email. Please enter again',
                        'data': serializer.errors
                    })
                if user.otp != otp:
                    return Response({
                        'status': status.HTTP_400_BAD_REQUEST,
                        'message': 'Invalid OTP. Please enter again',
                        'data': serializer.errors
                    })
                user.is_verified = True
                user.save()
                refresh = MyTokenObtainPairSerializer.get_token(user)
                return Response({
                    'status': status.HTTP_202_ACCEPTED,
                    'message': 'Register successful!',
                    'data': {
                        'email': user.email,
                        'refresh_token': str(refresh),
                        'access_token': str(refresh.access_token),
                    }
                })

            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Invalid data. Please enter again',
                'data': serializer.errors
            })
        except Exception as e:
            print(e)


class LoginView(APIView):
    @swagger_auto_schema(
        request_body=LoginSerializer,  # Specify the serializer used for request data
        responses={
            status.HTTP_202_ACCEPTED: "Login successful",  # Add response description
            status.HTTP_400_BAD_REQUEST: "Invalid password",  # Add response description
            status.HTTP_401_UNAUTHORIZED: "Account is not verified. Please try again",  # Add response description
        },
    )
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = LoginSerializer(data=data)
            if serializer.is_valid():
                email = serializer.data['email']
                password = serializer.data['password']
                user = authenticate(request, email=email, password=password)
                if user is None:
                    return Response({
                        'status': status.HTTP_400_BAD_REQUEST,
                        'message': 'Invalid password',
                        'data': {}
                    })
                if user.is_verified is False:
                    return Response({
                        'status': status.HTTP_401_UNAUTHORIZED,
                        'message': 'Account is not verified. Please try again',
                        'data': {}
                    })
                refresh = MyTokenObtainPairSerializer.get_token(user)
                response = {
                    "status": status.HTTP_202_ACCEPTED,
                    "message": "Login successful",
                    "data": {
                        'email': user.email,
                        'refresh_token': str(refresh),
                        'access_token': str(refresh.access_token),
                    },
                }
                return Response(response, status=status.HTTP_202_ACCEPTED)
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Invalid data. Please enter again',
                'data': {}
            })
        except Exception as e:
            print(e)


class ForgotPasswordView(APIView):
    @swagger_auto_schema(
        request_body=ForgotPassWordSerializer,  # Specify the serializer used for request data
        responses={
            status.HTTP_205_RESET_CONTENT: "Please check your email for a new password.",  # Add response description
            status.HTTP_400_BAD_REQUEST: "Invalid data. Please enter again",  # Add response description
        },
    )
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = ForgotPassWordSerializer(data=data)
            if serializer.is_valid():
                email = serializer.data['email']
                send_reset_password(email)
                return Response({
                    'status': status.HTTP_205_RESET_CONTENT,
                    'message': 'Please check your email for a new password.',
                    'data': {}
                })
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Invalid data. Please enter again',
                'data': {}
            })
        except Exception as e:
            print(e)


class ChangePasswordView(GenericAPIView):
    serializer_class = ForgotPassWordSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        try:
            serializer = ChangePasswordSerializer(data=request.data)
            if serializer.is_valid():
                old_password = request.data["old_password"]
                new_password = request.data["new_password"]
                repeat_password = request.data["repeat_new_password"]
                if request.user.check_password(old_password):
                    if check_pass(new_password):
                        if same_pass(new_password, repeat_password):
                            request.user.set_password(new_password)
                            request.user.save()
                            return Response({
                                'status': status.HTTP_201_CREATED,
                                'message': 'Change password successfully!',
                                'data': {}
                            })
                        else:
                            message = "Passwords do not match!"
                    else:
                        message = "Password minimum 8 characters!"
                else:
                    message = "Old password is incorrect"
            else:
                message = "Invalid data!"
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': message,
                'data': {}
            })
        except Exception as e:
            print(e)
