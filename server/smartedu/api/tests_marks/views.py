from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Test, Mark
from .serializers import TestSerializer, MarkSerializer

class TestViewSet(viewsets.ModelViewSet):
    serializer_class = TestSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status","subject"]
    search_fields    = ["title","subject"]
    ordering_fields  = ["date","created_at"]

    def get_queryset(self):
        return Test.objects.filter(tutor=self.request.user).prefetch_related("marks")

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)

class MarkViewSet(viewsets.ModelViewSet):
    serializer_class = MarkSerializer
    filter_backends  = [DjangoFilterBackend]
    filterset_fields = ["test","student"]

    def get_queryset(self):
        return Mark.objects.filter(test__tutor=self.request.user).select_related("test","student")
