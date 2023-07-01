from rest_framework import serializers
from .models import ExtractCV, JobRequirement, User, Employee, Recruiter, Interview
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.validators import FileExtensionValidator
from django.contrib.auth.hashers import make_password
import uuid


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['role'] = user.role
        if user.role == 1:
            avatar_url = User.objects.get(email=user.email).employee.avatar_url
        else:
            avatar_url = User.objects.get(email=user.email).recruiter.avatar_url
        token['avatar_url'] = avatar_url
        return token

class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']

    extra_kwargs = {
        'password': {
            'write_only': True
        }
    }
    def get_id(self, obj):
        uuid_id = uuid.uuid5(uuid.NAMESPACE_DNS, str(obj.id))
        return str(uuid_id)

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'role']

    extra_kwargs = {
        'password': {
            'write_only': True
        }
    }

    def create(self, validated_data):
        account = User.objects.create(**validated_data)
        account.password = make_password(validated_data['password'])
        account.save()
        if validated_data['role'] == 1:
            employee = Employee.objects.create(account=account)
            employee.save()
        elif validated_data['role'] == 2:
            recruiter = Recruiter.objects.create(
                account=account)
            recruiter.save()
        return account

class RecruiterRegisterSerializer(serializers.ModelSerializer):
    account = UserRegisterSerializer(required=True)
    class Meta:
        model = Recruiter
        fields = ['company_name', 'address', 'account']

    extra_kwargs = {
        'password': {
            'write_only': True
        }
    }

    def create(self, validated_data):
        data = validated_data['account']
        account = User.objects.create(**data)
        account.password = make_password(data['password'])
        account.save()
        if data['role'] == 1:
            employee = Employee.objects.create(account=account)
            employee.save()
        elif data['role'] == 2:
            recruiter = Recruiter.objects.create(
                account=account, company_name = validated_data['company_name'] ,address = validated_data['address'])
            recruiter.save()
        return account


class VertifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class ForgotPassWordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    repeat_new_password = serializers.CharField()

class EmployeeSerializer(serializers.ModelSerializer):
    account = UserSerializer(required=True)
    class Meta:
        model = Employee
        fields = '__all__'

class RecruiterSerializer(serializers.ModelSerializer):
    account = UserSerializer(required=True)
    class Meta:
        model = Recruiter
        fields = '__all__'

class PDFFileSerializer(serializers.Serializer):
    pdf_file = serializers.FileField(validators=[FileExtensionValidator(['pdf'])])

class JobRequirementSerializer(serializers.Serializer):
    pdf_file = serializers.FileField(validators=[FileExtensionValidator(['pdf'])])
    class Meta:
        model = JobRequirement
        fields = ('job_name', 'location')

class JobRequirementGetAll(serializers.ModelSerializer):
    recruiter = serializers.SerializerMethodField()
    class Meta:
        model = JobRequirement
        fields = '__all__'
    def get_recruiter(self, obj):
        return RecruiterSerializer(obj.recruiter).data

class ExtractCVGetAll(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField()
    class Meta:
        model = ExtractCV
        fields = '__all__'
    def get_employee(self, obj):
        return EmployeeSerializer(obj.employee).data

class ExtractCVCreateSerializer(serializers.Serializer):
    location = serializers.CharField(max_length=255)
    phone_number = serializers.CharField(max_length=20)
    skills = serializers.CharField()

class DeactivedJobSerializer(serializers.Serializer):
    job_requirement_id = serializers.CharField() 

class EmailCVSerializer(serializers.Serializer):
    email = serializers.EmailField()
    job_name = serializers.CharField()
    company_name = serializers.CharField()
    pdf_file = serializers.CharField()
    name = serializers.CharField()
    email_user = serializers.EmailField()

class EmailJobSerializer(serializers.Serializer):
    email = serializers.EmailField()
    job_name = serializers.CharField()
    company_name = serializers.CharField()
    pdf_upload = serializers.CharField()
    name_candidate = serializers.CharField()
    name = serializers.CharField()
    email_user = serializers.EmailField()

class InterviewSerializer(serializers.ModelSerializer):
    employee_email = serializers.EmailField()
    recruiter_email = serializers.EmailField()
    class Meta:
        model = Interview
        fields = ['employee_email', 'recruiter_email', 'hour_start', 'minute_start', 'hour_end', 'minute_end', 'date']

    def validate(self, data):
        if data['hour_start'] > data['hour_end'] or (data['hour_start'] == data['hour_end'] and data['minute_start'] >= data['minute_end']):
            raise serializers.ValidationError("Start time must be before end time")
        return data   

class InterviewUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['hour_start', 'minute_start', 'hour_end', 'minute_end', 'date', 'status']

    def validate(self, data):
        if data['hour_start'] > data['hour_end'] or (data['hour_start'] == data['hour_end'] and data['minute_start'] >= data['minute_end']):
            raise serializers.ValidationError("Start time must be before end time")
        return data   

class InterviewListSerializer(serializers.Serializer):
    date = serializers.DateField()
    recruiter_email = serializers.EmailField()

class InterviewAllSerializer(serializers.Serializer):
    email = serializers.EmailField()

class InterviewStatuserializer(serializers.Serializer):
    status = serializers.CharField(max_length=30)

class EmployeeProfile(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    avatar_img = serializers.ImageField()

class RecruiterProfile(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    avatar_img = serializers.ImageField()
    company_name = serializers.CharField()
    address = serializers.CharField()
