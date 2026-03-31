from django.db import models
from api.users.models import Tutor
from api.courses.models import Course
from api.students.models import Student
from django.core.exceptions import ValidationError

class TimetableSlot(models.Model):

    # ✅ Day
    DAY_CHOICES = [
        ("Monday","Monday"),("Tuesday","Tuesday"),("Wednesday","Wednesday"),
        ("Thursday","Thursday"),("Friday","Friday"),("Saturday","Saturday"),("Sunday","Sunday")
    ]

    # ✅ Class Type (REAL meaning)
    CLASS_TYPE_CHOICES = [
        ("Lecture","Lecture"),
        ("Tutorial","Tutorial"),
        ("Lab","Lab"),
        ("Test","Test"),
        ("Revision","Revision"),
    ]

    # ✅ Mode (Online/Offline)
    MODE_CHOICES = [
        ("Online","Online"),
        ("Offline","Offline"),
    ]

    tutor   = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="timetable_slots")
    course  = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="slots")
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name="slots")

    day        = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time   = models.TimeField()

    subject = models.CharField(max_length=100)

    # ✅ FIXED
    class_type = models.CharField(max_length=15, choices=CLASS_TYPE_CHOICES, default="Lecture")
    mode       = models.CharField(max_length=10, choices=MODE_CHOICES, default="Online")

    # Optional physical location (like "Room 101")
    location   = models.CharField(max_length=200, blank=True)

    notes      = models.TextField(blank=True)
    is_active  = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "timetable_slots"
        ordering = ["day", "start_time"]

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")

        clash = TimetableSlot.objects.filter(
            tutor=self.tutor,
            day=self.day,
            start_time__lt=self.end_time,
            end_time__gt=self.start_time,
        ).exclude(id=self.id)

        if clash.exists():
            raise ValidationError("Time slot clashes with another class")

    def __str__(self):
        return f"{self.day} {self.start_time} — {self.subject}"
