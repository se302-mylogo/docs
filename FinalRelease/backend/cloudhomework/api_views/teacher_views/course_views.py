from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, MethodNotAllowed
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.request import Request
from rest_framework.response import Response

from cloudhomework.api_models import Course, User
from cloudhomework.permissions import IsStudent, IsTeacher
from cloudhomework.serializers import CourseOut, StudentOut
from cloudhomework.serializers.course_serializers import CourseMemberIn, CourseIn
from cloudhomework_backend.authentications import JWTAuthentication
from cloudhomework_backend.utils import get_jwt_request_user
from cloudhomework_backend.views import BaseGenericViewSet, BaseModelViewSet


class CourseViewSet(
    BaseModelViewSet):
    action_serializer_classes = {
        'list': CourseOut,
        'retrieve': CourseOut,
        'users': StudentOut,
        'create': CourseIn,
        'update': CourseIn,
        'partial_update': CourseIn
    }
    permission_classes = [IsTeacher]
    search_fields = ['^name']
    authentication_classes = [JWTAuthentication]
    queryset = Course.objects.all()

    def get_queryset(self):
        my_course_only = self.request.query_params.get('my', '')
        if my_course_only == 'true':
            return get_jwt_request_user(self.request).opened_courses.all()
        else:
            return super(CourseViewSet, self).get_queryset()

    @action(detail=True, methods=['GET'])
    def users(self, request: Request, pk=None):
        course: Course = self.get_object()
        user = get_jwt_request_user(request)
        if course not in user.opened_courses.all():
            raise PermissionDenied()
        users_qs = self.paginate_queryset(course.students.all())
        serializer = self.get_serializer(users_qs, many=True)
        return self.get_paginated_response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed(method='DELETE')
