from django.contrib.auth import authenticate, login, logout
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from cloudhomework.api_models import User
from cloudhomework.serializers.auth_serializers import LoginSerializer, LoginResultSerializer, CheckExistSerializer, \
    ChangePasswordSerailizer
from cloudhomework.serializers.user_serializers import StudentIn, TeacherIn
from cloudhomework_backend.authentications import NonCSRFSessionAuthentication
from cloudhomework_backend.token import RefreshToken
from cloudhomework_backend.views import BaseViewSet


class AuthViewSet(BaseViewSet):
    authentication_classes = [NonCSRFSessionAuthentication]
    action_permissions = {
        'logout': [IsAuthenticated],
        'refresh': [IsAuthenticated],
        'change_password': [IsAuthenticated],
        'register': [AllowAny],
        'login': [AllowAny]
    }

    @staticmethod
    def get_access_token_for_user(user: User):
        return str(RefreshToken.for_user(user).access_token)

    @action(methods=['post'], detail=False)
    def login(self, request: Request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            auth_user = authenticate(request, username=data['username'], password=data['password'])
            if auth_user:
                login(request, auth_user)
                return Response(status=status.HTTP_200_OK, data=LoginResultSerializer({
                    'user': auth_user,
                    'access_token': self.get_access_token_for_user(auth_user),
                    'csrf_token': ''
                }).data)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=False)
    def logout(self, request: Request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['get'], detail=False)
    def refresh(self, request: Request):
        return Response(status=status.HTTP_200_OK, data={
            'access_token': self.get_access_token_for_user(request.user)
        })

    @action(methods=['post'], detail=False)
    def register(self, request: Request):
        if 'role' not in request.data:
            raise ValidationError()
        role = request.data['role']
        if role == 0:
            serializer = StudentIn(data=request.data)
        elif role == 1:
            serializer = TeacherIn(data=request.data)
        else:
            raise ValidationError()
        if serializer.is_valid(raise_exception=True):
            data = serializer.validated_data
            User.objects.create_user(**data)
            return Response(status=status.HTTP_200_OK)

    @action(methods=['post'], detail=False)
    def exist(self, request: Request):
        serializer = CheckExistSerializer(data=request.data)
        if serializer.is_valid():
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], detail=False)
    def change_password(self, request: Request):
        serializer = ChangePasswordSerailizer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data = serializer.validated_data
            user = request.user
            if user.check_password(data['original']):
                user.set_password(data['new'])
                user.save()
                logout(request)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
