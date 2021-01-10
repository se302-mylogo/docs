from django.contrib.postgres.fields import ArrayField

from .base import BaseModel, models
from .media import Media
from .user import User


class Course(BaseModel):
    name = models.CharField('课程名称', max_length=64)
    start_date = models.DateTimeField('开始时间')
    end_date = models.DateTimeField('结束时间')
    points = models.FloatField('学分', default=0.0)
    teacher = models.ForeignKey(User, related_name='opened_courses', verbose_name='教师', on_delete=models.CASCADE)
    cover = models.ForeignKey(Media, verbose_name='课程封面', on_delete=models.PROTECT)
    students = models.ManyToManyField(User, related_name='selected_courses', verbose_name='选修学生')
    description = ArrayField(models.TextField(), default=list, verbose_name='课程简介')
    references = ArrayField(models.TextField(), default=list, verbose_name='参考教材')
