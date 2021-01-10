import time
from datetime import datetime, timedelta
from typing import List, Dict

from django.utils import timezone
from rest_framework import status

from cloudhomework.api_models import Course, Homework, HomeworkSubmit
from cloudhomework.api_tests.base import BaseAPITest


class TeacherHomeworkSubmitTests(BaseAPITest):
    courses: List[Course]
    homeworks: List[Homework]
    submit_schema = ['id',
                     'createAt',
                     'updateAt',
                     'author',
                     'homework',
                     'description',
                     'score',
                     'attachments',
                     'review']
    submits = List[HomeworkSubmit]

    @classmethod
    def setUpTestData(cls):
        super(TeacherHomeworkSubmitTests, cls).setUpTestData()
        course_create_data = [
            {
                'name': 'testCourse1',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media1,
                'teacher': cls.teachers[0]
            },
            {
                'name': 'testCourse2',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media1,
                'teacher': cls.teachers[0]
            },
            {
                'name': 'testCourse3',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media1,
                'teacher': cls.teachers[1]
            }
        ]
        cls.courses = [Course.objects.create(**c) for c in course_create_data]
        homework_create_data = [
            {
                'course': cls.courses[0],
                'available_since': timezone.now(),
                'deadline': timezone.now() + timedelta(days=7),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework1',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[0],
                'available_since': timezone.now() + timedelta(days=7),
                'deadline': timezone.now() + timedelta(days=14),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework2',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[1],
                'available_since': timezone.now(),
                'deadline': timezone.now() + timedelta(days=7),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework3',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[2],
                'available_since': timezone.now(),
                'deadline': timezone.now() + timedelta(days=7),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework4',
                'description': ['line1', 'line2'],
            },
        ]
        cls.homeworks = [Homework.objects.create(**h) for h in homework_create_data]
        for h in cls.homeworks:
            h.attachments.add(cls.test_media1, cls.test_media2)

        cls.students[0].selected_courses.add(cls.courses[0], cls.courses[1], cls.courses[2])
        submit_create_data = [
            {
                'author': cls.students[0],
                'homework': cls.homeworks[0],
                'description': ['dl1', 'dl2']
            },
            {
                'author': cls.students[0],
                'homework': cls.homeworks[1],
                'description': ['dl1', 'dl2']
            },
            {
                'author': cls.students[0],
                'homework': cls.homeworks[2],
                'description': ['dl1', 'dl2']
            },
            {
                'author': cls.students[0],
                'homework': cls.homeworks[3],
                'description': ['dl1', 'dl2']
            }
        ]
        cls.submits = [HomeworkSubmit.objects.create(**s) for s in submit_create_data]
        for hs in cls.submits:
            hs.attachments.add(cls.test_media1, cls.test_media2)

    def test_submit_list(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)
        submit_list_res = self.client.get('/teacher/submits', **auth_h)
        self.assertSuccess(submit_list_res)
        submit_list = submit_list_res.json()
        self.assertList(submit_list, 3)

        course_filter_res = self.client.get('/teacher/submits', {
            'hw__courses': [self.courses[0].id]
        }, **auth_h)
        self.assertSuccess(course_filter_res)
        self.assertList(course_filter_res.json(), 2)

        invisible_hw_filter_res = self.client.get('/teacher/submits', {
            'homework': [self.homeworks[3].id]
        }, **auth_h)
        self.assertEqual(invisible_hw_filter_res.status_code, status.HTTP_400_BAD_REQUEST)

        hw_filter_res = self.client.get('/teacher/submits', {
            'homework': [self.homeworks[0].id]
        }, **auth_h)
        self.assertSuccess(hw_filter_res)
        self.assertList(hw_filter_res.json(), 1)

    def test_submit_detail(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)
        submit_res = self.client.get(f'/teacher/submits/{self.submits[0].id}', **auth_h)
        self.assertSuccess(submit_res)
        submit_data = submit_res.json()
        self.assertSchema(submit_data, self.submit_schema)
        self.assertEqual(submit_data['review'], [])
        self.assertEqual(submit_data['score'], 0.0)

        invisible_res = self.client.get(f'/teacher/submits/{self.submits[3].id}', **auth_h)
        self.assertEqual(invisible_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_submit(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)

        wrong_review_data1 = {
            'score': -1.0,
            'review': []
        }
        wrong_res = self.client.patch(f'/teacher/submits/{self.submits[0].id}', wrong_review_data1, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        wrong_review_data2 = {
            'score': 100000.0,
            'review': []
        }
        wrong_res = self.client.patch(f'/teacher/submits/{self.submits[0].id}', wrong_review_data2, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        review_data = {
            'score': 90,
            'review': ['d1', 'd2']
        }
        review_res = self.client.patch(f'/teacher/submits/{self.submits[0].id}', review_data, **auth_h)
        self.assertSuccess(review_res)
        ret_review = review_res.json()
        self.assertSchema(ret_review, self.submit_schema)

        get_submit_res = self.client.get(f'/teacher/submits/{self.submits[0].id}', **auth_h)
        self.assertSuccess(get_submit_res)
        submit_data = get_submit_res.json()
        self.assertEqual(submit_data['score'], 90.0)
        self.assertListEqual(submit_data['review'], ['d1', 'd2'])

    def test_continuous_review(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)

        no_param_res = self.client.get(f'/teacher/reviews', **auth_h)
        self.assertEqual(no_param_res.status_code, status.HTTP_400_BAD_REQUEST)

        invisible_submit_res = self.client.get(f'/teacher/reviews', {
            'homework': self.homeworks[3].id
        }, **auth_h)
        self.assertEqual(invisible_submit_res.status_code, status.HTTP_403_FORBIDDEN)

        get_submit_res = self.client.get(f'/teacher/reviews', {
            'homework': self.homeworks[0].id
        }, **auth_h)
        self.assertSuccess(get_submit_res)
        submit_data = get_submit_res.json()
        self.assertSchema(submit_data, self.submit_schema)

        review_data = {
            'score': 90,
            'review': ['d1', 'd2']
        }
        review_res = self.client.patch(f"/teacher/submits/{submit_data['id']}", review_data, **auth_h)
        self.assertSuccess(review_res)

        get_submit_res = self.client.get(f'/teacher/reviews', {
            'homework': self.homeworks[0].id
        }, **auth_h)
        self.assertEqual(get_submit_res.status_code, status.HTTP_404_NOT_FOUND)
