from django.db import models
from api.users.models import Tutor
from api.students.models import Student
from api.courses.models import Course

class Payment(models.Model):
    STATUS_CHOICES = [("Paid","Paid"),("Pending","Pending"),("Overdue","Overdue"),("Partial","Partial")]
    METHOD_CHOICES = [("Cash","Cash"),("UPI","UPI"),("Bank Transfer","Bank Transfer"),("Cheque","Cheque"),("Online","Online")]

    tutor       = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="payments")
    student     = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="payments")
    course      = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    amount      = models.DecimalField(max_digits=10, decimal_places=2)
    due_date    = models.DateField()
    paid_date   = models.DateField(null=True, blank=True)
    status      = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")
    method      = models.CharField(max_length=20, choices=METHOD_CHOICES, blank=True)
    description = models.CharField(max_length=255, blank=True)
    receipt_no  = models.CharField(max_length=50, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payments"
        ordering = ["-due_date"]

    def __str__(self):
        return f"{self.student.name} — ₹{self.amount} ({self.status})"
