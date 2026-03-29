from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import TimetableSlot
from .serializers import TimetableSlotSerializer

class TimetableSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimetableSlotSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["day","class_type","is_active"]
    search_fields    = ["subject","location"]
    ordering_fields  = ["day","start_time"]

    def get_queryset(self):
        return TimetableSlot.objects.filter(tutor=self.request.user).select_related("course","student")

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
