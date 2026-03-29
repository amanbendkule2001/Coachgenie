from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, MeView, ChangePasswordView

urlpatterns = [
    path("register/",        RegisterView.as_view(),       name="user-register"),
    path("me/",              MeView.as_view(),              name="user-me"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
