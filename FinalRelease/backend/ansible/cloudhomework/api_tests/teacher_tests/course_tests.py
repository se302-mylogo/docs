import random
from datetime import datetime, timedelta
from typing import ClassVar, Dict, List

from rest_framework import status

from cloudhomework.api_models import Course
from cloudhomework.api_tests.base import BaseAPITest


class TeacherCourseTests(BaseAPITest):
    course_data: ClassVar[Dict]
    courses: List[Course]
    course_schema = ['id', 'createAt', 'updateAt', 'startDate', 'endDate', 'points', 'teacher', 'cover', 'description',
                     'references']

    @classmethod
    def setUpTestData(cls):
        super(TeacherCourseTests, cls).setUpTestData()
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
                'cover': cls.test_media1,
                'teacher': cls.teachers[0],
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse4',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media2,
                'teacher': cls.teachers[1],
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse5',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media2,
                'teacher': cls.teachers[1],
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse6',
                'start_date': datetime.now().isoformat(),
                'end_date': (datetime.now() + timedelta(days=20)).isoformat(),
                'points': 1.0,
                'cover': cls.test_media2,
                'teacher': cls.teachers[1],
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            }
        ]
        cls.course_data = [
            {
                'name': 'testCourse1',
                'start_date': f'{datetime.now().isoformat()}',
                'end_date': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
                'points': 1.0,
                'cover': str(cls.test_media1.token),
                'teacher': cls.teachers[0].id,
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse2',
                'start_date': f'{datetime.now().isoformat()}',
                'end_date': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
                'points': 1.0,
                'cover': str(cls.test_media1.token),
                'teacher': cls.teachers[0].id,
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse3',
                'start_date': f'{datetime.now().isoformat()}',
                'end_date': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
                'points': 1.0,
                'cover': str(cls.test_media1.token),
                'teacher': cls.teachers[0].id,
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse4',
                'start_date': f'{datetime.now().isoformat()}',
                'end_date': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
                'points': 1.0,
                'cover': str(cls.test_media2.token),
                'teacher': cls.teachers[1].id,
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse5',
                'start_date': f'{datetime.now().isoformat()}',
                'end_date': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
                'points': 1.0,
                'cover': str(cls.test_media2.token),
                'teacher': cls.teachers[1].id,
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            },
            {
                'name': 'testCourse6',
                'start_date': f'{datetime.now().isoformat()}',
                'end_date': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
                'points': 1.0,
                'cover': str(cls.test_media2.token),
                'teacher': cls.teachers[1].id,
                'description': ['d1', 'd2'],
                'references': ['r1', 'r2'],
            }
        ]
        cls.courses = [Course.objects.create(**c) for c in course_create_data]
        cls.students[0].selected_courses.add(cls.courses[0], cls.courses[1], cls.courses[3])
        cls.students[1].selected_courses.add(cls.courses[2], cls.courses[4], cls.courses[5])

    def test_courses_list(self):
        auth_h = self.get_creds(self.teachers[0])
        courses_list_res = self.client.get('/teacher/courses', **auth_h)
        self.assertSuccess(courses_list_res)
        courses_list = courses_list_res.json()
        self.assertList(courses_list, len(self.courses))
        ret_id_list = [c['id'] for c in courses_list['results']]
        ret_id_list.sort()
        courses_id_list = [c.id for c in self.courses]
        self.assertListEqual(ret_id_list, courses_id_list)
        course = courses_list['results'][0]
        self.assertSchema(course, self.course_schema)
        self.assertTrue(isinstance(course['teacher'], dict))
        self.assertTrue(isinstance(course['cover'], dict))

    def test_courses_list_filter(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)
        courses_list_res = self.client.get('/teacher/courses', {
            'search': 'testCourse'
        }, **auth_h)
        self.assertSuccess(courses_list_res)
        courses_list = courses_list_res.json()
        self.assertList(courses_list, len(self.courses))
        search_courses_list_res = self.client.get('/teacher/courses', {
            'search': 'testCourse1'
        }, **auth_h)
        self.assertSuccess(search_courses_list_res)
        search_list = search_courses_list_res.json()
        self.assertList(search_list, 1)

        my_list_res = self.client.get('/teacher/courses', {
            'my': 'true',
            'fields': 'id,name'
        }, **auth_h)
        self.assertEqual(my_list_res.status_code, status.HTTP_200_OK)
        my_list = my_list_res.json()
        self.assertList(my_list, test_teacher.opened_courses.count())
        ret_id_list = [c['id'] for c in my_list['results']]
        my_id_list = [c.id for c in test_teacher.opened_courses.all()]
        self.assertListEqual(ret_id_list, my_id_list)
        my_course = my_list['results'][0]
        self.assertSchema(my_course, ['id', 'name'])
        self.assertEqual(len(my_course.keys()), 2)

    def test_course_users(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)

        denied_res = self.client.get(f'/teacher/courses/{self.courses[4].id}/users', **auth_h)
        self.assertEqual(denied_res.status_code, status.HTTP_403_FORBIDDEN)

        test_course = random.choice(test_teacher.opened_courses.all())
        user_list_res = self.client.get(f'/teacher/courses/{test_course.id}/users', **auth_h)
        self.assertEqual(user_list_res.status_code, status.HTTP_200_OK)
        self.assertList(user_list_res.json(), 1)

    def test_create_course(self):
        course_create_data = {
            'name': 'testCourse1',
            'startDate': f'{datetime.now().isoformat()}',
            'endDate': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
            'points': 1.0,
            'cover': str(self.test_media1.token),
            'description': ['d1', 'd2'],
            'references': ['r1', 'r2'],
        }
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)

        wrong_course_create_data1 = {
            'name': 'testCourse1',
            'startDate': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
            'endDate': f'{datetime.now().isoformat()}',
            'points': 1.0,
            'cover': str(self.test_media1.token),
            'description': ['d1', 'd2'],
            'references': ['r1', 'r2'],
        }
        wrong_create_res1 = self.client.post(f'/teacher/courses', wrong_course_create_data1, **auth_h)
        self.assertEqual(wrong_create_res1.status_code, status.HTTP_400_BAD_REQUEST)

        wrong_course_create_data2 = {
            'name': 'testCourse1',
            'startDate': f'{datetime.now().isoformat()}',
            'endDate': f'{(datetime.now() + timedelta(days=20)).isoformat()}',
            'points': -1.0,
            'cover': str(self.test_media1.token),
            'description': ['d1', 'd2'],
            'references': ['r1', 'r2'],
        }
        wrong_create_res2 = self.client.post(f'/teacher/courses', wrong_course_create_data2, **auth_h)
        self.assertEqual(wrong_create_res2.status_code, status.HTTP_400_BAD_REQUEST)

        create_res = self.client.post(f'/teacher/courses', course_create_data, **auth_h)
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        created_data = create_res.json()
        self.assertSchema(created_data, self.course_schema)
        self.assertTrue(all([
            isinstance(created_data['cover'], dict),
            isinstance(created_data['teacher'], dict),
        ]))
        self.assertEqual(created_data['teacher']['id'], test_teacher.id)

    def test_update_course(self):
        test_teacher = self.teachers[0]
        auth_h = self.get_creds(test_teacher)

        update_res = self.client.patch(f'/teacher/courses/{self.courses[0].id}', {
            'startDate': f'{(datetime.now() + timedelta(days=200)).isoformat()}'
        }, **auth_h)
        self.assertEqual(update_res.status_code, status.HTTP_400_BAD_REQUEST)

        update_res = self.client.patch(f'/teacher/courses/{self.courses[0].id}', {
            'points': -1.0
        }, **auth_h)
        self.assertEqual(update_res.status_code, status.HTTP_400_BAD_REQUEST)

        update_res = self.client.patch(f'/teacher/courses/{self.courses[0].id}', {
            'name': 'test'
        }, **auth_h)
        self.assertSuccess(update_res)
        updated_data = update_res.json()
        self.assertSchema(updated_data, self.course_schema)
        self.assertEqual(updated_data['name'], 'test')
