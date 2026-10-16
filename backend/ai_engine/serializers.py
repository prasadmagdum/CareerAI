from rest_framework import serializers

from .models import AIAnalysis
from .models import InterviewPreparation

class AIAnalysisSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = AIAnalysis

        fields = [
            "id",
            "match_result",

            "summary",

            "strengths",

            "weaknesses",

            "critical_skill_gaps",

            "preferred_skill_gaps",

            "recommendations",

            "skill_gap_explanation",

            "interview_questions",

            "resume_improvements",

            "job_readiness",

            "created_at",

            "updated_at",
        ]

        read_only_fields = [
            "id",
            "match_result",
            "created_at",
            "updated_at",
        ]
        
class InterviewPreparationSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = InterviewPreparation

        fields = [
            "id",
            "match_result",
            "technical_questions",
            "project_questions",
            "skill_gap_questions",
            "hr_questions",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "match_result",
            "created_at",
            "updated_at",
        ]