from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    course_name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=1000)

class NormalClass(models.Model):
	classname = models.CharField(max_length=50)

class Student(User):
	major = models.CharField(max_length=100)
	bio = models.TextField()
	type = models.IntegerField()

