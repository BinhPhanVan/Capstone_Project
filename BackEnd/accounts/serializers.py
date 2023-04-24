from rest_framework import serializers
from .models import User, Employee, Recruiter
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password


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
