from rest_framework.routers import DefaultRouter
from rest_framework_jwt.views import *
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import urls
from server.views import *
from pprint import pprint

router = DefaultRouter()
router.register(prefix='students', viewset=StudentViewSet)
router.register(prefix='normal_classes', viewset=NormalClassViewSet)
router.register(prefix='courses', viewset=CourseViewSet)
# router.register(prefix='change_password', viewset=ChangePasswordView)

urlpatterns = [
    url(r'^auth/token/refresh/$', refresh_jwt_token),
    url(r'^auth/token/obtain/$', obtain_jwt_token),
    url(r'^auth/', include(urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^', include(router.urls)),
]
