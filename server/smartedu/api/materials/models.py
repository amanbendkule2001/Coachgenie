from django.db import models
from api.users.models import Tutor
from api.courses.models import Course

class Material(models.Model):
    TYPE_CHOICES = [("PDF","PDF"),("Video","Video"),("Doc","Doc"),("Slides","Slides"),("Link","Link"),("Other","Other")]

    tutor       = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="materials")
    course      = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="materials")
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file        = models.FileField(upload_to="materials/", null=True, blank=True)
    link        = models.URLField(blank=True)
    file_type   = models.CharField(max_length=10, choices=TYPE_CHOICES, default="PDF")
    subject     = models.CharField(max_length=100, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "materials"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
