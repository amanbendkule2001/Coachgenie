from django.db import models
from api.users.models import Tutor
import re
from django.core.exceptions import ValidationError

class Enquiry(models.Model):

    # ✅ Better structured choices (scalable)
    class StageChoices(models.TextChoices):
        NEW = "New", "New"
        CONTACTED = "Contacted", "Contacted"
        INTERESTED = "Interested", "Interested"
        TRIAL = "Trial", "Trial"
        CONVERTED = "Converted", "Converted"
        REJECTED = "Rejected", "Rejected"

    class SourceChoices(models.TextChoices):
        REFERRAL = "Referral", "Referral"
        SOCIAL = "Social Media", "Social Media"
        WEBSITE = "Website", "Website"
        WALKIN = "Walk-in", "Walk-in"
        OTHER = "Other", "Other"

    # 🔗 Relations
    tutor = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name="enquiries",
        db_index=True
    )

    # 🧾 Basic Info
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=15)  # tighter control

    # 📚 Academic Info
    subject = models.CharField(max_length=100, blank=True, db_index=True)
    grade = models.CharField(max_length=50, blank=True)

    # 📊 Status Tracking
    stage = models.CharField(
        max_length=15,
        choices=StageChoices.choices,
        default=StageChoices.NEW,
        db_index=True
    )

    source = models.CharField(
        max_length=20,
        choices=SourceChoices.choices,
        default=SourceChoices.OTHER,
        db_index=True
    )

    # 📝 Additional Info
    notes = models.TextField(blank=True)
    follow_up = models.DateField(null=True, blank=True, db_index=True)

    # ⏱️ Timestamps
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "enquiries"
        ordering = ["-created_at"]

    def clean(self):
        if self.phone and not re.match(r'^\d{10}$', self.phone):
            raise ValidationError("Phone number must be 10 digits")

    def __str__(self):
        return f"{self.name} — {self.stage}"
