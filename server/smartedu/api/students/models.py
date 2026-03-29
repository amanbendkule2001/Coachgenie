"""
api/students/models.py
"""

from django.db import models
from api.users.models import Tutor


class Student(models.Model):
    STATUS_CHOICES = [
        ("Active",   "Active"),
        ("Inactive", "Inactive"),
        ("At Risk",  "At Risk"),
        ("Graduated","Graduated"),
    ]

    tutor       = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="students")
    name        = models.CharField(max_length=150)
    email       = models.EmailField()
    phone       = models.CharField(max_length=20, blank=True)
    avatar      = models.ImageField(upload_to="student_avatars/", null=True, blank=True)
    grade       = models.CharField(max_length=50, blank=True)
    subject     = models.CharField(max_length=100, blank=True)
    score       = models.FloatField(default=0.0, help_text="Current average score 0-100")
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    enrolled_at = models.DateField(null=True, blank=True)
    notes       = models.TextField(blank=True)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table  = "students"
        ordering  = ["name"]
        unique_together = [["tutor", "email"]]

    def __str__(self):
        return f"{self.name} ({self.grade})"
