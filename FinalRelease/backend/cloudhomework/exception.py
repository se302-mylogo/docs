from rest_framework.exceptions import APIException
from rest_framework import status


class ProfileExistedException(APIException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = '用户名和邮箱有重复'
