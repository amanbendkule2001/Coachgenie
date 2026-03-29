from django.db import models
from api.users.models import Tutor

class Enquiry(models.Model):
    STAGE_CHOICES = [("New","New"),("Contacted","Contacted"),("Interested","Interested"),
                     ("Trial","Trial"),("Enrolled","Enrolled"),("Lost","Lost")]
    SOURCE_CHOICES = [("Referral","Referral"),("Social Media","Social Media"),("Website","Website"),
                      ("Walk-in","Walk-in"),("Other","Other")]

    tutor       = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="enquiries")
    name        = models.CharField(max_length=150)
    email       = models.EmailField(blank=True)
    phone       = models.CharField(max_length=20)
    subject     = models.CharField(max_length=100, blank=True)
    grade       = models.CharField(max_length=50, blank=True)
    stage       = models.CharField(max_length=15, choices=STAGE_CHOICES, default="New")
    source      = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="Other")
    notes       = models.TextField(blank=True)
    follow_up   = models.DateField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "enquiries"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.stage}"
