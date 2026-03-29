from django.contrib import admin
from .models import Material

@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display  = ["title","subject","file_type","course","tutor","created_at"]
    list_filter   = ["file_type","subject"]
    search_fields = ["title","description"]
