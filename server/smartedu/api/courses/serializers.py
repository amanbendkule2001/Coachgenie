"""
api/courses/serializers.py
"""

from rest_framework import serializers
from .models import Course
from api.students.serializers import StudentSummarySerializer


class CourseSerializer(serializers.ModelSerializer):
    student_count = serializers.IntegerField(read_only=True)
    students_detail = StudentSummarySerializer(source="students", many=True, read_only=True)

    class Meta:
        model  = Course
        fields = [
            "id", "title", "description", "subject", "level", "status",
            "students", "students_detail", "student_count",
            "start_date", "end_date", "fee", "thumbnail",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]


class CourseSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Course
        fields = ["id", "title", "subject", "level", "status"]
