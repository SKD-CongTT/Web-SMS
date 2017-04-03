from rest_framework import viewsets
from server.models import *
from server.serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework import permissions
from django.contrib.auth import hashers
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

# class ChangePasswordView(generics.UpdateAPIView):
#     '''
#     An endpoint for changing password.
#     '''
#     serializer_class = ChangePasswordSerializer
#     model = Student
#     permission_classes = (permissions.IsAuthenticated)

#     def get_object(self, queryset=None):
#         obj = self.request.user
#         return obj

#     def update(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(data=request.data)

#         if serializer.is_valid():
#             if not self.object.check_password(serializer.data.get("old_password")):
#                 return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
#             self.object.set_password(serializer.data.get("new_password"))
#             self.object.save()
#             return Response("Success.", status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
