"""
api/activities/serializers.py
Maps frontend field names → Django model field names
"""
from rest_framework import serializers
from .models import Activity

from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    # Explicit required fields
    title = serializers.CharField(required=True)
    description = serializers.CharField(required=True)

    # Map frontend → backend
    type = serializers.ChoiceField(
        choices=["Event", "Holiday", "Activity", "Test"],
        source="activity_type",
        required=True
    )

    date = serializers.DateField(
        source="start_date",
        required=True
    )

    class Meta:
        model = Activity
        fields = [
            "id",
            "title",
            "description",
            "type",
            "date",
        ]
        read_only_fields = ["id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Ensure frontend gets expected format
        data["type"] = instance.activity_type
        data["date"] = str(instance.start_date) if instance.start_date else None

        return data
