import json

from django.http import HttpResponse
from django.test import TestCase
from rest_framework.test import APITestCase

from cloudhomework_backend.middlewares import CompatibleMiddleware
from cloudhomework_backend.utils import get_prefix_header
from .api_tests import *


# Create your tests here.
class GeneralTests(APITestCase):
    def test_to_prefix_header(self):
        self.assertEqual(get_prefix_header('Origin'), 'HTTP_ORIGIN')
        self.assertEqual(get_prefix_header('Access-Control-Request-Method'), 'HTTP_ACCESS_CONTROL_REQUEST_METHOD')

    def test_cors_header(self):
        response = self.client.options('/auth/login/', **{
            get_prefix_header('Origin'): 'http://localhost:8080',
            get_prefix_header('Access-Control-Request-Method'): 'POST',
            get_prefix_header('Access-Control-Request-Headers'): 'X-CSRFTOKEN, Content-Type',
            get_prefix_header('Cookie'): 'a=1'
        })
        self.assertTrue(all([
            'Access-Control-Allow-Origin' in response,
            'Access-Control-Allow-Methods' in response,
            'Access-Control-Allow-Headers' in response,
            'Access-Control-Allow-Credentials' in response
        ]))

    def test_compatible_middleware(self):
        def get_response1(req):
            return HttpResponse(content=bytes(json.dumps({'a': 1}).encode('utf-8')), status=status.HTTP_403_FORBIDDEN)

        def get_response2(req):
            return HttpResponse(content='', status=status.HTTP_200_OK)

        middleware = CompatibleMiddleware(get_response1)
        res1 = middleware(None)
        res_data = json.loads(res1.content)
        self.assertEqual(res_data, {
            'status': status.HTTP_403_FORBIDDEN,
            'data': {
                'a': 1
            }
        })

        middleware = CompatibleMiddleware(get_response2)
        res2 = middleware(None)
        res_data = res2.content
        self.assertEqual(res_data, b'')
