from django.contrib import admin
from .models import Enquiry

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display  = ["name","phone","subject","grade","stage","source","follow_up","tutor"]
    list_filter   = ["stage","source","subject"]
    search_fields = ["name","email","phone"]
    date_hierarchy = "created_at"
