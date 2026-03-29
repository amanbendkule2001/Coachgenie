"""
api/students/views.py
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """
    GET    /api/students/          — list all students for current tutor
    POST   /api/students/          — create a new student
    GET    /api/students/{id}/     — retrieve a student
    PUT    /api/students/{id}/     — full update
    PATCH  /api/students/{id}/     — partial update
    DELETE /api/students/{id}/     — delete
    """
    serializer_class = StudentSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "grade", "subject"]
    search_fields    = ["name", "email", "phone", "grade"]
    ordering_fields  = ["name", "score", "created_at", "enrolled_at"]
    ordering         = ["name"]

    def get_queryset(self):
        return Student.objects.filter(tutor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
