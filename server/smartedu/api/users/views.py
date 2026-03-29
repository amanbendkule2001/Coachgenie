"""
api/users/views.py
"""

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Tutor
from .serializers import (
    TutorSerializer, TutorCreateSerializer, TutorUpdateSerializer,
    ChangePasswordSerializer, SmartEduTokenSerializer,
)


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/ — returns access + refresh + user profile."""
    permission_classes = [AllowAny]
    serializer_class   = SmartEduTokenSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/users/register/ — create a new tutor account."""
    permission_classes = [AllowAny]
    serializer_class   = TutorCreateSerializer


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/users/me/ — current tutor's profile."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return TutorUpdateSerializer
        return TutorSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/users/change-password/"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"old_password": "Incorrect password."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"detail": "Password updated successfully."})
