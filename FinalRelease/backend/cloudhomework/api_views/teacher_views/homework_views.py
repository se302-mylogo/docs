from django.http import StreamingHttpResponse
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.request import Request

from cloudhomework.api_models import User, Homework
from cloudhomework.api_views.teacher_views.filters import HomeworkFilterSet
from cloudhomework.permissions import IsTeacher
from cloudhomework.serializers import HomeworkOut, HomeworkIn
from cloudhomework_backend.authentications import JWTAuthentication
from cloudhomework_backend.utils import get_jwt_request_uid
from cloudhomework_backend.views import BaseModelViewSet


class HomeworkViewSet(BaseModelViewSet):
    action_serializer_classes = {
        'list': HomeworkOut,
        'retrieve': HomeworkOut,
        'create': HomeworkIn,
        'update': HomeworkIn,
        'partial_update': HomeworkIn
    }
    permission_classes = [IsTeacher]
    search_fields = ['^name']
    filter_class = HomeworkFilterSet
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        teacher_id = get_jwt_request_uid(self.request)
        return Homework.objects.filter(course__teacher__id=teacher_id)

    @action(detail=True, methods=['GET'])
    def answer(self, request: Request, pk=None):
        homework: Homework = self.get_object()
        if homework.answer is None:
            raise NotFound('教师未提供答案！')

        response = StreamingHttpResponse(homework.answer.file, content_type=homework.answer.mime)
        response['Content-Disposition'] = f'attachment; filename={homework.answer.filename}'
        return response
