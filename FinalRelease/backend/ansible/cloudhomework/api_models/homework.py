from .base import BaseModel
from django.contrib.postgres.fields import ArrayField
from django.db import models
from .media import Media
from .course import Course
from .user import User


class Homework(BaseModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, verbose_name='所属课程', related_name='homeworks')
    available_since = models.DateTimeField('可用时间')
    deadline = models.DateTimeField('截止时间')
    status = models.IntegerField('状态', choices=((0, '已锁定'), (1, '开放提交'), (2, '已截止')))
    total_score = models.FloatField('总分')
    name = models.CharField('作业名称', max_length=100)
    description = ArrayField(models.TextField(), verbose_name='作业描述', default=list)
    attachments = models.ManyToManyField(Media, verbose_name='作业附件')
    answer = models.ForeignKey(Media, default=None, null=True, verbose_name='参考答案', on_delete=models.PROTECT,
                               related_name='as_answer_homeworks')


class HomeworkSubmit(BaseModel):
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='提交者')
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name='submits', verbose_name='所属作业')
    description = ArrayField(models.TextField(), verbose_name='作业提交描述')
    score = models.FloatField('得分', default=0.0)
    attachments = models.ManyToManyField(Media, verbose_name='作业提交附件')
    review = ArrayField(models.TextField(), verbose_name='评语', default=list)
    reviewed = models.BooleanField('是否批阅', default=False)
