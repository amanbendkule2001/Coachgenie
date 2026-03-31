"""
SmartEdu API — Master URL Router
All endpoints are prefixed with /api/
"""

from django.urls import path, include

urlpatterns = [
    path("users/",        include("api.users.urls")),
    path("students/",     include("api.students.urls")),
    path("courses/",      include("api.courses.urls")),
    path("timetable/",    include("api.timetable.urls")),
    path("",        include("api.tests_marks.urls")),
    path("materials/",    include("api.materials.urls")),
    path("fees/",         include("api.fees.urls")),
    path("enquiries/",    include("api.enquiries.urls")),
    path("todos/",        include("api.todos.urls")),
    path("activities/",   include("api.activities.urls")),
    path("certificates/", include("api.certificates.urls")),
    path("analytics/",    include("api.analytics.urls")),
]
