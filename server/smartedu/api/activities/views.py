from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Activity
from .serializers import ActivitySerializer

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["activity_type"]
    search_fields    = ["title","description","location"]
    ordering_fields  = ["start_date","created_at"]

    def get_queryset(self):
        qs = Activity.objects.filter(tutor=self.request.user)
        month = self.request.query_params.get("month")
        year  = self.request.query_params.get("year")
        if month and year:
            qs = qs.filter(start_date__month=month, start_date__year=year)
        return qs

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
