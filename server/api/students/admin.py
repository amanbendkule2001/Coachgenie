from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display  = ["name", "email", "grade", "subject", "score", "status", "tutor"]
    list_filter   = ["status", "grade", "subject"]
    search_fields = ["name", "email", "phone"]
    ordering      = ["name"]
    list_select_related = ["tutor"]

    fieldsets = (
        ("Personal", {"fields": ("name", "email", "phone", "avatar", "notes")}),
        ("Academic", {"fields": ("grade", "subject", "score", "status", "enrolled_at")}),
        ("Tutor",    {"fields": ("tutor",)}),
    )
