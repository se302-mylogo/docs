"""url_shortener URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter

from cloudhomework.api_views import student_views, teacher_views, auth_views, media_views
from cloudhomework_backend.router import NestedSingletonViewRouter, SingletonViewRouter

student_router = DefaultRouter(trailing_slash=False)
student_router.register('courses', student_views.CourseViewSet, 'student_courses')
student_router.register('homeworks', student_views.HomeworkViewSet, 'student_homeworks')
student_submit_router = NestedSingletonViewRouter(student_router, 'homeworks', lookup='homework', trailing_slash=False)
student_submit_router.register('submit', student_views.HomeworkSubmitViewSet, 'student_submit')

teacher_router = DefaultRouter(trailing_slash=False)
teacher_router.register('courses', teacher_views.CourseViewSet, 'teacher_courses')
teacher_router.register('homeworks', teacher_views.HomeworkViewSet, 'teacher_homeworks')
teacher_router.register('submits', teacher_views.HomeworkSubmitViewSet, 'teacher_submits')

continuous_review_router = SingletonViewRouter(trailing_slash=False)
continuous_review_router.register('reviews', teacher_views.ContinuousReviewViewSet, 'teacher_reviews')

admin_router = DefaultRouter()

auth_router = DefaultRouter(trailing_slash=False)
auth_router.register('', auth_views.AuthViewSet, 'auths')

media_router = DefaultRouter(trailing_slash=False)
media_router.register('medias', media_views.MediaViewSet, 'medias')

urlpatterns = [
    path('super-admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('student/', include(student_router.urls + student_submit_router.urls)),
    path('teacher/', include(teacher_router.urls + continuous_review_router.urls)),
    path('auth/', include(auth_router.urls)),
    path('', include(media_router.urls))
]
