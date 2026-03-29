from django.contrib import admin
from .models import Todo

@admin.register(Todo)
class TodoAdmin(admin.ModelAdmin):
    list_display  = ["title","priority","due_date","completed","tutor"]
    list_filter   = ["priority","completed"]
    search_fields = ["title"]
