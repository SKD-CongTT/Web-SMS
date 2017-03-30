from rest_framework import serializers
from server.models import *

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('name', 'description')

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ('cid', 'name','score')
