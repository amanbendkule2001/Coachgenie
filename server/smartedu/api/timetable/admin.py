from django.contrib import admin
from .models import TimetableSlot

@admin.register(TimetableSlot)
class TimetableSlotAdmin(admin.ModelAdmin):
    list_display  = ["day","start_time","end_time","subject","class_type","is_active","tutor"]
    list_filter   = ["day","class_type","is_active"]
    search_fields = ["subject","location"]
