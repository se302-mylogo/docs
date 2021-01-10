from datetime import datetime

from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import HiddenField
from rest_framework.relations import SlugRelatedField
from rest_framework.serializers import Serializer

from cloudhomework.api_models import Course, Media
from cloudhomework.serializers import MediaOut
from cloudhomework.serializers.user_serializers import TeacherOut
from cloudhomework_backend.serializers import BaseModelInputSerializer, ModelSerializer, JWTCurrentUserIdDefault


class CourseOut(DynamicFieldsMixin, ModelSerializer):
    cover = MediaOut()
    teacher = TeacherOut()

    class Meta:
        model = Course
        fields = (
            'id',
            'create_at',
            'update_at',
            'name',
            'start_date',
            'end_date',
            'points',
            'cover',
            'teacher',
            'description',
            'references'
        )


class CourseIn(BaseModelInputSerializer):
    cover = SlugRelatedField(slug_field='token', queryset=Media.objects.all())
    teacher_id = HiddenField(default=JWTCurrentUserIdDefault())

    class Meta:
        model = Course
        fields = (
            'name',
            'start_date',
            'end_date',
            'points',
            'cover',
            'teacher_id',
            'description',
            'references'
        )
        output_serializer_class = CourseOut

    def _validate(self, attrs):
        start_date: datetime = attrs['start_date']
        end_date: datetime = attrs['end_date']
        if start_date > end_date:
            raise ValidationError('开始时间不能晚于结束时间！')
        points: float = attrs['points']
        if points < 0.0:
            raise ValidationError('学分不能为负！')
        return attrs


class CourseMemberIn(Serializer):
    student = serializers.IntegerField()
