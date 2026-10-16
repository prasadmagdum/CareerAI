from django.contrib.auth.models import User
from django.db import models

from jobs.models import Job
from resumes.models import Resume


class MatchResult(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="match_results"
    )

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE,
        related_name="match_results"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="match_results"
    )

    skill_match_score = models.FloatField(
        default=0
    )

    semantic_similarity_score = models.FloatField(
        default=0
    )

    experience_match_score = models.FloatField(
        default=0
    )

    overall_score = models.FloatField(
        default=0
    )

    matched_skills = models.JSONField(
        default=list,
        blank=True
    )

    missing_skills = models.JSONField(
        default=list,
        blank=True
    )

    extra_skills = models.JSONField(
        default=list,
        blank=True
    )
    matched_required_skills = models.JSONField(
    default=list,
    blank=True
    )

    missing_required_skills = models.JSONField(
        default=list,
        blank=True
    )

    matched_preferred_skills = models.JSONField(
        default=list,
        blank=True
    )

    missing_preferred_skills = models.JSONField(
        default=list,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )


    class Meta:
        ordering = ["-overall_score"]

    def __str__(self):
        return (
            f"{self.resume.title} → "
            f"{self.job.title} "
            f"({self.overall_score}%)"
        )