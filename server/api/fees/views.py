from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Payment
from .serializers import PaymentSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status","method","student","course"]
    search_fields    = ["student__name","description","receipt_no"]
    ordering_fields  = ["due_date","amount","created_at"]

    def get_queryset(self):
        return Payment.objects.filter(tutor=self.request.user).select_related("student","course")

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
