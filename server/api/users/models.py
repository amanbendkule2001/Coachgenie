"""
api/users/models.py — Custom Tutor user model
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class TutorManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(email, name, password, **extra)


class Tutor(AbstractBaseUser, PermissionsMixin):
    """Primary user account — represents a tutor/teacher."""

    email       = models.EmailField(unique=True)
    name        = models.CharField(max_length=150)
    phone       = models.CharField(max_length=20, blank=True)
    avatar      = models.ImageField(upload_to="avatars/", null=True, blank=True)
    bio         = models.TextField(blank=True)
    subjects    = models.CharField(max_length=255, blank=True, help_text="Comma-separated subjects")

    is_active   = models.BooleanField(default=True)
    is_staff    = models.BooleanField(default=False)

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["name"]

    objects = TutorManager()

    class Meta:
        db_table    = "tutors"
        verbose_name        = "Tutor"
        verbose_name_plural = "Tutors"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} <{self.email}>"
