from uuid import uuid4
import mimetypes

from django.core.files.uploadedfile import UploadedFile
from django.conf import settings

from cloudhomework_backend.serializers import BaseInputSerializer, BaseModelInputSerializer
from rest_framework.serializers import ModelSerializer, Serializer, FileField, HiddenField
from drf_dynamic_fields import DynamicFieldsMixin
from cloudhomework.models import Media


class MediaOut(ModelSerializer):
    class Meta:
        model = Media
        fields = (
            'id',
            'create_at',
            'update_at',
            'token',
            'filename',
            'size',
            'mime'
        )

    def to_representation(self, instance):
        data = super(MediaOut, self).to_representation(instance)
        data['url'] = f"{settings.MEDIA_BASE_URL}/{data['token']}"
        data['download_url'] = f"{settings.MEDIA_BASE_URL}/{data['token']}/download"
        return data


class MediaIn(BaseModelInputSerializer):
    upfile = FileField(source='file')
    token = HiddenField(default=uuid4)

    class Meta:
        model = Media
        fields = (
            'upfile',
            'token'
        )
        output_serializer_class = MediaOut

    def validate(self, attrs):
        validated = super(MediaIn, self).validate(attrs)
        file: UploadedFile = validated['file']
        filename = file.name
        validated['filename'] = filename
        validated['size'] = file.size
        file.name = str(validated['token'])
        validated['file'] = file
        guessed_mime, _ = mimetypes.guess_type(filename)
        validated['mime'] = guessed_mime if guessed_mime else 'application/octet-stream'
        return validated
