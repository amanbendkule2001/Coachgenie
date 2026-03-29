from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display  = ["cert_number","student","cert_type","course","issue_date","tutor"]
    list_filter   = ["cert_type"]
    search_fields = ["cert_number","student__name"]
    date_hierarchy = "issue_date"
