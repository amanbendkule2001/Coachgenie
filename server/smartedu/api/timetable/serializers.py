"""
api/timetable/serializers.py
Maps frontend field names → Django model field names
"""
from rest_framework import serializers
from .models import TimetableSlot


class TimetableSlotSerializer(serializers.ModelSerializer):
    # Frontend sends "type", Django model has "class_type"
    type = serializers.ChoiceField(
        choices=["Online", "Offline"],
        source="class_type",
        required=False,
        default="Online"
    )
    # Frontend sends "time", Django model has "start_time"
    time = serializers.TimeField(
        source="start_time",
        required=False,
        allow_null=True
    )

    class Meta:
        model  = TimetableSlot
        fields = [
            "id", "day", "subject", "location", "notes",
            "type",         # → class_type
            "time",         # → start_time
            "start_time",   # also accept directly
            "end_time",
            "class_type",   # also accept directly
            "course", "student", "is_active",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]

    def to_representation(self, instance):
        """Return both field name versions so frontend can read either."""
        data = super().to_representation(instance)
        data["type"]       = instance.class_type
        data["time"]       = str(instance.start_time) if instance.start_time else None
        data["class_type"] = instance.class_type
        data["start_time"] = str(instance.start_time) if instance.start_time else None
        return data
