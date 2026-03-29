"""
api/courses/models.py
"""

from django.db import models
from api.users.models import Tutor
from api.students.models import Student


class Course(models.Model):
    STATUS_CHOICES = [
        ("Active",    "Active"),
        ("Upcoming",  "Upcoming"),
        ("Completed", "Completed"),
        ("On Hold",   "On Hold"),
    ]
    LEVEL_CHOICES = [
        ("Beginner",     "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced",     "Advanced"),
    ]

    tutor       = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="courses")
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    subject     = models.CharField(max_length=100)
    level       = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="Beginner")
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    students    = models.ManyToManyField(Student, related_name="courses", blank=True)
    start_date  = models.DateField(null=True, blank=True)
    end_date    = models.DateField(null=True, blank=True)
    fee         = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    thumbnail   = models.ImageField(upload_to="course_thumbs/", null=True, blank=True)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "courses"
        ordering = ["title"]

    def __str__(self):
        return self.title

    @property
    def student_count(self):
        return self.students.count()
