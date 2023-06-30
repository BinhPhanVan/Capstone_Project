import email
import threading
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
from rest_framework.decorators import action
from datetime import datetime
# Create your views here.
from accounts.serializers import UserSerializer, VertifyEmailSerializer, LoginSerializer, \
    MyTokenObtainPairSerializer, ForgotPassWordSerializer, ChangePasswordSerializer
from .email import send_email_with_cv, send_email_with_interview, send_email_with_job, send_opt_via_email, send_reset_password, send_email_with_template
from .permissions import IsEmployeePermission, IsRecruiterPermission
from .serializers import EmailCVSerializer, EmailJobSerializer, EmployeeSerializer, ExtractCVCreateSerializer, ExtractCVGetAll, InterviewAllSerializer, InterviewListSerializer, InterviewStatuserializer, JobRequirementGetAll, JobRequirementSerializer, PDFFileSerializer, RecruiterRegisterSerializer, RecruiterSerializer, UserRegisterSerializer, DeactivedJobSerializer, InterviewSerializer, InterviewUpdateSerializer
from .utils import check_pass, extract_location, extract_phone_number, extract_skills, extract_text_from_pdf, same_pass
from .models import ExtractCV, JobRequirement, Recruiter, User, Employee, Interview
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from django.db.models import Q


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        try:
            if not User.objects.filter(email=request.data.get('email')).exists():
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    account = serializer.save()
                    # send_email_with_template(serializer.data['email'])
                    email_thread = threading.Thread(target=send_email_with_template, args=(serializer.data['email']))
                    email_thread.start()
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

class RecruiterRegisterViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Recruiter.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RecruiterRegisterSerializer

    def create(self, request, *args, **kwargs):
        try:
            user = request.data.get('account')
            if not User.objects.filter(email=user['email']).exists():
                serializer = self.get_serializer(data=request.data)
                if serializer.is_valid(raise_exception=True):
                    account = serializer.save()
                    send_email_with_template(user['email'])
                    serialized_user = UserRegisterSerializer(data=user)
                    return Response({
                        'status': status.HTTP_200_OK,
                        'message': 'Register successfully. Please check your email',
                        'data': user
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
                    'message': 'Register successfully!',
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
            if ExtractCV.objects.filter(employee=employee).exists():
                extract_cv = ExtractCV.objects.get(employee=employee)
                extract_cv.active = False
                extract_cv.save()
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
    
    def get_serializer_class(self):
        user_type = 'employee' if self.request.user.role == 1 else 'recruiter'
        return self.serializer_class_map.get(self.request.method, {}).get(user_type)

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

class ExtractCVView(GenericAPIView):
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    serializer_class = EmployeeSerializer
    def get(self, request, *args, **kwargs):
        try:
            user_id = request.user.id
            employee = Employee.objects.get(account_id = user_id)
            text = extract_text_from_pdf(employee.pdf_file)
            location = extract_location(text)
            phone_numbers = extract_phone_number(text)
            phone_number = phone_numbers[0] if phone_numbers else None
            skills = extract_skills(text)
            response = {
                "status": status.HTTP_200_OK,
                "message": "Extract sucessfully.",
                "data": {
                    'location': location,
                    'phone_number': phone_number,
                    'skills': skills 
                },
            } 
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Turned on Failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)

class ExtractCVCreateView(generics.GenericAPIView):
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    serializer_class = ExtractCVCreateSerializer
    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user_id = request.user.id
            employee = Employee.objects.get(account_id=user_id)

            data = serializer.validated_data
            location = data.get('location')
            phone_number = data.get('phone_number')
            skills = data.get('skills')

            if ExtractCV.objects.filter(employee=employee).exists():
                extract_cv = ExtractCV.objects.get(employee=employee)
                extract_cv.phone_number = phone_number
                extract_cv.location = location
                extract_cv.skills = skills
                extract_cv.active = True
                extract_cv.save()
            else:
                extract_cv = ExtractCV.objects.create(
                    employee=employee,
                    phone_number=phone_number,
                    location=location,
                    skills=skills
                )

            response = {
                "status": status.HTTP_200_OK,
                "message": "Turned on successfully.",
                "data": {
                    'location': location,
                    'phone_number': phone_number,
                    'skills': skills 
                },
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Turned on Failed",
                "data": {},
            }
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)

class GetActiveCVView(GenericAPIView):
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    serializer_class = EmployeeSerializer

    def get(self, request, *args, **kwargs):
        try:
            user_id = request.user.id
            employee = Employee.objects.get(account_id=user_id)

            try:
                extract_cv = ExtractCV.objects.get(employee=employee)
                response = {
                    "status": status.HTTP_200_OK,
                    "message": "Success",
                    "data": extract_cv.active,
                }
            except ExtractCV.DoesNotExist:
                response = {
                    "status": status.HTTP_200_OK,
                    "message": "Success",
                    "data": False,
                }
            
            return Response(response, status=status.HTTP_200_OK)
        
        except Employee.DoesNotExist:
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Employee not found",
                "data": {},
            }
        
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Internal Server Error",
                "data": {},
            }
        
        return Response(response, status=response["status"])

class UploadJobView(generics.GenericAPIView):
    serializer_class = JobRequirementSerializer
    permission_classes = [IsRecruiterPermission, IsAuthenticated]
    @swagger_auto_schema(
        request_body=JobRequirementSerializer,
        operation_description="Create a job requirement",
        responses={
            201: JobRequirementSerializer,
            400: "{'error': 'Bad request'}",
            401: "{'error': 'Unauthorized'}",
        },
    )
    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                location = request.data['location']
                job_name = request.data['job_name']
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
                user_id = request.user.id
                recruiter = Recruiter.objects.get(account_id = user_id)
                uploaded_file = cloudinary.uploader.upload(pdf_file, access_mode="public")
                text = extract_text_from_pdf(uploaded_file['secure_url'])
                skills = extract_skills(text)
                job_req = JobRequirement.objects.create(
                        recruiter=recruiter,
                        job_name=job_name,
                        location=location,
                        skills=skills,
                        active=True,
                        pdf_upload=uploaded_file['secure_url']
                    )
                job_req.save()
                response = {
                    "status": status.HTTP_201_CREATED,
                    "message": "Create job successfully",
                    "data": serializer.data,
                }
                return Response(response, status=status.HTTP_201_CREATED)
            else:
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Create job failed",
                    "data": serializer.errors,
                }
                return Response(response, status= status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Create job Failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)

        
class DeactivePDFView(APIView):
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    def get(self, request):
        try:
            employee = Employee.objects.get(account_id=request.user.id)
            extract_cv = ExtractCV.objects.get(employee=employee)
            extract_cv.active = False
            extract_cv.save()
            response = {
                    "status": status.HTTP_200_OK,
                    "message": "Your resume deactivated successfully.",
                    "data": {},
                }
            return Response(response, status=status.HTTP_200_OK)
        except ExtractCV.DoesNotExist:
            response = {
                    "status": status.HTTP_404_NOT_FOUND,
                    "message": "Your resume not found.",
                    "data": {},
                }
            return Response(response, status=status.HTTP_404_NOT_FOUND)


class JobRequirementListAPIView(APIView):
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    def get(self, request, format=None):
        try: 
            user_id = request.user.id
            cv = ExtractCV.objects.get(employee__account_id=user_id)
            cv_skill = cv.skills
            job_requirements = JobRequirement.objects.filter(active=True)
            list_overlap = []
            for job_requirement in job_requirements:
                job_skills = job_requirement.skills
                common_skills =  set(cv_skill.split(", ")).intersection(set(job_skills.split(", ")))
                overlap_percentage = (len(common_skills) / len(set(cv_skill.split(", ")))) * 100
                list_overlap.append(overlap_percentage)
            combined_data = zip(job_requirements, list_overlap)
            sorted_data = sorted(combined_data, key=lambda x: x[1], reverse=True)
            sorted_job_requirements, sorted_list_overlap = zip(*sorted_data)
            serializer = JobRequirementGetAll(sorted_job_requirements, many=True)
            response = {
                "status": status.HTTP_200_OK,
                "message": "Get all jobs successfully",
                "data": serializer.data,
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Get all jobs failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class GetAllCandidateListAPIView(APIView):
    permission_classes = [IsRecruiterPermission, IsAuthenticated]
    def get(self, request, format=None):
        try: 
            user_id = request.user.id
            all_jobs_active = JobRequirement.objects.filter(recruiter__account_id=user_id, active=True)
            all_candidates = ExtractCV.objects.filter(active=True)
            skills_of_company = []
            list_overlap = []
            for job in all_jobs_active:
                skills_of_company+=(job.skills.split(", "))
            
            for candidate in all_candidates:
                candidate_skills = candidate.skills
                common_skills =  set(candidate_skills.split(", ")).intersection(set(skills_of_company))
                overlap_percentage = (len(common_skills) / len(set(skills_of_company))) * 100
                list_overlap.append(overlap_percentage)

            combined_data = zip(all_candidates, list_overlap)
            sorted_data = sorted(combined_data, key=lambda x: x[1], reverse=True)
            sorted_all_candidates, sorted_list_overlap = zip(*sorted_data)
            serializer = ExtractCVGetAll(sorted_all_candidates, many=True)
            response = {
                "status": status.HTTP_200_OK,
                "message": "Get all candidates successfully",
                "data": serializer.data,
            }
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Get all candidates failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)
    
class JobOwnerView(GenericAPIView):
    permission_classes = [IsRecruiterPermission, IsAuthenticated]
    serializer_class = JobRequirementGetAll

    def get(self, request, *args, **kwargs):
        try:
            user_id = request.user.id
            recruiter = Recruiter.objects.get(account_id=user_id)
            job_requirements = JobRequirement.objects.filter(recruiter=recruiter)
            
            serializer = self.get_serializer(job_requirements, many=True)
            response_data = serializer.data
            response = {
                "status": status.HTTP_200_OK,
                "message": "Success",
                "data": response_data,
            }
            
            return Response(response, status=status.HTTP_200_OK)
        
        except Recruiter.DoesNotExist:
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Recruiter not found",
                "data": [],
            }
        
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Internal Server Error",
                "data": [],
            }
        
        return Response(response, status=response["status"])

class DeleteJobView(viewsets.ModelViewSet):
    permission_classes = [IsRecruiterPermission, IsAuthenticated]
    queryset = JobRequirement.objects.all()
    serializer_class = DeactivedJobSerializer
    def update(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                job_requirement_id = serializer.data['job_requirement_id']
                job_requirement = JobRequirement.objects.get(id = job_requirement_id)
                job_requirement.active = not job_requirement.active
                job_requirement.save()
                response = {
                    "status": status.HTTP_200_OK,
                    "message": "Updated successfully",
                    "data": job_requirement_id,
                }
                return Response(response, status=status.HTTP_200_OK)
            else:
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Updated failed",
                    "data": serializer.errors,
                }
                return Response(response, status= status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Updated Failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED) 

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            job_requirement_id = instance.id
            self.perform_destroy(instance)
            response = {
                "status": status.HTTP_204_NO_CONTENT,
                "message": "Deleted successfully",
                "data": job_requirement_id,
            }
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(e)
            response = {
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Deleted Failed",
                "data": {},
            } 
            return Response(response, status=status.HTTP_401_UNAUTHORIZED)
    
class EmailCVView(APIView):
    permission_classes = [IsEmployeePermission, IsAuthenticated]
    serializer_class = EmailCVSerializer
    @swagger_auto_schema(
        request_body=EmailCVSerializer,
        operation_description="Send email with CV",
        responses={
            200: "Email sent successfully",
            401: "Unauthorized",
        }
    )
    def post(self, request):
        serializer = EmailCVSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            job_name = serializer.validated_data['job_name']
            company_name = serializer.validated_data['company_name']
            pdf_file = serializer.validated_data['pdf_file']
            name = serializer.validated_data['name']
            email_user = serializer.validated_data['email_user']
            try:
                # send_email_with_cv(email, job_name, company_name, pdf_file, name, email_user)
                email_thread = threading.Thread(target=send_email_with_cv, args=(email, job_name, company_name, pdf_file, name, email_user))
                email_thread.start()
                response = {
                    "status": status.HTTP_200_OK,
                    "message": "Email sent successfully.",
                    "data": {},
                }
                return Response(response, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                response = {
                    "status": status.HTTP_401_UNAUTHORIZED,
                    "message": "Email sent failed",
                    "data": {},
                } 
                return Response(response, status=status.HTTP_401_UNAUTHORIZED)
        response = {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Email sent failed",
            "data": {},
        } 
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)

class EmailJobView(APIView):
    permission_classes = [IsRecruiterPermission, IsAuthenticated]
    serializer_class = EmailJobSerializer

    @swagger_auto_schema(
        request_body=EmailJobSerializer,
        operation_description="Send email with Job",
        responses={
            200: "Email sent successfully",
            401: "Unauthorized",
        }
    )
    def post(self, request):
        serializer = EmailJobSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            name_candidate = serializer.validated_data['name_candidate']
            job_name = serializer.validated_data['job_name']
            pdf_upload = serializer.validated_data['pdf_upload']
            company_name = serializer.validated_data['company_name']
            name = serializer.validated_data['name']
            email_user = serializer.validated_data['email_user']
            try:
                # send_email_with_job(email, name_candidate, job_name, pdf_upload, company_name, name, email_user)
                email_thread = threading.Thread(target=send_email_with_job, args=(email, name_candidate, job_name, pdf_upload, company_name, name, email_user))
                email_thread.start()
                response = {
                    "status": status.HTTP_200_OK,
                    "message": "Email sent successfully.",
                    "data": {},
                }
                return Response(response, status=status.HTTP_200_OK)
            except Exception as e:
                print(e)
                response = {
                    "status": status.HTTP_401_UNAUTHORIZED,
                    "message": "Email sent failed",
                    "data": {},
                }
                return Response(response, status=status.HTTP_401_UNAUTHORIZED)
        response = {
            "status": status.HTTP_401_UNAUTHORIZED,
            "message": "Email sent failed",
            "data": {},
        }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)


class InterviewCreateAPIView(GenericAPIView):

    serializer_class = InterviewSerializer
    permission_classes = [IsRecruiterPermission, IsAuthenticated]

    @swagger_auto_schema(request_body=InterviewSerializer)
    def post(self, request):
        serializer = InterviewSerializer(data=request.data)
        if serializer.is_valid():
            employee_email = serializer.data["employee_email"]
            recruiter_email = serializer.data["recruiter_email"]
            hour_start = serializer.data["hour_start"]
            minute_start = serializer.data["minute_start"]
            hour_end = serializer.data["hour_end"]
            minute_end = serializer.data["minute_end"]
            date = serializer.data["date"]
            start_time = datetime.strptime(f"{hour_start}:{minute_start}", "%H:%M").time()
            end_time = datetime.strptime(f"{hour_end}:{minute_end}", "%H:%M").time()

            current_datetime = datetime.now().date()

            # Convert the date string to a datetime object
            interview_date = datetime.strptime(date, "%Y-%m-%d").date()

            if interview_date <= current_datetime:
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Invalid date. Date must be in the future.",
                    "data": {},
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

            if start_time >= end_time:
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Invalid time range. Start time must be before end time.",
                    "data": {},
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
            
            # Create the scheduled time using the provided date and time components
            employee = Employee.objects.get(account__email=employee_email)

            existing_interviews = Interview.objects.filter(
                employee=employee,
                date=date,
            )

            for existing_interview in existing_interviews:
                existing_start_time = datetime.strptime(f"{existing_interview.hour_start}:{existing_interview.minute_start}", "%H:%M").time()
                existing_end_time = datetime.strptime(f"{existing_interview.hour_end}:{existing_interview.minute_end}", "%H:%M").time()
                if (existing_interview.status != 'cancel'):
                    if (
                        (start_time >= existing_start_time and start_time < existing_end_time) or
                        (end_time > existing_start_time and end_time <= existing_end_time)
                    ):
                        response = {
                            "status": status.HTTP_400_BAD_REQUEST,
                            "message": "Time conflict with existing interview.",
                            "data": {
                                "interview_id": existing_interview.id,
                                "employee_email": employee_email,
                                "recruiter_email": recruiter_email,
                            },
                        }
                        return Response(response, status=status.HTTP_400_BAD_REQUEST)

            recruiter = Recruiter.objects.get(account__email=recruiter_email)

            # Check if the interview already exists
            existing_interview = Interview.objects.filter(
                employee=employee,
                recruiter=recruiter,
                date=date,
            ).first()

            if existing_interview and existing_interview.status != 'cancel':
                response = {
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "Interview already exists.",
                    "data": {
                        "interview_id": existing_interview.id,
                        "employee_email": employee_email,
                        "recruiter_email": recruiter_email,
                    },
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

            # Create the Interview object
            interview = Interview.objects.create(
                employee=employee,
                recruiter=recruiter,
                hour_start=hour_start,
                minute_start=minute_start,
                hour_end=hour_end,
                minute_end=minute_end,
                date=date,
            )
            
            time  = str(hour_start) + ":" + str(minute_start) + " to " + str(hour_end) + ":" + str(minute_end)

            # send_email_with_interview(employee.account.email, recruiter.company_name, date, time);
            email_thread = threading.Thread(target=send_email_with_interview, args=(employee.account.email, recruiter.company_name, date, time))
            email_thread.start()
            response = {
                "status": status.HTTP_201_CREATED,
                "message": "Scheduling successfully!",
                "data": {
                    "interview_id": interview.id,
                    "employee_email": employee_email,
                    "recruiter_email": recruiter_email,
                },
            }
            return Response(response, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InterviewListAPIView(generics.GenericAPIView):
    def get(self, request):
        serializer = InterviewListSerializer(data=request.GET)
        if serializer.is_valid():
            try: 
                date = serializer.validated_data['date']
                recruiter_email = serializer.validated_data['recruiter_email']

                interviews = Interview.objects.filter(date=date, recruiter__account__email=recruiter_email)

                interview_data = []
                for interview in interviews:
                    if interview.status != 'cancel':
                        interview_data.append({
                            'interview_id': interview.id,
                            'employee_email': interview.employee.account.email,
                            'employee_name': interview.employee.account.first_name + " " + interview.employee.account.last_name,
                            'recruiter_email': interview.recruiter.account.email,
                            'hour_start': interview.hour_start,
                            'minute_start': interview.minute_start,
                            'hour_end': interview.hour_end,
                            'minute_end': interview.minute_end,
                            'date': interview.date,
                            'status': interview.status,
                        })

                if not interview_data:
                    response = {
                        'status': status.HTTP_404_NOT_FOUND,
                        'message': 'No interviews found.',
                        'data': [],
                    }
                else:
                    response = {
                        'status': status.HTTP_200_OK,
                        'message': 'Interviews retrieved successfully.',
                        'data': interview_data,
                    }

                return Response(response)
            except Exception as e:
                response = {
                    "status": status.HTTP_401_UNAUTHORIZED,
                    "message": "Get interview failed",
                    "data": {},
                }
                return Response(response, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InterviewListView(generics.GenericAPIView):
    def get(self, request):
        serializer = InterviewAllSerializer(data=request.GET)
        if serializer.is_valid():
            try: 
                email = serializer.validated_data['email']
                interviews = Interview.objects.filter(
                    Q(recruiter__account__email=email) |
                    Q(employee__account__email=email)
                )

                interview_data = []
                for interview in interviews:
                    if interview.status != 'cancel':
                        interview_data.append({
                            'interview_id': interview.id,
                            'employee_email': interview.employee.account.email,
                            'employee_name': interview.employee.account.first_name + " " + interview.employee.account.last_name,
                            'recruiter_email': interview.recruiter.account.email,
                            'hour_start': interview.hour_start,
                            'minute_start': interview.minute_start,
                            'hour_end': interview.hour_end,
                            'minute_end': interview.minute_end,
                            'date': interview.date,
                            'status': interview.status,
                        })

                if not interview_data:
                    response = {
                        'status': status.HTTP_404_NOT_FOUND,
                        'message': 'No interviews found.',
                        'data': [],
                    }
                else:
                    response = {
                        'status': status.HTTP_200_OK,
                        'message': 'Get all interviews successfully.',
                        'data': interview_data,
                    }

                return Response(response)
            except Exception as e:
                response = {
                    "status": status.HTTP_401_UNAUTHORIZED,
                    "message": "Get all interviews failed",
                    "data": {},
                }
                return Response(response, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewStatuserializer

    def get_permissions(self):
        if self.action == 'update':
            permission_classes = [IsAuthenticated] 
        elif self.action == 'destroy':
            permission_classes = [IsAuthenticated, IsRecruiterPermission]  
        else:
            permission_classes = [] 
        return [permission() for permission in permission_classes]
    
    @swagger_auto_schema(request_body=InterviewStatuserializer)
    def update(self, request, pk):
        try:
            interview = self.get_object()
        except Interview.DoesNotExist:
            response = {
                "status": status.HTTP_404_NOT_FOUND,
                "message": "Interview not found",
                "data": {},
            }
            return Response(response, status=status.HTTP_404_NOT_FOUND)

        serializer = InterviewStatuserializer(interview, data=request.data, partial=True)
        if serializer.is_valid():
            interview.status = request.data['status']
            interview.save()
            response = {
                "status": status.HTTP_200_OK,
                "message": "Interview updated successfully.",
                "data": {},
            }
            return Response(response, status=status.HTTP_200_OK)
        
        response = {
            "status": status.HTTP_400_BAD_REQUEST,
            "message": "Interview update failed.",
            "data": {},
        }
        return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        try:
            interview = self.get_object()
        except Interview.DoesNotExist:
            response = {
                "status": status.HTTP_404_NOT_FOUND,
                "message": "Interview not found",
                "data": {},
            }
            return Response(response, status=status.HTTP_404_NOT_FOUND)
        
        interview.delete()
        response = {
            "status": status.HTTP_200_OK,
            "message": "Interview deleted successfully.",
            "data": {},
        }
        return Response(response, status=status.HTTP_200_OK)
