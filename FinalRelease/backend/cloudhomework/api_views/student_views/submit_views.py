from django.utils import timezone
from rest_framework.exceptions import MethodNotAllowed, PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.request import Request

from cloudhomework.api_models import Homework, User
from cloudhomework.permissions import IsStudent
from cloudhomework.serializers import HomeworkSubmitIn, HomeworkSubmitOut
from cloudhomework_backend.authentications import JWTAuthentication
from cloudhomework_backend.utils import get_jwt_request_uid, get_jwt_request_user
from cloudhomework_backend.views import BaseSingletonViewSet


class HomeworkSubmitViewSet(BaseSingletonViewSet):
    action_serializer_classes = {
        'create': HomeworkSubmitIn,
        'update': HomeworkSubmitIn,
        'partial_update': HomeworkSubmitIn,
        'retrieve': HomeworkSubmitOut
    }
    permission_classes = [IsStudent]
    authentication_classes = [JWTAuthentication]

    def perform_get_object(self):
        try:
            homework: Homework = Homework.objects.get(pk=self.kwargs['homework_pk'])
        except Homework.DoesNotExist:
            return None
        student = get_jwt_request_user(self.request)
        now = timezone.now()
        if now < homework.available_since:
            raise PermissionDenied()
        if homework.course not in student.selected_courses.all():
            raise PermissionDenied()
        return homework.submits.filter(author=student).first()

    def destroy(self, request, *args, **kwargs):
        raise MethodNotAllowed(method='DELETE')

    def perform_update(self, serializer):
        homework: Homework = serializer.instance.homework
        if timezone.now() > homework.deadline:
            raise PermissionDenied()
        super(HomeworkSubmitViewSet, self).perform_update(serializer)
