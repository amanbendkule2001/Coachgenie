"""
api/activities/serializers.py
Maps frontend field names → Django model field names
"""
from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    # Frontend sends "type", Django model has "activity_type"
    type = serializers.ChoiceField(
        choices=["Event", "Holiday", "Exam", "Workshop", "Meeting", "Other"],
        source="activity_type",
        required=False,
        default="Event"
    )
    # Frontend sends "date", Django model has "start_date"
    date = serializers.DateField(
        source="start_date",
        required=False,
        allow_null=True
    )

    class Meta:
        model  = Activity
        fields = [
            "id", "title", "description", "location", "color",
            "type",           # → activity_type
            "date",           # → start_date
            "activity_type",  # also accept directly
            "start_date",     # also accept directly
            "end_date", "start_time",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]

    def to_representation(self, instance):
        """Return both field name versions so frontend can read either."""
        data = super().to_representation(instance)
        data["type"]          = instance.activity_type
        data["date"]          = str(instance.start_date) if instance.start_date else None
        data["activity_type"] = instance.activity_type
        data["start_date"]    = str(instance.start_date) if instance.start_date else None
        return data
