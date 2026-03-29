"""
SmartEdu — Root URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

admin.site.site_header  = "SmartEdu Admin"
admin.site.site_title   = "SmartEdu LMS"
admin.site.index_title  = "Dashboard"

urlpatterns = [
    # ── Admin ──────────────────────────────────────────────────
    path("admin/", admin.site.urls),

    # ── JWT Auth ───────────────────────────────────────────────
    path("api/auth/login/",   TokenObtainPairView.as_view(), name="token_obtain"),
    path("api/auth/refresh/", TokenRefreshView.as_view(),   name="token_refresh"),
    path("api/auth/verify/",  TokenVerifyView.as_view(),    name="token_verify"),

    # ── App Routers ────────────────────────────────────────────
    path("api/", include("api.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
