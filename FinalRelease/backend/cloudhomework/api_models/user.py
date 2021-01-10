from django.contrib.auth.models import AbstractUser
from django.db import models

from .base import BaseModel
from .media import Media


class User(BaseModel, AbstractUser):
    name = models.CharField('姓名', max_length=20)
    avatar = models.ForeignKey(Media, on_delete=models.PROTECT, verbose_name='头像', null=True, default=None)
    gender = models.IntegerField('性别', choices=((0, '男'), (1, '女')))
    role = models.IntegerField('角色', choices=((0, '学生'), (1, '教师')))
    school = models.CharField('学校', max_length=30)
    age = models.PositiveIntegerField('年龄', blank=True, null=True)
    grade = models.CharField('年级', max_length=10, blank=True, null=True)
    class_name = models.CharField('班级', max_length=20, blank=True, null=True)
    telephone = models.CharField('电话', max_length=15, blank=True, null=True)
    title = models.CharField('职称', max_length=20, blank=True, null=True)
