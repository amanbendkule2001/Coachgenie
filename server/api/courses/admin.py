from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display  = ["title", "subject", "level", "status", "student_count", "fee", "tutor"]
    list_filter   = ["status", "level", "subject"]
    search_fields = ["title", "subject", "description"]
    filter_horizontal = ["students"]
    list_select_related = ["tutor"]
