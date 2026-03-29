from django.db import models
from api.users.models import Tutor
from api.courses.models import Course
from api.students.models import Student

class TimetableSlot(models.Model):
    DAY_CHOICES = [("Monday","Monday"),("Tuesday","Tuesday"),("Wednesday","Wednesday"),
                   ("Thursday","Thursday"),("Friday","Friday"),("Saturday","Saturday"),("Sunday","Sunday")]
    TYPE_CHOICES = [("Online","Online"),("Offline","Offline")]

    tutor      = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="timetable_slots")
    course     = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="slots")
    student    = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name="slots")
    day        = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time   = models.TimeField()
    subject    = models.CharField(max_length=100)
    location   = models.CharField(max_length=200, blank=True)
    class_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="Online")
    notes      = models.TextField(blank=True)
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "timetable_slots"
        ordering = ["day","start_time"]

    def __str__(self):
        return f"{self.day} {self.start_time} — {self.subject}"
