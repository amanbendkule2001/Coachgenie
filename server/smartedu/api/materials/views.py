from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Material
from .serializers import MaterialSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    serializer_class = MaterialSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["file_type","subject","course"]
    search_fields    = ["title","description","subject"]
    ordering_fields  = ["created_at","title"]

    def get_queryset(self):
        return Material.objects.filter(tutor=self.request.user).select_related("course")

    def perform_create(self, serializer):
        serializer.save(tutor=self.request.user)
