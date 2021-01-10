from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework_simplejwt.settings import api_settings


class IsJWTAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return (request.auth and request.auth.get(api_settings.USER_ID_CLAIM))


class IsJWTAdmin(BasePermission):
    def has_permission(self, request, view):
        return (request.auth and request.auth.get('admin'))