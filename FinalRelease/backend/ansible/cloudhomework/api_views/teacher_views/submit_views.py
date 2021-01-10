from rest_framework.exceptions import MethodNotAllowed, ValidationError, PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, ListModelMixin

from cloudhomework.api_models import User, HomeworkSubmit, Homework
from cloudhomework.api_views.teacher_views.filters import HomeworkSubmitFilterSet
from cloudhomework.permissions import IsTeacher
from cloudhomework.serializers import HomeworkSubmitOut, HomeworkReviewIn
from cloudhomework_backend.authentications import JWTAuthentication
from cloudhomework_backend.utils import get_jwt_request_uid
from cloudhomework_backend.views import BaseModelViewSet, BaseGenericViewSet, BaseSingletonViewSet


class HomeworkSubmitViewSet(
    RetrieveModelMixin,
    UpdateModelMixin,
    ListModelMixin,
    BaseGenericViewSet
):
    action_serializer_classes = {
        'list': HomeworkSubmitOut,
        'retrieve': HomeworkSubmitOut,
        'update': HomeworkReviewIn,
        'partial_update': HomeworkReviewIn
    }
    permission_classes = [IsTeacher]
    filter_class = HomeworkSubmitFilterSet
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        teacher_id = get_jwt_request_uid(self.request)
        return HomeworkSubmit.objects.filter(homework__course__teacher__id=teacher_id)


class ContinuousReviewViewSet(BaseSingletonViewSet):
    action_serializer_classes = {
        'retrieve': HomeworkSubmitOut,
        'update': HomeworkReviewIn,
        'partial_update': HomeworkReviewIn
    }
    permission_classes = [IsTeacher]
    authentication_classes = [JWTAuthentication]

    def create(self, request, *args, **kwargs):
        raise MethodNotAllowed(method='POST')

    def perform_get_object(self):
        try:
            homework_id = self.request.query_params['homework']
        except KeyError:
            raise ValidationError()
        teacher_id = get_jwt_request_uid(self.request)
        try:
            homework: Homework = Homework.objects.filter(course__teacher__id=teacher_id).get(pk=homework_id)
        except Homework.DoesNotExist:
            raise PermissionDenied()
        return homework.submits.filter(reviewed=False).first()
