from datetime import datetime, timedelta
from typing import List, Dict
from unittest import mock

from django.utils import timezone
from rest_framework import status

from cloudhomework.api_models import Course, Homework, User, HomeworkSubmit
from cloudhomework.api_tests.base import BaseAPITest


class StudentHomeworkTests(BaseAPITest):
    courses: List[Course]
    homework_data: List[Dict]
    homeworks: List[Homework]
    homework_schema = ['id',
                       'createAt',
                       'updateAt',
                       'course',
                       'availableSince',
                       'deadline',
                       'status',
                       'totalScore',
                       'name',
                       'description',
                       'attachments']

    @classmethod
    def setUpTestData(cls):
        super(StudentHomeworkTests, cls).setUpTestData()
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
            },
            {
                'name': 'testCourse3',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media2,
                'teacher': cls.teachers[1],
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            }
        ]
        cls.courses = [Course.objects.create(**c) for c in course_create_data]
        homework_create_data = [
            {
                'course': cls.courses[0],
                'available_since': datetime.now(),
                'deadline': datetime.now() + timedelta(days=7),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework1',
                'description': ['line1', 'line2'],
                'answer': cls.test_media1
            },
            {
                'course': cls.courses[0],
                'available_since': datetime.now() + timedelta(days=7),
                'deadline': datetime.now() + timedelta(days=14),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework2',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[1],
                'available_since': datetime.now() + timedelta(days=14),
                'deadline': datetime.now() + timedelta(days=21),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework3',
                'description': ['line1', 'line2'],
                'answer': cls.test_media1
            },
            {
                'course': cls.courses[1],
                'available_since': datetime.now() + timedelta(days=7),
                'deadline': datetime.now() + timedelta(days=14),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework4',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[2],
                'available_since': datetime.now(),
                'deadline': datetime.now() + timedelta(days=7),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework5',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[2],
                'available_since': datetime.now() + timedelta(days=7),
                'deadline': datetime.now() + timedelta(days=14),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework6',
                'description': ['line1', 'line2'],
            }
        ]
        cls.homeworks = [Homework.objects.create(**h) for h in homework_create_data]
        for h in cls.homeworks:
            h.attachments.add(cls.test_media1, cls.test_media2)
        cls.students[0].selected_courses.add(cls.courses[0], cls.courses[1])
        cls.students[1].selected_courses.add(cls.courses[0], cls.courses[1], cls.courses[2])
        cls.submits = [
            HomeworkSubmit.objects.create(author=cls.students[0], homework=cls.homeworks[0], description=['d1']),
            HomeworkSubmit.objects.create(author=cls.students[0], homework=cls.homeworks[1], description=['d1']),
        ]

    def test_homework_list(self):
        def for_single_user(user: User, expect_hw_ids: List[int]):
            auth_h = self.get_creds(user)
            hw_list_res = self.client.get('/student/homeworks', **auth_h)
            self.assertSuccess(hw_list_res)
            hw_list = hw_list_res.json()
            self.assertList(hw_list, len(expect_hw_ids))
            ret_id_list = [h['id'] for h in hw_list['results']]
            self.assertListEqual(list(sorted(expect_hw_ids)), list(sorted(ret_id_list)))
            hw_data = hw_list['results'][0]
            self.assertSchema(hw_data, self.homework_schema)
            self.assertTrue(all([
                isinstance(hw_data['attachments'], list),
                isinstance(hw_data['description'], list),
            ]))

        for_single_user(self.students[0], [h.id for h in self.homeworks[:4]])
        for_single_user(self.students[1], [h.id for h in self.homeworks])

    def test_homework_list_filter(self):
        test_user: User = self.students[1]
        auth_h = self.get_creds(test_user)

        search_list_res = self.client.get('/student/homeworks', {
            'search': 'testHomework'
        }, **auth_h)
        self.assertSuccess(search_list_res)
        search_list = search_list_res.json()
        self.assertList(search_list, 6)

        search_list_res = self.client.get('/student/homeworks', {
            'search': 'testHomework1'
        }, **auth_h)
        self.assertSuccess(search_list_res)
        search_list = search_list_res.json()
        self.assertList(search_list, 1)

        available_start = datetime.now() + timedelta(days=1)
        deadline_end = datetime.now() + timedelta(days=15)

        available_filter_res = self.client.get('/student/homeworks', {
            'available_before': available_start.isoformat()
        }, **auth_h)
        self.assertSuccess(available_filter_res)
        self.assertList(available_filter_res.json(), 2)

        available_filter_res = self.client.get('/student/homeworks', {
            'available_after': available_start.isoformat()
        }, **auth_h)
        self.assertSuccess(available_filter_res)
        self.assertList(available_filter_res.json(), 4)

        deadline_filter_res = self.client.get('/student/homeworks', {
            'deadline_before': deadline_end.isoformat()
        }, **auth_h)
        self.assertSuccess(deadline_filter_res)
        self.assertList(deadline_filter_res.json(), 5)

        deadline_filter_res = self.client.get('/student/homeworks', {
            'deadline_after': deadline_end.isoformat()
        }, **auth_h)
        self.assertSuccess(deadline_filter_res)
        self.assertList(deadline_filter_res.json(), 1)

        both_filter_res = self.client.get('/student/homeworks', {
            'available_after': available_start.isoformat(),
            'deadline_before': deadline_end.isoformat()
        }, **auth_h)
        self.assertSuccess(both_filter_res)
        self.assertList(both_filter_res.json(), 3)

        courses_filter_res = self.client.get('/student/homeworks', {
            'courses': [self.courses[0].id, self.courses[1].id]
        }, **auth_h)
        self.assertSuccess(courses_filter_res)
        self.assertList(courses_filter_res.json(), 4)

        auth_h = self.get_creds(self.students[0])
        courses_filter_res = self.client.get('/student/homeworks', {
            'courses': [self.courses[0].id, self.courses[1].id, self.courses[2].id]
        }, **auth_h)
        self.assertEqual(courses_filter_res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_homework_detail(self):
        auth_h = self.get_creds(self.students[0])

        invisible_hw_res = self.client.get(f'/student/homeworks/{self.homeworks[-1].id}', **auth_h)
        self.assertEqual(invisible_hw_res.status_code, status.HTTP_404_NOT_FOUND)

        hw_res = self.client.get(f'/student/homeworks/{self.homeworks[0].id}', **auth_h)
        self.assertSuccess(hw_res)
        hw_data = hw_res.json()
        self.assertSchema(hw_data, self.homework_schema)
        self.assertTrue('answer' not in hw_data)

    @mock.patch('cloudhomework.api_views.student_views.homework_views.timezone')
    def test_homework_answer(self, mocked_timezone):
        auth_h = self.get_creds(self.students[0])

        no_answer_res = self.client.get(f'/student/homeworks/{self.homeworks[1].id}/answer', **auth_h)
        self.assertEqual(no_answer_res.status_code, status.HTTP_404_NOT_FOUND)

        mocked_timezone.now.return_value = timezone.now()
        before_deadline_res = self.client.get(f'/student/homeworks/{self.homeworks[0].id}/answer', **auth_h)
        self.assertEqual(before_deadline_res.status_code, status.HTTP_403_FORBIDDEN)

        mocked_timezone.now.return_value = timezone.now() + timedelta(days=100)
        no_submit_res = self.client.get(f'/student/homeworks/{self.homeworks[2].id}/answer', **auth_h)
        self.assertEqual(no_submit_res.status_code, status.HTTP_403_FORBIDDEN)

        get_answer_res = self.client.get(f'/student/homeworks/{self.homeworks[0].id}/answer', **auth_h)
        self.assertSuccess(get_answer_res)
        self.assertTrue('Content-Type' in get_answer_res)
        self.assertEqual(get_answer_res['Content-Type'], 'text/plain')
        self.assertTrue('Content-Disposition' in get_answer_res)
        self.assertEqual(get_answer_res['Content-Disposition'], f'attachment; filename={self.test_media1.filename}')
