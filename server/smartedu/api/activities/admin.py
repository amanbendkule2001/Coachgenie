from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display  = ["title","activity_type","start_date","end_date","location","tutor"]
    list_filter   = ["activity_type"]
    search_fields = ["title","description","location"]
    date_hierarchy = "start_date"
