from rest_framework import serializers
from server.models import *

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name', 'cost', 'description', 'requirements', 'active')

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'first_name', 'last_name', 
            'username', 'password', 'email', 
            'major', 'bio', 'type')

class NormalClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalClass
        fields = ('name','course','semester','time')
