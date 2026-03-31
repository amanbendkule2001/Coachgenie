from rest_framework.routers import DefaultRouter
from .views import TestViewSet, MarkViewSet
router = DefaultRouter()
router.register(r"marks", MarkViewSet, basename="mark")
router.register(r"tests", TestViewSet, basename="test")
urlpatterns = router.urls
