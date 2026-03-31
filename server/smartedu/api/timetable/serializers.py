from rest_framework import serializers
from .models import TimetableSlot


class TimetableSlotSerializer(serializers.ModelSerializer):

    # ✅ Class Type (Lecture, Lab, etc.)
    type = serializers.ChoiceField(
        choices=["Lecture", "Tutorial", "Lab", "Test", "Revision"],
        source="class_type",
        required=False,
        default="Lecture"
    )

    # ✅ Start Time mapping
    time = serializers.TimeField(
        source="start_time",
        required=False,
        allow_null=True
    )

    # ✅ Day
    day = serializers.ChoiceField(
        choices=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        required=False,
        default="Monday"
    )

    # ✅ Subject
    subject = serializers.CharField(
        required=False,
        allow_blank=True,
        default=""
    )

    # ✅ Location (Online / Offline)
    location = serializers.ChoiceField(
        choices=["Online", "Offline"],
        required=False,
        default="Online"
    )

    class Meta:
        model  = TimetableSlot
        fields = [
            "id",
            "day",
            "subject",
            "location",      # ✅ now correctly used
            "notes",
            "type",          # → class_type
            "time",          # → start_time
            "start_time",
            "end_time",
            "class_type",
            "course",
            "student",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "tutor", "created_at", "updated_at"]

    def validate(self, data):
        instance = TimetableSlot(**data)

        # attach tutor manually (since it's read_only)
        request = self.context.get("request")
        if request and hasattr(request.user, "id"):
            instance.tutor = request.user

        instance.clean()  # 🔥 THIS TRIGGERS YOUR VALIDATION

        return data

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Frontend compatibility
        data["type"]       = instance.class_type
        data["time"]       = str(instance.start_time) if instance.start_time else None
        data["class_type"] = instance.class_type
        data["start_time"] = str(instance.start_time) if instance.start_time else None

        return data
