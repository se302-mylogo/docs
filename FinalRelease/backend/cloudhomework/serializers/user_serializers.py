from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import Serializer

from cloudhomework.api_models import User, Media
from .media_serializers import MediaOut
from .base import NonExistProfileBase
from cloudhomework_backend.serializers import ModelSerializer, BaseModelInputSerializer, InputSerializerMixin


class StudentOut(ModelSerializer):
    avatar = MediaOut()

    class Meta:
        model = User
        fields = (
            'id',
            'create_at',
            'update_at',
            'username',
            'name',
            'avatar',
            'gender',
            'role',
            'school',
            'age',
            'grade',
            'class_name',
            'email'
        )


class UserInBase(NonExistProfileBase):
    password = serializers.CharField(required=True, min_length=8, max_length=64)
    name = serializers.CharField()
    avatar = serializers.SlugRelatedField(slug_field='token', queryset=Media.objects.all(), allow_null=True)
    gender = serializers.ChoiceField([0, 1])
    role = serializers.ChoiceField([0, 1])
    school = serializers.CharField()


class StudentIn(UserInBase):
    age = serializers.IntegerField()
    grade = serializers.CharField()
    class_name = serializers.CharField()


class TeacherOut(ModelSerializer):
    avatar = MediaOut()

    class Meta:
        model = User
        fields = (
            'id',
            'create_at',
            'update_at',
            'username',
            'name',
            'avatar',
            'gender',
            'role',
            'school',
            'telephone',
            'email',
            'title'
        )


class TeacherIn(UserInBase):
    telephone = serializers.CharField()
    title = serializers.CharField()


class UserOut(Serializer):
    def to_representation(self, instance: User):
        if instance.role == 0:
            return StudentOut(instance).data
        elif instance.role == 1:
            return TeacherOut(instance).data
