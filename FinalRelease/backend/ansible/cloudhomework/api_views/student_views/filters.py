import rest_framework_filters as filters
from rest_framework.request import Request

from cloudhomework.api_models import Homework, User
from cloudhomework_backend.utils import get_jwt_request_user


def student_courses(request: Request):
    student: User = get_jwt_request_user(request)
    return student.selected_courses


class HomeworkFilterSet(filters.FilterSet):
    available_before = filters.DateTimeFilter(field_name='available_since', lookup_expr='lte')
    available_after = filters.DateTimeFilter(field_name='available_since', lookup_expr='gte')
    deadline_before = filters.DateTimeFilter(field_name='deadline', lookup_expr='lte')
    deadline_after = filters.DateTimeFilter(field_name='deadline', lookup_expr='gte')
    courses = filters.ModelMultipleChoiceFilter(field_name='course', queryset=student_courses)

    class Meta:
        model = Homework
        fields = ('available_before', 'available_after', 'deadline_before', 'deadline_after', 'courses')
