from datetime import datetime

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import HiddenField
from rest_framework.relations import SlugRelatedField

from cloudhomework_backend.serializers import BaseInputSerializer, BaseModelInputSerializer, JWTCurrentUserIdDefault
from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework.serializers import PrimaryKeyRelatedField
from drf_dynamic_fields import DynamicFieldsMixin
from cloudhomework.models import Homework, HomeworkSubmit, Media
from cloudhomework_backend.utils import get_jwt_request_uid
from .course_serializers import CourseOut
from .media_serializers import MediaOut
from .user_serializers import StudentOut
from ..api_models import Course, User


class HomeworkOut(DynamicFieldsMixin, ModelSerializer):
    course = CourseOut()
    attachments = MediaOut(many=True)

    class Meta:
        model = Homework
        fields = (
            'id',
            'create_at',
            'update_at',
            'course',
            'available_since',
            'deadline',
            'status',
            'total_score',
            'name',
            'description',
            'attachments'
        )


class HomeworkIn(BaseModelInputSerializer):
    course = PrimaryKeyRelatedField(queryset=Course.objects.all())
    attachments = SlugRelatedField(slug_field='token', many=True, queryset=Media.objects.all())
    answer = SlugRelatedField(slug_field='token', queryset=Media.objects.all(), allow_null=True)

    class Meta:
        model = Homework
        fields = (
            'course',
            'available_since',
            'deadline',
            'status',
            'total_score',
            'name',
            'description',
            'attachments',
            'answer'
        )
        output_serializer_class = HomeworkOut

    def _validate(self, attrs):
        available_since: datetime = attrs['available_since']
        deadline: datetime = attrs['deadline']
        if available_since > deadline:
            raise ValidationError('可用时间不能晚于截止日期！')
        total_score: float = attrs['total_score']
        if total_score < 0.0:
            raise ValidationError('作业满分不能为负数！')

        course: Course = attrs['course']
        teacher_id = get_jwt_request_uid(self.context['request'])
        if course.teacher.id != teacher_id:
            raise ValidationError('作业的课程不是当前用户开设的课程！')

        return attrs


class HomeworkSubmitOut(DynamicFieldsMixin, ModelSerializer):
    attachments = MediaOut(many=True)
    homework = HomeworkOut()
    author = StudentOut()

    class Meta:
        model = HomeworkSubmit
        fields = (
            'id',
            'create_at',
            'update_at',
            'author',
            'homework',
            'description',
            'score',
            'attachments',
            'review'
        )


class HomeworkSubmitIn(BaseModelInputSerializer):
    homework = PrimaryKeyRelatedField(queryset=Homework.objects.all())
    attachments = SlugRelatedField(slug_field='token', queryset=Media.objects.all(), many=True)
    author_id = HiddenField(default=JWTCurrentUserIdDefault())

    class Meta:
        model = HomeworkSubmit
        fields = (
            'homework',
            'description',
            'attachments',
            'author_id'
        )
        output_serializer_class = HomeworkSubmitOut


class HomeworkReviewIn(BaseModelInputSerializer):
    class Meta:
        model = HomeworkSubmit
        fields = (
            'score',
            'review'
        )
        output_serializer_class = HomeworkSubmitOut

    def _validate(self, attrs):
        score: float = attrs['score']
        if score < 0.0:
            raise ValidationError('分数不能为负！')
        homework: Homework = attrs['homework']
        if score > homework.total_score:
            raise ValidationError()
        attrs_dict = {**attrs}  # When update, attrs is read-only
        attrs_dict['reviewed'] = True
        return attrs_dict
