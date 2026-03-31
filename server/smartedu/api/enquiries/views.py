from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Enquiry
from .serializers import EnquirySerializer


class EnquiryViewSet(viewsets.ModelViewSet):
    serializer_class = EnquirySerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ["stage", "source", "subject"]
    search_fields    = ["name", "email", "phone", "subject", "notes"]
    ordering_fields  = ["created_at", "follow_up"]
    ordering         = ["-created_at"]

    def get_queryset(self):
        return Enquiry.objects.filter(tutor=self.request.user.tutor)

    def perform_create(self, serializer):
        from api.users.models import Tutor
        tutor = Tutor.objects.filter(user=self.request.user).first()
        if not tutor:
            raise Exception("Tutor not found")
        serializer.save(tutor=tutor)
