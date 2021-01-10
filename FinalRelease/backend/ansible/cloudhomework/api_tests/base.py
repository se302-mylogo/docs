import random
import string
from typing import ClassVar, Dict, List, Mapping

from django.core.files.uploadedfile import UploadedFile, SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from cloudhomework.api_models import Media, User
from cloudhomework.api_views.auth_views import AuthViewSet
from cloudhomework_backend.utils import get_prefix_header


class BaseAPITest(APITestCase):
    test_media1: ClassVar[Media]
    test_media2: ClassVar[Media]
    student_data: List[Dict]
    student_no_avatar_data: List[Dict]
    teacher_data: List[Dict]
    students: List[User]
    teachers: List[User]

    def to_camel_case(self, snake_str: str):
        components = snake_str.split('_')
        # We capitalize the first letter of each component except the first one
        # with the 'title' method and join them together.
        return components[0] + ''.join(x.title() for x in components[1:])

    def filter_keys(self, to_filter: Mapping, keys: List[str], /, camel: bool = False) -> Dict:
        return {key if not camel else self.to_camel_case(key): to_filter[key] for key in keys}

    def get_random_string(self, length):
        return ''.join([random.choice(string.ascii_letters) for _ in range(length)])

    def assertSchema(self, data: Mapping, schema: List[str]):
        self.assertTrue(all([key in data for key in schema]))

    def get_creds(self, user: User) -> Dict:
        auth_headers = {
            get_prefix_header('Authorization'): f'Bearer {AuthViewSet.get_access_token_for_user(user)}'
        }
        return auth_headers

    def assertList(self, list_data: Dict, count):
        self.assertSchema(list_data, ['count', 'results'])
        self.assertEqual(list_data['count'], count)

    def assertSuccess(self, response):
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @classmethod
    def setUpTestData(cls):
        cls.test_media1 = Media.objects.create(
            filename='test1',
            size='128',
            mime='text/plain',
            file=SimpleUploadedFile('test1', b'test1')
        )
        cls.test_media2 = Media.objects.create(
            filename='test2',
            size='256',
            mime='text/plain',
            file=SimpleUploadedFile('test2', b'test2')
        )
        cls.student_no_avatar_data=[
            {
                'username': 'student1',
                'name': 'st1',
                'password': 'passwd1234',
                'email': 's1@s.com',
                'gender': 0,
                'role': 0,
                'school': 'sjtu',
                'age': 20,
                'grade': 'grade',
                'class_name': 'F',
                'avatar': None
            },
            {
                'username': 'student2',
                'name': 'st2',
                'password': 'passwd12345',
                'email': 's2@s.com',
                'gender': 1,
                'role': 0,
                'school': 'sjtu',
                'age': 21,
                'grade': 'grade',
                'class_name': 'F',
                'avatar': None
            }
        ]
        cls.student_data = [
            {
                'username': 'student1',
                'name': 'st1',
                'password': 'passwd1234',
                'email': 's1@s.com',
                'avatar': str(cls.test_media1.token),
                'gender': 0,
                'role': 0,
                'school': 'sjtu',
                'age': 20,
                'grade': 'grade',
                'class_name': 'F'
            },
            {
                'username': 'student2',
                'name': 'st2',
                'password': 'passwd12345',
                'email': 's2@s.com',
                'avatar': str(cls.test_media2.token),
                'gender': 1,
                'role': 0,
                'school': 'sjtu',
                'age': 21,
                'grade': 'grade',
                'class_name': 'F'
            }
        ]
        cls.student_create_data = [
            {
                'username': 'student1',
                'name': 'st1',
                'password': 'passwd1234',
                'email': 's1@s.com',
                'avatar': cls.test_media1,
                'gender': 0,
                'role': 0,
                'school': 'sjtu',
                'age': 20,
                'grade': 'grade',
                'class_name': 'F'
            },
            {
                'username': 'student2',
                'name': 'st2',
                'password': 'passwd12345',
                'email': 's2@s.com',
                'avatar': cls.test_media2,
                'gender': 1,
                'role': 0,
                'school': 'sjtu',
                'age': 21,
                'grade': 'grade',
                'class_name': 'F'
            }
        ]
        cls.teacher_data = [
            {
                'username': 'teacher1',
                'name': 'tc1',
                'password': 'passwd1234',
                'avatar': str(cls.test_media1.token),
                'gender': 0,
                'role': 1,
                'school': 'sjtu',
                'telephone': '1234567890',
                'email': 't1@t.com',
                'title': 'title1'
            },
            {
                'username': 'teacher2',
                'name': 'st2',
                'password': 'passwd12345',
                'avatar': str(cls.test_media2.token),
                'gender': 1,
                'role': 1,
                'school': 'sjtu',
                'telephone': '1234567890',
                'email': 't2@t.com',
                'title': 'title2'
            }
        ]
        cls.teacher_create_data = [
            {
                'username': 'teacher1',
                'name': 'tc1',
                'password': 'passwd1234',
                'avatar': cls.test_media1,
                'gender': 0,
                'role': 1,
                'school': 'sjtu',
                'telephone': '1234567890',
                'email': 't1@t.com',
                'title': 'title1'
            },
            {
                'username': 'teacher2',
                'name': 'st2',
                'password': 'passwd12345',
                'avatar': cls.test_media2,
                'gender': 1,
                'role': 1,
                'school': 'sjtu',
                'telephone': '1234567890',
                'email': 't2@t.com',
                'title': 'title2'
            }
        ]
        cls.students = [User.objects.create_user(**s) for s in cls.student_create_data]
        cls.teachers = [User.objects.create_user(**t) for t in cls.teacher_create_data]
