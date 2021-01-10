from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.auth is not None and request.auth['role'] == 0


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.auth is not None and request.auth['role'] == 1
