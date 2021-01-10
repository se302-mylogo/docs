import json
from importlib import reload
from unittest.mock import patch

from django.http import HttpResponse, StreamingHttpResponse
from rest_framework import status

from cloudhomework_backend.environ_settings import ci_settings, cluster_settings, general_settings
from unittest import TestCase
from django.test import TestCase as DjangoTestCase

from cloudhomework_backend.middlewares import CompatibleMiddleware


class SettingsTest(TestCase):
    @classmethod
    def get_module_names(cls, module):
        return [name for name in dir(module) if not name.startswith('__')]

    def compare_module_attributes(self, lhs, rhs):
        common_names = set(self.get_module_names(lhs)).intersection(set(self.get_module_names(rhs)))
        for name in common_names:
            self.assertEqual(getattr(lhs, name), getattr(rhs, name))

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.ci_settings_names = cls.get_module_names(ci_settings)
        cls.cluster_settings_names = cls.get_module_names(cluster_settings)
        cls.general_settings_names = cls.get_module_names(general_settings)

    def test_load_environ_settings(self):
        from cloudhomework_backend import settings
        with patch.dict('os.environ', {'DJANGO_ENVIRON_SETTINGS': 'CI'}):
            reload(settings)
            self.compare_module_attributes(settings, ci_settings)

        with patch.dict('os.environ', {'DJANGO_ENVIRON_SETTINGS': 'CLUSTER'}):
            reload(settings)
            self.compare_module_attributes(settings, cluster_settings)

        with patch.dict('os.environ', {'DJANGO_ENVIRON_SETTINGS': 'GENERAL'}):
            reload(settings)
            self.compare_module_attributes(settings, general_settings)

