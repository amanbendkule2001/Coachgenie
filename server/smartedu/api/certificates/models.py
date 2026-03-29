import uuid
from django.db import models
from api.users.models import Tutor
from api.students.models import Student
from api.courses.models import Course

class Certificate(models.Model):
    TYPE_CHOICES = [("Completion","Completion"),("Excellence","Excellence"),
                    ("Participation","Participation"),("Achievement","Achievement")]

    tutor        = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="certificates")
    student      = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="certificates")
    course       = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="certificates")
    title        = models.CharField(max_length=200)
    cert_type    = models.CharField(max_length=20, choices=TYPE_CHOICES, default="Completion")
    issue_date   = models.DateField()
    cert_number  = models.CharField(max_length=50, unique=True, default="")
    description  = models.TextField(blank=True)
    file         = models.FileField(upload_to="certificates/", null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "certificates"
        ordering = ["-issue_date"]

    def save(self, *args, **kwargs):
        if not self.cert_number:
            self.cert_number = f"CERT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.cert_number} — {self.student.name}"
