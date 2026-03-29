from django.db import models
from api.users.models import Tutor
from api.students.models import Student
from api.courses.models import Course

class Test(models.Model):
    STATUS_CHOICES = [("Scheduled","Scheduled"),("Completed","Completed"),("Cancelled","Cancelled")]

    tutor       = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="tests")
    course      = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="tests")
    title       = models.CharField(max_length=200)
    subject     = models.CharField(max_length=100)
    date        = models.DateField()
    total_marks = models.FloatField(default=100)
    status      = models.CharField(max_length=15, choices=STATUS_CHOICES, default="Scheduled")
    notes       = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tests"
        ordering = ["-date"]

    def __str__(self):
        return f"{self.title} ({self.date})"

class Mark(models.Model):
    test       = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="marks")
    student    = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="marks")
    marks      = models.FloatField()
    percentage = models.FloatField(blank=True)
    remarks    = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table       = "marks"
        unique_together = [["test","student"]]

    def save(self, *args, **kwargs):
        if self.test.total_marks:
            self.percentage = round((self.marks / self.test.total_marks) * 100, 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.name} — {self.test.title}: {self.marks}"
