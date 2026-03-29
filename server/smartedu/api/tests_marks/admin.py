from django.contrib import admin
from .models import Test, Mark

class MarkInline(admin.TabularInline):
    model  = Mark
    extra  = 0
    fields = ["student","marks","percentage","remarks"]
    readonly_fields = ["percentage"]

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display  = ["title","subject","date","total_marks","status","tutor"]
    list_filter   = ["status","subject"]
    search_fields = ["title","subject"]
    inlines       = [MarkInline]

@admin.register(Mark)
class MarkAdmin(admin.ModelAdmin):
    list_display  = ["student","test","marks","percentage","remarks"]
    list_filter   = ["test"]
    search_fields = ["student__name","test__title"]
