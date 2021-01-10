import time
from datetime import datetime, timedelta
from typing import List, Dict
from unittest import mock

from django.utils import timezone
from rest_framework import status

from cloudhomework.api_models import Course, Homework, HomeworkSubmit
from cloudhomework.api_tests.base import BaseAPITest


class StudentHomeworkSubmitTests(BaseAPITest):
    courses: List[Course]
    homeworks: List[Homework]
    submit_create_data: Dict
    submit_schema = ['id',
                     'createAt',
                     'updateAt',
                     'author',
                     'homework',
                     'description',
                     'score',
                     'attachments',
                     'review']

    @classmethod
    def setUpTestData(cls):
        super(StudentHomeworkSubmitTests, cls).setUpTestData()
        course_create_data = [
            {
                'name': 'testCourse1',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media1,
                'teacher': cls.teachers[0],
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse2',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media1,
                'teacher': cls.teachers[0],
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
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
        ]
        cls.homeworks = [Homework.objects.create(**h) for h in homework_create_data]
        for h in cls.homeworks:
            h.attachments.add(cls.test_media1, cls.test_media2)

        cls.students[0].selected_courses.add(cls.courses[0])
        cls.submit_create_data = {
            'homework': cls.homeworks[0].id,
            'description': ['dl1', 'dl2'],
            'attachments': [str(cls.test_media1.token), str(cls.test_media2.token)]
        }

    def test_create_submit(self):
        test_user = self.students[0]
        auth_h = self.get_creds(test_user)

        incorrect_hw_res = self.client.get(f'/student/homeworks/100000/submit', **auth_h)
        self.assertEqual(incorrect_hw_res.status_code, status.HTTP_404_NOT_FOUND)

        notfound_res = self.client.get(f'/student/homeworks/{self.homeworks[0].id}/submit', **auth_h)
        self.assertEqual(notfound_res.status_code, status.HTTP_404_NOT_FOUND)

        before_available_res = self.client.post(f'/student/homeworks/{self.homeworks[1].id}/submit',
                                                self.submit_create_data, **auth_h)
        self.assertEqual(before_available_res.status_code, status.HTTP_403_FORBIDDEN)

        invisible_course_res = self.client.post(f'/student/homeworks/{self.homeworks[2].id}/submit',
                                                self.submit_create_data, **auth_h)
        self.assertEqual(invisible_course_res.status_code, status.HTTP_403_FORBIDDEN)

        create_res = self.client.post(f'/student/homeworks/{self.homeworks[0].id}/submit',
                                      self.submit_create_data, **auth_h)
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        create_data = create_res.json()
        self.assertSchema(create_data, self.submit_schema)
        self.assertTrue(all([
            isinstance(create_data['author'], dict),
            isinstance(create_data['attachments'], list),
            isinstance(create_data['review'], list)
        ]))
        self.assertEqual(create_data['author']['id'], test_user.id)

    @mock.patch('cloudhomework.api_views.student_views.submit_views.timezone')
    def test_update_submit(self, mocked_timezone):
        test_user = self.students[0]
        test_submit = HomeworkSubmit.objects.create(author=test_user, homework=self.homeworks[0],
                                                    description=['d1', 'd2'])
        test_submit.attachments.add(self.test_media1, self.test_media2)

        auth_h = self.get_creds(test_user)
        mocked_timezone.now.return_value = timezone.now()
        get_submit_res = self.client.get(f'/student/homeworks/{self.homeworks[0].id}/submit', **auth_h)
        self.assertSuccess(get_submit_res)
        existed_data = get_submit_res.json()
        self.assertSchema(existed_data, self.submit_schema)
        last_update = existed_data['updateAt']
        time.sleep(0.1)
        update_submit_res = self.client.patch(f'/student/homeworks/{self.homeworks[0].id}/submit', {
            'description': ['d3', 'd4']
        }, **auth_h)
        self.assertSuccess(update_submit_res)
        updated_data = update_submit_res.json()
        update_at, description = updated_data['updateAt'], updated_data['description']
        self.assertNotEqual(last_update, update_at)
        self.assertListEqual(['d3', 'd4'], description)

        delete_res = self.client.delete(f'/student/homeworks/{self.homeworks[0].id}/submit', **auth_h)
        self.assertEqual(delete_res.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        mocked_timezone.now.return_value = timezone.now() + timedelta(days=8)
        update_submit_res = self.client.patch(f'/student/homeworks/{self.homeworks[0].id}/submit', {
            'description': ['d3', 'd4']
        }, **auth_h)
        self.assertEqual(update_submit_res.status_code, status.HTTP_403_FORBIDDEN)
