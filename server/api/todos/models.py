from django.db import models
from api.users.models import Tutor

class Todo(models.Model):
    PRIORITY_CHOICES = [("High","High"),("Medium","Medium"),("Low","Low")]

    tutor      = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name="todos")
    title      = models.CharField(max_length=300)
    notes      = models.TextField(blank=True)
    priority   = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="Medium")
    due_date   = models.DateField(null=True, blank=True)
    completed  = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "todos"
        ordering = ["completed","due_date","priority"]

    def __str__(self):
        return self.title
