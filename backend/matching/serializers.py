from rest_framework import serializers

from .models import MatchResult


class MatchResultSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = MatchResult

        fields = [
            "id",
            "resume",
            "job",
            "skill_match_score",
            "semantic_similarity_score",
            "experience_match_score",
            "overall_score",
            "matched_skills",
            "missing_skills",
            "extra_skills",
            "matched_required_skills",
            "missing_required_skills",
            "matched_preferred_skills",
            "missing_preferred_skills",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "skill_match_score",
            "semantic_similarity_score",
            "experience_match_score",
            "overall_score",
            "matched_skills",
            "missing_skills",
            "extra_skills",
            "created_at",
            "updated_at",
        ]