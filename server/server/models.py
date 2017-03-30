from django.db import models
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator


class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
        
class Score(models.Model):
    cid = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    score = models.IntegerField()
