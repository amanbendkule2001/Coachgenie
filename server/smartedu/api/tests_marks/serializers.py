"""
api/tests_marks/serializers.py
Maps frontend field names → Django model field names
"""
from rest_framework import serializers
from .models import Test, Mark


class MarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)

    class Meta:
        model = Mark
        fields = [
            "id", "test", "student", "student_name",
            "marks", "percentage", "remarks", "created_at"
        ]
        read_only_fields = ["id", "percentage", "created_at"]


class TestSerializer(serializers.ModelSerializer):
    marks = MarkSerializer(many=True, read_only=True)

    title = serializers.CharField(required=True)
    subject = serializers.CharField(required=True)

    status = serializers.ChoiceField(
        choices=["Scheduled", "Completed", "Cancelled"],
        required=True
    )

    notes = serializers.CharField(required=False, allow_blank=True)

    totalMarks = serializers.FloatField(
        source="total_marks",
        required=True
    )

    date = serializers.DateField(required=True)

    class Meta:
        model = Test
        fields = [
            "id",
            "title",
            "subject",
            "status",
            "date",
            "totalMarks",
            "notes",
            "marks",
        ]
        read_only_fields = ["id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["totalMarks"] = instance.total_marks
        data["date"] = str(instance.date) if instance.date else None

        return data

    def validate_status(self, value):
        # Map frontend → backend
        mapping = {
            "upcoming": "Scheduled",
            "completed": "Completed"
        }
        return mapping.get(value, value)
