"""
api/students/serializers.py
"""

from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    # Map frontend field names → Django model field names
    course    = serializers.CharField(source="grade",       required=False, allow_blank=True)
    batch     = serializers.CharField(source="notes",       required=False, allow_blank=True)
    feeStatus = serializers.CharField(source="subject",     required=False, allow_blank=True)
    joinDate  = serializers.DateField(source="enrolled_at", required=False, allow_null=True)

    class Meta:
        model  = Student
        fields = [
            "id", "name", "email", "phone",
            "course", "batch", "feeStatus", "joinDate",
            "score", "status", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]

class StudentSummarySerializer(serializers.ModelSerializer):
    """Lightweight serializer for dropdowns / nested references."""
    class Meta:
        model  = Student
        fields = ["id", "name", "grade", "subject", "status", "score"]
