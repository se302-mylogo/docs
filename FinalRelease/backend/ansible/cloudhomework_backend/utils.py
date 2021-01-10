from rest_framework.request import Request

from cloudhomework.api_models import User


def get_prefix_header(name: str):
    return '_'.join(['HTTP'] + [s.upper() for s in name.split('-')])


def get_jwt_request_uid(request: Request):
    if (auth := request.auth) is not None:
        return auth['user_id']
    return None


def get_jwt_request_user(request: Request):
    if (uid := get_jwt_request_uid(request)) is not None:
        return User.objects.get(pk=uid)
    return None
