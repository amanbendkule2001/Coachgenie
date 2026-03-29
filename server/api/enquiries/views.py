from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Enquiry
from .serializers import EnquirySerializer

class EnquiryViewSet(viewsets.ModelViewSet):
    serializer_class = EnquirySerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["stage","source","subject"]
    search_fields    = ["name","email","phone","subject","notes"]
    ordering_fields  = ["created_at","follow_up"]

    def get_queryset(self):
        return Enquiry.objects.filter(tutor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
