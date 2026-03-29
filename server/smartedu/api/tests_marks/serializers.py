from rest_framework import serializers
from .models import Test, Mark

class MarkSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)

    class Meta:
        model  = Mark
        fields = ["id","test","student","student_name","marks","percentage","remarks","created_at"]
        read_only_fields = ["id","percentage","created_at"]

class TestSerializer(serializers.ModelSerializer):
    marks = MarkSerializer(many=True, read_only=True)

    class Meta:
        model  = Test
        fields = ["id","title","subject","date","total_marks","status","course","notes","marks","created_at","updated_at"]
        read_only_fields = ["id","tutor","created_at","updated_at"]
