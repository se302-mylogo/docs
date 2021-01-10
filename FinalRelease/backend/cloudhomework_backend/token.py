from cloudhomework.models import User
from rest_framework_simplejwt.tokens import RefreshToken as SimpleRefreshToken

from cloudhomework.serializers import MediaOut


class RefreshToken(SimpleRefreshToken):
    @classmethod
    def for_user(cls, user: User):
        token: SimpleRefreshToken = super().for_user(user)
        token['username'] = user.username
        token['name'] = user.name
        token['gender'] = user.gender
        token['role'] = user.role
        token['school'] = user.school
        token['avatar'] = MediaOut(user.avatar, allow_null=True).data
        token['email'] = user.email
        if user.role == 0:
            token['age'] = user.age
            token['grade'] = user.grade
            token['className'] = user.class_name
        elif user.role == 1:
            token['telephone'] = user.telephone
            token['title'] = user.title
        return token
