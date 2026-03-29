from django.db import models
from api.users.models import Tutor

class Activity(models.Model):
    TYPE_CHOICES = [("Event","Event"),("Holiday","Holiday"),("Exam","Exam"),
                    ("Workshop","Workshop"),("Meeting","Meeting"),("Other","Other")]

    tutor        = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="activities")
    title        = models.CharField(max_length=200)
    description  = models.TextField(blank=True)
    activity_type = models.CharField(max_length=15, choices=TYPE_CHOICES, default="Event")
    start_date   = models.DateField()
    end_date     = models.DateField(null=True, blank=True)
    start_time   = models.TimeField(null=True, blank=True)
    location     = models.CharField(max_length=200, blank=True)
    color        = models.CharField(max_length=20, default="primary")
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "activities"
        ordering = ["start_date"]

    def __str__(self):
        return f"{self.title} ({self.start_date})"
