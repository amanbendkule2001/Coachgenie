from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Tutor


@admin.register(Tutor)
class TutorAdmin(UserAdmin):
    model = Tutor
    list_display  = ["email", "name", "phone", "is_active", "is_staff", "created_at"]
    list_filter   = ["is_active", "is_staff"]
    search_fields = ["email", "name", "phone"]
    ordering      = ["name"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("name", "phone", "avatar", "bio", "subjects")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "name", "password1", "password2", "is_staff"),
        }),
    )
