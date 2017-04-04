from rest_framework import viewsets
from server.models import *
from server.serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import permissions
from django.contrib.auth import hashers
from django.contrib.auth.models import User
from pprint import pprint

def normalize(data):
    res = {}
    for k in data:
        res[k] = data[k][0]
    return res

class CourseViewSet(viewsets.ModelViewSet):
    '''
    An endpoint for Manage All Courses
    '''
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
class StudentViewSet(viewsets.ModelViewSet):
    '''
    An endpoint for Manage All Students
    '''
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def create(self, request, pk=None):
        data = normalize(dict(request.data))
        data['password'] = hashers.make_password(data['password'])
        serializer = StudentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NormalClassViewSet(viewsets.ModelViewSet):
    '''
    An endpoint for Manage All Normal Class
    '''
    queryset = NormalClass.objects.all()
    serializer_class = NormalClassSerializer

