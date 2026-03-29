from rest_framework import serializers
from .models import TimetableSlot

class TimetableSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TimetableSlot
        fields = "__all__"
        read_only_fields = ["id","tutor","created_at","updated_at"]
