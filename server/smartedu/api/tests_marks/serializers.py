"""
api/tests_marks/serializers.py
Maps frontend field names → Django model field names
"""
from rest_framework import serializers
from .models import Test, Mark


class MarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)

    class Meta:
        model  = Mark
        fields = [
            "id", "test", "student", "student_name",
            "marks", "percentage", "remarks", "created_at"
        ]
        read_only_fields = ["id", "percentage", "created_at"]


class TestSerializer(serializers.ModelSerializer):
    marks = MarkSerializer(many=True, read_only=True)

    # Frontend sends "totalMarks", Django model has "total_marks"
    totalMarks = serializers.FloatField(
        source="total_marks",
        required=False,
        default=100
    )
    # Frontend sends "testDate" or "date" — accept both
    testDate = serializers.DateField(
        source="date",
        required=False,
        allow_null=True
    )

    class Meta:
        model  = Test
        fields = [
            "id", "title", "subject", "status", "course", "notes",
            "date",        # accept directly
            "testDate",    # → date
            "total_marks", # accept directly
            "totalMarks",  # → total_marks
            "marks",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]

    def to_representation(self, instance):
        """Return both field name versions so frontend can read either."""
        data = super().to_representation(instance)
        data["totalMarks"] = instance.total_marks
        data["total_marks"] = instance.total_marks
        data["testDate"]   = str(instance.date) if instance.date else None
        data["date"]       = str(instance.date) if instance.date else None
        return data
