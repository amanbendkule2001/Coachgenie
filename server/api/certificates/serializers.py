from rest_framework import serializers
from .models import Certificate

class CertificateSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True, allow_null=True)

    class Meta:
        model  = Certificate
        fields = ["id","student","student_name","course","course_title","title","cert_type",
                  "issue_date","cert_number","description","file","created_at"]
        read_only_fields = ["id","tutor","cert_number","created_at"]
