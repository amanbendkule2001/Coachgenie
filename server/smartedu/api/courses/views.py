"""
api/courses/views.py
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Course
from .serializers import CourseSerializer


class CourseViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for courses.
    GET  /api/courses/?status=Active&subject=Math
    POST /api/courses/
    """
    serializer_class = CourseSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "level", "subject"]
    search_fields    = ["title", "description", "subject"]
    ordering_fields  = ["title", "created_at", "start_date", "fee"]
    ordering         = ["title"]

    def get_queryset(self):
        return Course.objects.filter(tutor=self.request.user).prefetch_related("students")

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
