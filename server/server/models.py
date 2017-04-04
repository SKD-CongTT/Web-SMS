from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    requirements = models.ManyToManyField('self', blank=True)
    cost = models.PositiveIntegerField()

class NormalClass(models.Model):
	name = models.CharField(max_length=50)

class Student(User):
	major = models.CharField(max_length=100)
	bio = models.TextField()
	type = models.PositiveIntegerField()
