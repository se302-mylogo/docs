from django.http import StreamingHttpResponse
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin
from rest_framework.request import Request

from cloudhomework.api_models import Homework, User, HomeworkSubmit
from cloudhomework.api_views.student_views.filters import HomeworkFilterSet
from cloudhomework.permissions import IsStudent
from cloudhomework.serializers import HomeworkOut
from cloudhomework_backend.authentications import JWTAuthentication
from cloudhomework_backend.utils import get_jwt_request_uid
from cloudhomework_backend.views import BaseModelViewSet, BaseGenericViewSet


class HomeworkViewSet(ListModelMixin,
                      RetrieveModelMixin,
                      BaseGenericViewSet):
    action_serializer_classes = {
        'list': HomeworkOut,
        'retrieve': HomeworkOut
    }
    permission_classes = [IsStudent]
    search_fields = ['^name']
    filter_class = HomeworkFilterSet
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        student_id = get_jwt_request_uid(self.request)
        return Homework.objects.filter(course__students__id=student_id)

    @action(detail=True, methods=['GET'])
    def answer(self, request: Request, pk=None):
        homework: Homework = self.get_object()
        if homework.answer is None:
            raise NotFound('教师未提供答案！')

        now = timezone.now()
        if now <= homework.deadline:
            raise PermissionDenied()

        student_id = get_jwt_request_uid(request)
        if HomeworkSubmit.objects.filter(homework=homework, author_id=student_id).exists():
            response = StreamingHttpResponse(homework.answer.file, content_type=homework.answer.mime)
            response['Content-Disposition'] = f'attachment; filename={homework.answer.filename}'
            return response
        else:
            raise PermissionDenied()
