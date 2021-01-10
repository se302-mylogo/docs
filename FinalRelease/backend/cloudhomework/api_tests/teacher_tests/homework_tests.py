from datetime import timedelta
from typing import List, Dict

from django.utils import timezone
from rest_framework import status

from cloudhomework.api_models import Course, Homework, User, Media
from cloudhomework.api_tests.base import BaseAPITest


class TeacherHomeworkTests(BaseAPITest):
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
        super(TeacherHomeworkTests, cls).setUpTestData()
        course_create_data = [
            {
                'name': 'testCourse1',
                'start_date': timezone.now().isoformat(),
                'end_date': (timezone.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media1,
                'teacher': cls.teachers[0]
            },
            {
                'name': 'testCourse2',
                'start_date': timezone.now().isoformat(),
                'end_date': (timezone.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media1,
                'teacher': cls.teachers[0]
            },
            {
                'name': 'testCourse3',
                'start_date': timezone.now().isoformat(),
                'end_date': (timezone.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media2,
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
                'available_since': timezone.now() + timedelta(days=14),
                'deadline': timezone.now() + timedelta(days=21),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework3',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[1],
                'available_since': timezone.now() + timedelta(days=7),
                'deadline': timezone.now() + timedelta(days=14),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework4',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[2],
                'available_since': timezone.now(),
                'deadline': timezone.now() + timedelta(days=7),
                'status': 0,
                'total_score': 100,
                'name': 'testHomework5',
                'description': ['line1', 'line2'],
            },
            {
                'course': cls.courses[2],
                'available_since': timezone.now() + timedelta(days=7),
                'deadline': timezone.now() + timedelta(days=14),
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

    def test_homework_list(self):
        def for_single_user(user: User, expect_hw_ids: List[int]):
            auth_h = self.get_creds(user)
            hw_list_res = self.client.get('/teacher/homeworks', **auth_h)
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

        for_single_user(self.teachers[0], [h.id for h in self.homeworks[:4]])
        for_single_user(self.teachers[1], [h.id for h in self.homeworks[4:]])

    def test_homework_list_filter(self):
        test_user: User = self.teachers[0]
        auth_h = self.get_creds(test_user)

        search_list_res = self.client.get('/teacher/homeworks', {
            'search': 'testHomework'
        }, **auth_h)
        self.assertSuccess(search_list_res)
        search_list = search_list_res.json()
        self.assertList(search_list, 4)

        search_list_res = self.client.get('/teacher/homeworks', {
            'search': 'testHomework1'
        }, **auth_h)
        self.assertSuccess(search_list_res)
        search_list = search_list_res.json()
        self.assertList(search_list, 1)

        available_start = timezone.now() + timedelta(days=1)
        deadline_end = timezone.now() + timedelta(days=15)

        available_filter_res = self.client.get('/teacher/homeworks', {
            'available_after': available_start.isoformat()
        }, **auth_h)
        self.assertSuccess(available_filter_res)
        self.assertList(available_filter_res.json(), 3)

        deadline_filter_res = self.client.get('/teacher/homeworks', {
            'deadline_before': deadline_end.isoformat()
        }, **auth_h)
        self.assertSuccess(deadline_filter_res)
        self.assertList(deadline_filter_res.json(), 3)

        both_filter_res = self.client.get('/teacher/homeworks', {
            'available_after': available_start.isoformat(),
            'deadline_before': deadline_end.isoformat()
        }, **auth_h)
        self.assertSuccess(both_filter_res)
        self.assertList(both_filter_res.json(), 2)

        courses_filter_res = self.client.get('/teacher/homeworks', {
            'courses': [self.courses[0].id]
        }, **auth_h)
        self.assertSuccess(courses_filter_res)
        self.assertList(courses_filter_res.json(), 2)

        courses_filter_res = self.client.get('/teacher/homeworks', {
            'courses': [self.courses[0].id, self.courses[1].id, self.courses[2].id]
        }, **auth_h)
        self.assertEqual(courses_filter_res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_homework_detail(self):
        auth_h = self.get_creds(self.teachers[0])

        invisible_hw_res = self.client.get(f'/teacher/homeworks/{self.homeworks[-1].id}', **auth_h)
        self.assertEqual(invisible_hw_res.status_code, status.HTTP_404_NOT_FOUND)

        hw_res = self.client.get(f'/teacher/homeworks/{self.homeworks[0].id}', **auth_h)
        self.assertSuccess(hw_res)
        hw_data = hw_res.json()
        self.assertSchema(hw_data, self.homework_schema)
        self.assertTrue('answer' not in hw_data)

    def test_create_homework(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)
        wrong_create_data1 = {
            'course': self.courses[0].id,
            'availableSince': (timezone.now() + timedelta(days=7)).isoformat(),
            'deadline': timezone.now().isoformat(),
            'status': 0,
            'totalScore': 100.0,
            'name': 'testHw',
            'description': ['d1', 'd2'],
            'attachments': [str(self.test_media1.token), str(self.test_media2.token)],
            'answer': None
        }
        wrong_res = self.client.post('/teacher/homeworks', wrong_create_data1, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        wrong_create_data2 = {
            'course': self.courses[0].id,
            'availableSince': timezone.now().isoformat(),
            'deadline': (timezone.now() + timedelta(days=7)).isoformat(),
            'status': 0,
            'totalScore': -1.0,
            'name': 'testHw',
            'description': ['d1', 'd2'],
            'attachments': [str(self.test_media1.token), str(self.test_media2.token)],
            'answer': None
        }
        wrong_res = self.client.post('/teacher/homeworks', wrong_create_data2, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        wrong_create_data3 = {
            'course': self.courses[0].id,
            'availableSince': timezone.now().isoformat(),
            'deadline': (timezone.now() + timedelta(days=7)).isoformat(),
            'status': 0,
            'totalScore': 100.0,
            'name': 'testHw',
            'description': ['d1', 'd2'],
            'attachments': [str(self.test_media1.token), str(self.test_media2.token)]
        }
        wrong_res = self.client.post('/teacher/homeworks', wrong_create_data3, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        invisible_create_data = {
            'course': self.courses[2].id,
            'availableSince': timezone.now().isoformat(),
            'deadline': (timezone.now() + timedelta(days=7)).isoformat(),
            'status': 0,
            'totalScore': 100.0,
            'name': 'testHw',
            'description': ['d1', 'd2'],
            'attachments': [str(self.test_media1.token), str(self.test_media2.token)],
            'answer': None
        }
        wrong_res = self.client.post('/teacher/homeworks', invisible_create_data, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        homework_create_data = {
            'course': self.courses[0].id,
            'availableSince': timezone.now().isoformat(),
            'deadline': (timezone.now() + timedelta(days=7)).isoformat(),
            'status': 0,
            'totalScore': 100.0,
            'name': 'testHw',
            'description': ['d1', 'd2'],
            'attachments': [str(self.test_media1.token), str(self.test_media2.token)],
            'answer': None
        }
        create_res = self.client.post('/teacher/homeworks', homework_create_data, **auth_h)
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        created_data = create_res.json()
        self.assertSchema(created_data, self.homework_schema)

    def test_update_homework(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)
        wrong_res = self.client.patch(f'/teacher/homeworks/{self.homeworks[0].id}', {
            'availableSince': (timezone.now() + timedelta(days=700)).isoformat()
        }, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        wrong_res = self.client.patch(f'/teacher/homeworks/{self.homeworks[0].id}', {
            'deadline': (timezone.now() + timedelta(days=-100)).isoformat()
        }, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        wrong_res = self.client.patch(f'/teacher/homeworks/{self.homeworks[0].id}', {
            'totalScore': -1.0
        }, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        wrong_res = self.client.patch(f'/teacher/homeworks/{self.homeworks[0].id}', {
            'course': self.courses[2].id
        }, **auth_h)
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_homework_answer(self):
        def assertMediaDownloadRes(response, media: Media):
            self.assertSuccess(response)
            self.assertTrue('Content-Type' in response)
            self.assertEqual(response['Content-Type'], 'text/plain')
            self.assertTrue('Content-Disposition' in response)
            self.assertEqual(response['Content-Disposition'], f'attachment; filename={media.filename}')

        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)
        homework_create_data_with_answer = {
            'course': self.courses[0].id,
            'availableSince': timezone.now().isoformat(),
            'deadline': (timezone.now() + timedelta(days=7)).isoformat(),
            'status': 0,
            'totalScore': 100.0,
            'name': 'testHw',
            'description': ['d1', 'd2'],
            'attachments': [str(self.test_media1.token), str(self.test_media2.token)],
            'answer': str(self.test_media1.token)
        }
        create_res = self.client.post('/teacher/homeworks', homework_create_data_with_answer, **auth_h)
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        created_data = create_res.json()
        self.assertSchema(created_data, self.homework_schema)

        get_answer_res = self.client.get(f'/teacher/homeworks/{created_data["id"]}/answer', **auth_h)
        assertMediaDownloadRes(get_answer_res, self.test_media1)

        update_answer_res = self.client.patch(f'/teacher/homeworks/{created_data["id"]}', {
            'answer': str(self.test_media2.token)
        }, **auth_h)
        self.assertSuccess(update_answer_res)
        get_answer_res = self.client.get(f'/teacher/homeworks/{created_data["id"]}/answer', **auth_h)
        assertMediaDownloadRes(get_answer_res, self.test_media2)

        remove_answer_res = self.client.patch(f'/teacher/homeworks/{created_data["id"]}', {
            'answer': None
        }, **auth_h)
        self.assertSuccess(remove_answer_res)
        get_answer_res = self.client.get(f'/teacher/homeworks/{created_data["id"]}/answer', **auth_h)
        self.assertEqual(get_answer_res.status_code, status.HTTP_404_NOT_FOUND)
