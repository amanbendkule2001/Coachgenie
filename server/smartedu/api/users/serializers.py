"""
api/users/serializers.py
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Tutor


class TutorSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Tutor
        fields = ["id", "email", "name", "phone", "avatar", "bio", "subjects",
                  "is_active", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class TutorCreateSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = Tutor
        fields = ["email", "name", "phone", "bio", "subjects", "password", "password2"]

    def validate(self, data):
        if data["password"] != data.pop("password2"):
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return data

    def create(self, validated_data):
        return Tutor.objects.create_user(**validated_data)


class TutorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Tutor
        fields = ["name", "phone", "avatar", "bio", "subjects"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)


class SmartEduTokenSerializer(TokenObtainPairSerializer):
    """Extend JWT payload with tutor name + email."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["name"]  = user.name
        token["email"] = user.email
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = TutorSerializer(self.user).data
        return data
