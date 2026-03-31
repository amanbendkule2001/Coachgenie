"""
api/activities/views.py
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Activity
from .serializers import ActivitySerializer


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activity_type"]
    search_fields    = ["title", "description", "location"]
    ordering_fields  = ["start_date", "created_at"]

    def get_queryset(self):
        qs    = Activity.objects.filter(tutor=self.request.user)
        month = self.request.query_params.get("month")
        year  = self.request.query_params.get("year")

        if month and year:
            # Strip any trailing slashes or whitespace the frontend may append
            month = str(month).strip().rstrip("/").strip()
            year  = str(year).strip().rstrip("/").strip()

            try:
                qs = qs.filter(
                    start_date__month=int(month),
                    start_date__year=int(year),
                )
            except (ValueError, TypeError):
                pass  # If still invalid, just return all activities

        return qs

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
