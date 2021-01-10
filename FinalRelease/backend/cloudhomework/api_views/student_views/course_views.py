from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.request import Request
from rest_framework.response import Response

from cloudhomework.api_models import Course, User
from cloudhomework.permissions import IsStudent
from cloudhomework.serializers import CourseOut, StudentOut
from cloudhomework.serializers.course_serializers import CourseMemberIn
from cloudhomework_backend.authentications import JWTAuthentication
from cloudhomework_backend.utils import get_jwt_request_uid, get_jwt_request_user
from cloudhomework_backend.views import BaseGenericViewSet


class CourseViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    BaseGenericViewSet):
    action_serializer_classes = {
        'list': CourseOut,
        'retrieve': CourseOut,
        'join': CourseMemberIn,
        'leave': CourseMemberIn,
        'users': StudentOut
    }
    permission_classes = [IsStudent]
    search_fields = ['^name']
    authentication_classes = [JWTAuthentication]
    queryset = Course.objects.all()

    def get_queryset(self):
        my_course_only = self.request.query_params.get('my', '')
        if my_course_only == 'true':
            return get_jwt_request_user(self.request).selected_courses.all()
        else:
            return super(CourseViewSet, self).get_queryset()

    @action(detail=True, methods=['GET'])
    def users(self, request: Request, pk=None):
        course: Course = self.get_object()
        user = get_jwt_request_user(request)
        if course not in user.selected_courses.all():
            raise PermissionDenied()

        users_qs = self.paginate_queryset(course.students.all())
        serializer = self.get_serializer(users_qs, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['POST'])
    def join(self, request: Request, pk=None):
        course: Course = self.get_object()
        student: User = get_jwt_request_user(request)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            request_student_id = serializer.validated_data['student']
            if request_student_id == student.id:
                student.selected_courses.add(course)
                return Response(status=status.HTTP_200_OK)
            raise PermissionDenied()

    @action(detail=True, methods=['POST'])
    def leave(self, request: Request, pk=None):
        course: Course = self.get_object()
        student: User = get_jwt_request_user(request)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            request_student_id = serializer.validated_data['student']
            if request_student_id == student.id:
                student.selected_courses.remove(course)
                return Response(status=status.HTTP_200_OK)
            raise PermissionDenied()

    @action(detail=True, methods=['GET'])
    def joined(self, request: Request, pk=None):
        course: Course = self.get_object()
        student: User = get_jwt_request_user(request)
        if student in course.students.all():
            return Response(status=status.HTTP_409_CONFLICT)
        else:
            return Response(status=status.HTTP_200_OK)
