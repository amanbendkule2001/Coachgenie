from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ["student","amount","due_date","paid_date","status","method","tutor"]
    list_filter   = ["status","method"]
    search_fields = ["student__name","receipt_no","description"]
    date_hierarchy = "due_date"
