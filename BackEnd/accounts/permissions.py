from rest_framework.permissions import BasePermission
import jwt
from django.conf import settings


class IsEmployeePermission(BasePermission):
    def has_permission(self, request, view):
        try:
            print(request.user.role)
            if request.user.role == 1:
                return True
            return False
        except Exception:
            print(str(Exception))
            return False


class IsRecruiterPermission(BasePermission):
    def has_permission(self, request, view):
        try:
            print(request.user.role)
            if request.user.role == 2:
                return True
            return False
        except Exception:
            print(str(Exception))
            return False
