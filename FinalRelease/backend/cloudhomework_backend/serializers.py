from types import MappingProxyType
from typing import overload

from rest_framework.serializers import ModelSerializer, Serializer


class InstanceAttrsProxy:
    def __init__(self, attrs, instance):
        self.attrs = MappingProxyType(attrs)
        self.instance = instance

    def __getitem__(self, item):
        try:
            return self.attrs[item]
        except KeyError:
            return getattr(self.instance, item)

    def get(self, k, default=None):
        try:
            return self.attrs.get(k)
        except KeyError:
            return getattr(self.instance, k, default)

    def keys(self):
        return self.attrs.keys()


class InputSerializerMixin:

    def to_representation(self, instance):
        if hasattr(self, 'Meta') and (output_serializer_class := self.Meta.output_serializer_class):
            return output_serializer_class(instance).data

        return super().to_representation(instance)

    def validate_instance(self, attrs: InstanceAttrsProxy):
        return self._validate(attrs)

    def validate_fresh(self, attrs):
        return self._validate(attrs)

    def _validate(self, attrs):
        return attrs

    def validate(self, attrs):
        if self.instance:
            return self.validate_instance(InstanceAttrsProxy(attrs, self.instance))
        else:
            return self.validate_fresh(attrs)


class BaseInputSerializer(InputSerializerMixin, Serializer):
    pass


class BaseModelInputSerializer(InputSerializerMixin, ModelSerializer):
    pass


class JWTCurrentUserIdDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context['request'].auth['user_id']

    def __repr__(self):
        return '%s()' % self.__class__.__name__
