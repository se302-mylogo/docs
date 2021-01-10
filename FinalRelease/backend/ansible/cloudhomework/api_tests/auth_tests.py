import random
import string
import time
from collections import Mapping
from typing import List

from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken

from cloudhomework.api_models import User
from cloudhomework.api_tests.base import BaseAPITest
from cloudhomework_backend.utils import get_prefix_header


class AuthTests(BaseAPITest):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

    def assertAccessToken(self, token: str, data: Mapping, ignores: List[str] = None):
        if ignores is None:
            ignores = ['password', 'avatar']
        access_token = AccessToken(token)
        keys = [k for k in data.keys() if k not in ignores]
        payload_keys = [self.to_camel_case(k) for k in keys]
        self.assertEqual(self.filter_keys(access_token.payload, payload_keys, camel=True),
                         self.filter_keys(data, keys, camel=True))

    def test_login_success(self):
        def for_single_user(user_data):
            response = self.client.post('/auth/login', {
                'username': user_data['username'],
                'password': user_data['password']
            })
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertTrue('sessionid' in self.client.cookies)
            json_data = response.json()
            response_user = json_data['user']
            self.assertEqual(response_user['username'], user_data['username'])
            role = user_data['role']
            self.assertEqual(response_user['role'], role)
            if role == 0:
                self.assertEqual(response_user['grade'], user_data['grade'])
            elif role == 1:
                self.assertEqual(response_user['title'], user_data['title'])
            self.assertAccessToken(json_data['accessToken'], user_data)

        test_student = random.choice(self.student_data)
        test_teacher = random.choice(self.teacher_data)
        for_single_user(test_student)
        for_single_user(test_teacher)

    def test_login_wrong_credential(self):
        response = self.client.post('/auth/login', {
            'username': 'test1',
            'password': 'sadkdhasdhjkddskh'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_login_bad_cred_format(self):
        # Password too short
        response = self.client.post('/auth/login', {
            'username': 'test1',
            'password': 'asd'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Password too long
        response2 = self.client.post('/auth/login', {
            'username': 'test2',
            'password': self.get_random_string(100)
        })
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def get_register_data(self, user_data):
        return {**user_data,
                'username': self.get_random_string(5),
                'email': f'{self.get_random_string(3)}@{self.get_random_string(3)}.com'
                }

    def test_register_success(self):
        def for_single_user(user_data):
            register_resp = self.client.post('/auth/register', user_data)
            self.assertEqual(register_resp.status_code, status.HTTP_200_OK)

            new_user_login_resp = self.client.post('/auth/login', {
                'username': user_data['username'],
                'password': user_data['password']
            })
            self.assertEqual(new_user_login_resp.status_code, status.HTTP_200_OK)

        test_student = self.get_register_data(random.choice(self.student_data))
        test_teacher = self.get_register_data(random.choice(self.teacher_data))
        for_single_user(test_student)
        for_single_user(test_teacher)

        test_student = self.get_register_data(random.choice(self.student_no_avatar_data))
        for_single_user(test_student)

    def test_register_invalid_profile(self):
        # Test invalid email
        invalid_email_resp = self.client.post('/auth/register', {
            'username': 'test3',
            'email': 'test3',
            'password': 'kQOdYgbkqXL6CVTZ'
        })
        self.assertEqual(invalid_email_resp.status_code, status.HTTP_400_BAD_REQUEST)

        # Test invalid password
        too_short_pwd_resp = self.client.post('/auth/register', {
            'username': 'test3',
            'email': 'test3@test.com',
            'password': '1'
        })
        too_long_pwd_resp = self.client.post('/auth/register', {
            'username': 'test3',
            'email': 'test3@test.com',
            'password': ''.join([random.choice(string.ascii_letters) for _ in range(100)])
        })
        self.assertEqual(too_short_pwd_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(too_long_pwd_resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate(self):
        # Test duplicate email
        test_user = random.choice(self.student_data)
        self.assertEqual(self.client.post('/auth/register', {
            **test_user,
            'username': 'test3',
        }).status_code, status.HTTP_403_FORBIDDEN)

        # Test duplicate username
        self.assertEqual(self.client.post('/auth/register', {
            **test_user,
            'email': 'test3@test.com',
        }).status_code, status.HTTP_403_FORBIDDEN)

        # Test both
        self.assertEqual(self.client.post('/auth/register', {
            **test_user,
            'username': test_user['username'],
            'email': test_user['email'],
        }).status_code, status.HTTP_403_FORBIDDEN)

    def test_exist_check(self):
        # No exist
        self.assertEqual(self.client.post('/auth/exist', {
            'username': 'test3',
            'email': 'test3@test.com'
        }).status_code, status.HTTP_200_OK)

        # Test duplicate email
        self.assertEqual(self.client.post('/auth/exist', {
            'email': 's1@s.com',
        }).status_code, status.HTTP_403_FORBIDDEN)

        # Test duplicate username
        self.assertEqual(self.client.post('/auth/exist', {
            'username': 'student1',
        }).status_code, status.HTTP_403_FORBIDDEN)

        # Test both
        self.assertEqual(self.client.post('/auth/exist', {
            'username': 'student1',
            'email': 's1@s.com',
        }).status_code, status.HTTP_403_FORBIDDEN)

    def test_refresh_success(self):
        test_user = random.choice(self.student_data)
        login_resp = self.client.post('/auth/login', {
            'username': test_user['username'],
            'password': test_user['password']
        }).json()
        old_access_token = login_resp['accessToken']
        time.sleep(1)
        response = self.client.get('/auth/refresh', **{
            get_prefix_header('Authorization'): f'Bearer invalid'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        new_access_token = response.json()['accessToken']
        self.assertAccessToken(new_access_token, test_user)
        self.assertTrue(AccessToken(old_access_token)['exp'] < AccessToken(new_access_token)['exp'])

    def test_unauthenticated_refresh(self):
        self.assertEqual(self.client.get('/auth/refresh').status_code, status.HTTP_403_FORBIDDEN)

    def test_jwt_authentication(self):
        test_user = random.choice(self.student_data)
        login_resp = self.client.post('/auth/login', {
            'username': test_user['username'],
            'password': test_user['password']
        }).json()
        req_headers = {
            get_prefix_header('Authorization'): f"Bearer {login_resp['accessToken']}"
        }
        cousres_list_resp = self.client.get('/student/courses', **req_headers)
        self.assertEqual(cousres_list_resp.status_code, status.HTTP_200_OK)
        unauth_resp = self.client.post('/student/courses')
        self.assertEqual(unauth_resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_change_password(self):
        test_user = random.choice(self.student_data)
        login_resp = self.client.post('/auth/login', {
            'username': test_user['username'],
            'password': test_user['password']
        }).json()

        # Test wrong original password
        wrong_resp = self.client.post('/auth/change_password', {
            'original': '111111111',
            'new': '22222222222222'
        })
        self.assertEqual(wrong_resp.status_code, status.HTTP_403_FORBIDDEN)

        # Test correct original password
        change_pass_resp = self.client.post('/auth/change_password', {
            'original': test_user['password'],
            'new': 'nfmxtTjmTABQGD1Q8iA4'
        })
        self.assertEqual(change_pass_resp.status_code, status.HTTP_200_OK)
        # check whether logout
        change_pass_resp2 = self.client.post('/auth/change_password', {
            'original': 'nfmxtTjmTABQGD1Q8iA4',
            'new': 'nfmxtTjmTABQGD1Q8iA4111'
        })
        self.assertEqual(change_pass_resp2.status_code, status.HTTP_403_FORBIDDEN)

        # check login again with new password
        login_resp2 = self.client.post('/auth/login', {
            'username': test_user['username'],
            'password': 'nfmxtTjmTABQGD1Q8iA4'
        })
        self.assertEqual(login_resp2.status_code, status.HTTP_200_OK)
