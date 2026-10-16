from django.contrib.auth.models import User
from django.db import models


class Resume(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="resumes"
    )

    title = models.CharField(
        max_length=200
    )

    file = models.FileField(
        upload_to="resumes/"
    )

    extracted_text = models.TextField(
        blank=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class ResumeAnalysis(models.Model):

    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name="analysis"
    )

    candidate_name = models.CharField(
        max_length=200,
        blank=True
    )

    email = models.EmailField(
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    summary = models.TextField(
        blank=True
    )

    total_experience_years = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        default=0
    )

    education = models.JSONField(
        default=list,
        blank=True
    )

    experience = models.JSONField(
        default=list,
        blank=True
    )

    projects = models.JSONField(
        default=list,
        blank=True
    )

    certifications = models.JSONField(
        default=list,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Analysis - {self.resume.title}"


class ResumeSkill(models.Model):

    resume = models.ForeignKey(
        Resume,
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

    confidence = models.FloatField(
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("resume", "name")

    def __str__(self):
        return self.name