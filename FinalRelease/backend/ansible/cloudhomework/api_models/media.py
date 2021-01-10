from .base import BaseModel
from django.db import models
import uuid


class Media(BaseModel):
    token = models.UUIDField('token', default=uuid.uuid4, db_index=True)
    filename = models.CharField('文件名', max_length=64)
    size = models.PositiveBigIntegerField('文件大小')
    file = models.FileField('文件', upload_to='files')
    mime = models.CharField('MIME-Type', max_length=64)
