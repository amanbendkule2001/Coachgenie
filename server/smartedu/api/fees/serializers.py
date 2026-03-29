from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    course_title = serializers.CharField(source="course.title", read_only=True, allow_null=True)

    class Meta:
        model  = Payment
        fields = ["id","student","student_name","course","course_title","amount","due_date",
                  "paid_date","status","method","description","receipt_no","created_at","updated_at"]
        read_only_fields = ["id","tutor","created_at","updated_at"]
