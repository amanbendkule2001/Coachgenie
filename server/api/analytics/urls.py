from django.urls import path
from .views import (
    DashboardStatsView,
    StudentPerformanceView,
    RevenueAnalyticsView,
    EnquiryFunnelView,
)

urlpatterns = [
    path("dashboard/",  DashboardStatsView.as_view(),    name="analytics-dashboard"),
    path("performance/",StudentPerformanceView.as_view(), name="analytics-performance"),
    path("revenue/",    RevenueAnalyticsView.as_view(),   name="analytics-revenue"),
    path("enquiries/",  EnquiryFunnelView.as_view(),      name="analytics-enquiries"),
]
