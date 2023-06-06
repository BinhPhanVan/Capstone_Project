from email.policy import default
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid
from .manager import UserManager
import datetime
from django.utils import timezone


class User(AbstractUser):
    list_roles = (
        (1, 'Employee'),
        (2, 'Recruiter')
    )
    username = None
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, null=True, blank=True)
    role = models.IntegerField(default=0, choices=list_roles)
    first_name = models.CharField(max_length=10)
    last_name = models.CharField(max_length=10)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def name(self):
        return self.first_name + ' ' + self.last_name

    def __str__(self):
        return self.email


class Employee(models.Model):
    account = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    avatar_url = models.CharField(null=True, max_length=1000, blank=True,
                                  default='https://res.cloudinary.com/dq6avgw6n/image/upload/v1683965956/2_lrrhqr.jpg')
    pdf_file = models.CharField(null=True, max_length=1000, blank=True, default=None)

    class Meta:
        db_table = 'Employee'

    def __str__(self):
        return self.account.first_name + ' ' + self.account.last_name


class Recruiter(models.Model):
    account = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    company_name = models.CharField(null=True, blank=True, max_length=500)
    address = models.CharField(null=True, blank=True, max_length=500)
    avatar_url = models.CharField(null=True, max_length=1000, blank=True,
                                  default='https://e7.pngegg.com/pngimages/643/98/png-clipart-computer-icons-avatar-mover-business-flat-design-corporate-elderly-care-microphone-heroes-thumbnail.png')

    class Meta:
        db_table = 'Recruiter'

    def __str__(self):
        return self.account.first_name + ' ' + self.account.last_name

class ExtractCV(models.Model):
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, primary_key=True, related_name="extract_cv")
    phone_number = models.CharField(null=True, blank=True, max_length=12)
    location = models.CharField(null=True, blank=True, max_length=100)
    skills = models.TextField()
    active = models.BooleanField(default=True)
    
class JobRequirement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, auto_created=True)
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, related_name='job_requirements')
    job_name = models.CharField(max_length=255)
    location = models.CharField(null=True, blank=True, max_length=100)
    pdf_upload = models.CharField(null=True, max_length=1000, blank=True, default=None)
    skills = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=True)
