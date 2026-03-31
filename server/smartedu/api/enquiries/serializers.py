"""
api/enquiries/serializers.py
Maps frontend field names → Django model field names
"""
from rest_framework import serializers
from .models import Enquiry


class EnquirySerializer(serializers.ModelSerializer):
    # Frontend sends "followUp", Django model has "follow_up"
    followUp = serializers.DateField(
        source="follow_up",
        required=False,
        allow_null=True
    )

    class Meta:
        model  = Enquiry
        fields = [
            "id", "name", "email", "phone", "subject",
            "grade", "stage", "source", "notes",
            "followUp",   # → follow_up
            "follow_up",  # also accept directly
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]

    def to_representation(self, instance):
        """Return both field name versions so frontend can read either."""
        data = super().to_representation(instance)
        data["followUp"]  = str(instance.follow_up) if instance.follow_up else None
        data["follow_up"] = str(instance.follow_up) if instance.follow_up else None
        return data
