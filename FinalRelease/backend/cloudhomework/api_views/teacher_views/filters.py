import rest_framework_filters as filters
from rest_framework.request import Request

from cloudhomework.api_models import Homework, User, HomeworkSubmit
from cloudhomework_backend.utils import get_jwt_request_user, get_jwt_request_uid


def teacher_courses(request: Request):
    teacher: User = get_jwt_request_user(request)
    return teacher.opened_courses.all()


def teacher_homeworks(request: Request):
    teacher_id = get_jwt_request_uid(request)
    return Homework.objects.filter(course__teacher__id=teacher_id)


class HomeworkFilterSet(filters.FilterSet):
    available_after = filters.DateTimeFilter(field_name='available_since', lookup_expr='gte')
    deadline_before = filters.DateTimeFilter(field_name='deadline', lookup_expr='lte')
    courses = filters.ModelMultipleChoiceFilter(field_name='course', queryset=teacher_courses)

    class Meta:
        model = Homework
        fields = ('available_after', 'deadline_before', 'courses')


class HomeworkSubmitFilterSet(filters.FilterSet):
    homework = filters.ModelChoiceFilter(queryset=teacher_homeworks)
    hw = filters.RelatedFilter(HomeworkFilterSet, field_name='homework', queryset=teacher_homeworks)

    class Meta:
        model = HomeworkSubmit
        fields = ('homework', 'hw')
