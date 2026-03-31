from rest_framework.routers import DefaultRouter
from .views import TestViewSet, MarkViewSet
router = DefaultRouter()
router.register(r"tests_marks", MarkViewSet, basename="mark")
router.register(r"marks", TestViewSet, basename="test")
urlpatterns = router.urls
