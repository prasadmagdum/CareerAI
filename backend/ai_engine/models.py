from django.db import models

from matching.models import MatchResult


class AIAnalysis(models.Model):

    match_result = models.OneToOneField(
        MatchResult,
        on_delete=models.CASCADE,
        related_name="ai_analysis"
    )

    summary = models.TextField(
        blank=True
    )

    strengths = models.JSONField(
        default=list,
        blank=True
    )

    weaknesses = models.JSONField(
        default=list,
        blank=True
    )

    critical_skill_gaps = models.JSONField(
        default=list,
        blank=True
    )

    preferred_skill_gaps = models.JSONField(
        default=list,
        blank=True
    )

    recommendations = models.JSONField(
        default=list,
        blank=True
    )

    skill_gap_explanation = models.JSONField(
        default=list,
        blank=True
    )

    interview_questions = models.JSONField(
        default=list,
        blank=True
    )

    resume_improvements = models.JSONField(
        default=list,
        blank=True
    )

    job_readiness = models.JSONField(
        default=dict,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"AI Analysis - "
            f"{self.match_result.id}"
        )


class InterviewPreparation(models.Model):

    match_result = models.OneToOneField(
        MatchResult,
        on_delete=models.CASCADE,
        related_name="interview_preparation"
    )

    technical_questions = models.JSONField(
        default=list,
        blank=True
    )

    project_questions = models.JSONField(
        default=list,
        blank=True
    )

    skill_gap_questions = models.JSONField(
        default=list,
        blank=True
    )

    hr_questions = models.JSONField(
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
        return (
            f"Interview Preparation - "
            f"{self.match_result.id}"
        )