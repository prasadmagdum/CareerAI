from django.contrib.auth.models import User
from django.db import models


class Job(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="jobs",
        null=True,
        blank=True
    )

    title = models.CharField(
        max_length=200
    )

    company = models.CharField(
        max_length=200,
        blank=True
    )

    location = models.CharField(
        max_length=200,
        blank=True
    )

    description = models.TextField()

    required_experience_years = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=0
    )

    extracted_text = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.title} - {self.company}"


class JobSkill(models.Model):

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="skills"
    )

    name = models.CharField(
        max_length=100
    )

    category = models.CharField(
        max_length=100,
        blank=True
    )

    importance = models.CharField(
        max_length=20,
        default="required"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("job", "name")

    def __str__(self):
        return self.name