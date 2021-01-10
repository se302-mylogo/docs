import random
from datetime import datetime, timedelta
from typing import ClassVar, Dict, List

from rest_framework import status

from cloudhomework.api_models import Course
from cloudhomework.api_tests.base import BaseAPITest


class StudentCourseTests(BaseAPITest):
    course_data: ClassVar[Dict]
    courses: List[Course]
    course_schema = ['id', 'createAt', 'updateAt', 'startDate', 'endDate', 'points', 'teacher', 'cover', 'description',
                     'references']

    @classmethod
    def setUpTestData(cls):
        super(StudentCourseTests, cls).setUpTestData()
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
        auth_h = self.get_creds(self.students[0])
        courses_list_res = self.client.get('/student/courses', **auth_h)
        self.assertEqual(courses_list_res.status_code, status.HTTP_200_OK)
        courses_list = courses_list_res.json()
        self.assertSchema(courses_list, ['count', 'results'])
        self.assertEqual(courses_list['count'], len(self.courses))
        ret_id_list = [c['id'] for c in courses_list['results']]
        ret_id_list.sort()
        courses_id_list = [c.id for c in self.courses]
        self.assertListEqual(ret_id_list, courses_id_list)
        course = courses_list['results'][0]
        self.assertSchema(course, self.course_schema)
        self.assertTrue(isinstance(course['teacher'], dict))
        self.assertTrue(isinstance(course['cover'], dict))

    def test_courses_list_filter(self):
        test_student = self.students[0]
        auth_h = self.get_creds(test_student)
        courses_list_res = self.client.get('/student/courses', {
            'search': 'testCourse'
        }, **auth_h)
        self.assertEqual(courses_list_res.status_code, status.HTTP_200_OK)
        courses_list = courses_list_res.json()
        self.assertList(courses_list, len(self.courses))
        search_courses_list_res = self.client.get('/student/courses', {
            'search': 'testCourse1'
        }, **auth_h)
        search_list = search_courses_list_res.json()
        self.assertList(search_list, 1)

        my_list_res = self.client.get('/student/courses', {
            'my': 'true',
            'fields': 'id,name'
        }, **auth_h)
        self.assertEqual(my_list_res.status_code, status.HTTP_200_OK)
        my_list = my_list_res.json()
        self.assertList(my_list, test_student.selected_courses.count())
        ret_id_list = [c['id'] for c in my_list['results']]
        my_id_list = [c.id for c in test_student.selected_courses.all()]
        self.assertListEqual(ret_id_list, my_id_list)
        my_course = my_list['results'][0]
        self.assertSchema(my_course, ['id', 'name'])
        self.assertEqual(len(my_course.keys()), 2)

    def test_join_course(self):
        test_student = self.students[0]
        auth_h = self.get_creds(test_student)

        to_join_course = self.courses[2]
        join_failed_res = self.client.post(f'/student/courses/{to_join_course.id}/join', {
            'student': 1212211212
        }, **auth_h)
        self.assertEqual(join_failed_res.status_code, status.HTTP_403_FORBIDDEN)

        join_success_res = self.client.post(f'/student/courses/{to_join_course.id}/join', {
            'student': test_student.id
        }, **auth_h)
        self.assertEqual(join_success_res.status_code, status.HTTP_200_OK)

        my_id_list = [c.id for c in test_student.selected_courses.all()]
        self.assertTrue(to_join_course.id in my_id_list)

    def test_leave_course(self):
        test_student = self.students[0]
        auth_h = self.get_creds(test_student)

        to_leave_course = self.courses[0]
        join_failed_res = self.client.post(f'/student/courses/{to_leave_course.id}/leave', {
            'student': 1212211212
        }, **auth_h)
        self.assertEqual(join_failed_res.status_code, status.HTTP_403_FORBIDDEN)

        join_success_res = self.client.post(f'/student/courses/{to_leave_course.id}/leave', {
            'student': test_student.id
        }, **auth_h)
        self.assertEqual(join_success_res.status_code, status.HTTP_200_OK)

        my_id_list = [c.id for c in test_student.selected_courses.all()]
        self.assertTrue(to_leave_course.id not in my_id_list)

    def test_course_users(self):
        test_student = self.students[0]
        auth_h = self.get_creds(test_student)

        denied_res = self.client.get(f'/student/courses/{self.courses[2].id}/users', **auth_h)
        self.assertEqual(denied_res.status_code, status.HTTP_403_FORBIDDEN)

        test_course = random.choice(test_student.selected_courses.all())
        user_list_res = self.client.get(f'/student/courses/{test_course.id}/users', **auth_h)
        self.assertEqual(user_list_res.status_code, status.HTTP_200_OK)
        self.assertList(user_list_res.json(), 1)

    def test_course_joined(self):
        test_student = self.students[0]
        auth_h = self.get_creds(test_student)

        notfound_res = self.client.get(f'/student/courses/1000000/joined', **auth_h)
        self.assertEqual(notfound_res.status_code, status.HTTP_404_NOT_FOUND)

        joined_res = self.client.get(f'/student/courses/{self.courses[0].id}/joined', **auth_h)
        self.assertEqual(joined_res.status_code, status.HTTP_409_CONFLICT)

        notjoined_res = self.client.get(f'/student/courses/{self.courses[2].id}/joined', **auth_h)
        self.assertEqual(notjoined_res.status_code, status.HTTP_200_OK)


