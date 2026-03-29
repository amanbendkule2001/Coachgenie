from rest_framework.routers import DefaultRouter
from .views import TimetableSlotViewSet
router = DefaultRouter()
router.register(r"", TimetableSlotViewSet, basename="timetable")
urlpatterns = router.urls
