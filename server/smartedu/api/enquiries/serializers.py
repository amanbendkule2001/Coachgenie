"""
api/enquiries/serializers.py
Maps frontend field names → Django model field names
"""
from rest_framework import serializers
from .models import Enquiry

"""
api/enquiries/serializers.py
Clean API contract (camelCase) → mapped to Django model (snake_case)
"""

from rest_framework import serializers
from .models import Enquiry


class EnquirySerializer(serializers.ModelSerializer):
    # Map frontend camelCase → backend snake_case
    followUp = serializers.DateField(
        source="follow_up",
        required=False,
        allow_null=True
    )

    def validate_phone(self, value):
        import re
        if not re.match(r'^\d{10}$', value):
            raise serializers.ValidationError("Phone number must be exactly 10 digits")
        return value

    class Meta:
        model = Enquiry
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "subject",      # Interested Course
            "grade",
            "stage",
            "source",
            "notes",
            "followUp",     # Only expose camelCase
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]
