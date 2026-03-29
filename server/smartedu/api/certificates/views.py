from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Certificate
from .serializers import CertificateSerializer

class CertificateViewSet(viewsets.ModelViewSet):
    serializer_class = CertificateSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["cert_type","student","course"]
    search_fields    = ["student__name","cert_number","title"]
    ordering_fields  = ["issue_date","created_at"]

    def get_queryset(self):
        return Certificate.objects.filter(tutor=self.request.user).select_related("student","course")

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
