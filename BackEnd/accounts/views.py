import email
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import UserManager
from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets, generics
from rest_framework.views import APIView
from django.conf import settings
from rest_framework import authentication, permissions
# Create your views here.
from accounts.serializers import UserSerializer, VertifyEmailSerializer, LoginSerializer, \
    MyTokenObtainPairSerializer, ForgotPassWordSerializer, ChangePasswordSerializer
from .email import send_opt_via_email, send_reset_password
from .permissions import IsEmployeePermission, IsRecruiterPermission
from .serializers import EmployeeSerializer, PDFFileSerializer, RecruiterSerializer
from .utils import check_pass, same_pass
from .models import Recruiter, User, Employee
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        try:
            if not User.objects.filter(email=request.data.get('email')).exists():
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    account = serializer.save()
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
            else:
                return Response({
                    'status': status.HTTP_400_BAD_REQUEST,
                    'message': 'This account already exists',
                    'data': {}
                })
        except Exception as e:
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Data invalid. Please enter again',
                'data': serializer.errors
            })


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
                        'access_expires': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                        'refresh_expires': int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
                    }
                })

            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Invalid data. Please enter again',
                'data': serializer.errors
            })
        except Exception as e:
            print(e)
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Invalid data. Please enter again',
                'data': serializer.errors
            })
            


class LoginView(APIView):
    @swagger_auto_schema(
        request_body=LoginSerializer,  # Specify the serializer used for request data
        responses={
            status.HTTP_202_ACCEPTED: "Login successful",  # Add response description
            status.HTTP_400_BAD_REQUEST: "Invalid password",  # Add response description
            status.HTTP_406_NOT_ACCEPTABLE: "Account is not verified. Please try again",  # Add response description
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
                        'status': status.HTTP_406_NOT_ACCEPTABLE,
                        'message': 'Account is not verified. Please try again',
                        'data': {'email': user.email}
                    })
                serializer_token = MyTokenObtainPairSerializer.get_token(user)
                response = {
                    "status": status.HTTP_202_ACCEPTED,
                    "message": "Login successful",
                    "data": {
                        'email': user.email,
                        'refresh_token': str(serializer_token),
                        'access_token': str(serializer_token.access_token),
                        'access_expires': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                        'refresh_expires': int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
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
            return Response({
                'status': status.HTTP_400_BAD_REQUEST,
                'message': 'Invalid data. Please enter again',
                'data': {}
            })


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
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Refresh Failed",
                "data": {
                },
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


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
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Refresh Failed",
                "data": {
                },
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class Logout(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        logout(request)
        response = {
            "status": status.HTTP_200_OK,
            "data": "Logout successfully",
            "detail": None
        }
        return Response(response, status=status.HTTP_200_OK)

from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

class MyTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try: 
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            refresh = RefreshToken(request.data.get('refresh'))
            response = {
                "status": status.HTTP_200_OK,
                "message": "Refresh successful",
                "data": {
                    'refresh_token': str(refresh),
                    'access_token': str(refresh.access_token),
                    'access_expires': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                    'refresh_expires': int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
                },
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Refresh Failed",
                "data": {
                },
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.select_related('account')
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    serializer_class = EmployeeSerializer

from rest_framework.parsers import MultiPartParser, FormParser
import cloudinary.uploader

class UploadPDFView(APIView):
    queryset = Employee.objects.select_related('account')
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    @swagger_auto_schema(
        request_body=PDFFileSerializer,
        operation_description="Upload a PDF file",
        responses={
            200: "{'url': 'https://cloudinary.com/your_url'}",
            400: "{'error': 'Invalid file format'}",
        },
    )
    def post(self, request, *args, **kwargs):
        try:
            if 'pdf_file' not in request.FILES:
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "No PDF file uploaded",
                    "data": {},
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            pdf_file = request.FILES['pdf_file']
            if pdf_file.name == '':
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Empty filename",
                    "data": {},
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            if not pdf_file.name.endswith('.pdf'):
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Invalid file format",
                    "data": {},
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            employee = Employee.objects.get(account_id=request.user.id)
            uploaded_file = cloudinary.uploader.upload(pdf_file, access_mode="public")
            print(uploaded_file['secure_url'])
            # return Response({'url': uploaded_file['secure_url']}, status=200)
            employee.pdf_file = uploaded_file['secure_url']
            employee.save()
            response = {
                    "status": status.HTTP_200_OK,
                    "message": "Upload sucessfully",
                    "data": {},
                }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Upload Failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED) 

class GetInformation(generics.GenericAPIView):
    serializer_class_map = {
        'GET': {
            'employee': EmployeeSerializer,
            'recruiter': RecruiterSerializer,
        }
    }
    queryset_map = {
        'employee': Employee.objects.all(),
        'recruiter': Recruiter.objects.all(),
    }

    permission_classes_map = {
        'GET': {
            'employee': [IsAuthenticated, IsEmployeePermission],
            'recruiter': [IsAuthenticated, IsRecruiterPermission],
        }
    }

    def get_permissions(self):
        user_type = 'employee' if self.request.user.role == 1 else 'recruiter'
        permission_classes = self.permission_classes_map.get(self.request.method, {}).get(user_type, [])
        return [permission() for permission in permission_classes]

    def get(self, request, *args, **kwargs):
        try:
            user_type = 'employee' if request.user.role == 1 else 'recruiter'
            model = Employee if request.user.role == 1 else Recruiter
            queryset = self.queryset_map[user_type]
            obj = get_object_or_404(queryset, account_id=request.user.id)
            serializer_class = self.serializer_class_map['GET'][user_type]
            serializer = serializer_class(instance=obj)
            response = {
                "status": status.HTTP_200_OK,
                "message": "Successfully",
                "data": serializer.data,
            } 
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Get Information Failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED) 
