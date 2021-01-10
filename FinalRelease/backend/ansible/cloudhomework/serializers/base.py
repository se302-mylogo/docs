from django.db.models import Q
from rest_framework import serializers

from cloudhomework.api_models import User
from cloudhomework.exception import ProfileExistedException


class NonExistProfileBase(serializers.Serializer):
    username = serializers.CharField(required=False, min_length=5, max_length=20)
    email = serializers.EmailField(required=False)

    def validate(self, attrs):
        if 'username' in attrs and 'email' in attrs:
            criteria = Q(username=attrs['username']) | Q(email=attrs['email'])
        elif 'username' in attrs:
            criteria = Q(username=attrs['username'])
        elif 'email' in attrs:
            criteria = Q(email=attrs['email'])
        else:
            return attrs
        if User.objects.filter(criteria).exists():
            raise ProfileExistedException()
        return attrs