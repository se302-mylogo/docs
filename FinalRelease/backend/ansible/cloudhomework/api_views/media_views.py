from django.http import StreamingHttpResponse
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.permissions import AllowAny
from rest_framework.mixins import CreateModelMixin

from cloudhomework.serializers import MediaIn
from cloudhomework_backend.views import BaseGenericViewSet
from cloudhomework.models import Media


class MediaViewSet(CreateModelMixin, BaseGenericViewSet):
    action_serializer_classes = {
        'create': MediaIn
    }
    permission_classes = [AllowAny]
    queryset = Media.objects.all()
    authentication_classes = []
    lookup_field = 'token'

    def retrieve(self, request: Request, token=None):
        media: Media = self.get_object()
        return StreamingHttpResponse(media.file, content_type=media.mime)

    @action(detail=True, methods=['GET'])
    def download(self, request: Request, token=None):
        media: Media = self.get_object()
        response = StreamingHttpResponse(media.file, content_type=media.mime)
        response['Content-Disposition'] = f'attachment; filename={media.filename}'
        return response
