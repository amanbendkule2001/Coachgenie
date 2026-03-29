"""
api/students/serializers.py
"""

from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Student
        fields = "__all__"
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]


class StudentSummarySerializer(serializers.ModelSerializer):
    """Lightweight serializer for dropdowns / nested references."""
    class Meta:
        model  = Student
        fields = ["id", "name", "grade", "subject", "status", "score"]
