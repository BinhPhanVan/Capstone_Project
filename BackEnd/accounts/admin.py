from django.contrib import admin
from .models import ExtractCV, JobRequirement, User, Employee, Recruiter
# Register your models here.
admin.site.register(User)
admin.site.register(Employee)
admin.site.register(Recruiter)
admin.site.register(ExtractCV)
admin.site.register(JobRequirement)
