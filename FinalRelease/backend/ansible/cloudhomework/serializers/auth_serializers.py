from django.db.models import Q
from rest_framework import serializers

from cloudhomework.api_models import User
from cloudhomework.exception import ProfileExistedException
from .user_serializers import UserOut
from .base import NonExistProfileBase

class RegisterSerializer(NonExistProfileBase):
    username = serializers.CharField(required=True, min_length=5, max_length=20)
    password = serializers.CharField(required=True, min_length=8, max_length=64)
    email = serializers.EmailField(required=True)


class CheckExistSerializer(NonExistProfileBase):
    pass


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, min_length=5, max_length=20)
    password = serializers.CharField(required=True, min_length=8, max_length=64)


class LoginResultSerializer(serializers.Serializer):
    user = UserOut()
    access_token = serializers.CharField()
    csrf_token = serializers.CharField()


class ChangePasswordSerailizer(serializers.Serializer):
    original = serializers.CharField(min_length=8, max_length=64)
    new = serializers.CharField(min_length=8, max_length=64)
