from rest_framework import serializers

from .models import Resume, ResumeAnalysis, ResumeSkill


class ResumeAnalysisSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResumeAnalysis
        fields = [
            "candidate_name",
            "email",
            "phone",
            "summary",
            "total_experience_years",
            "education",
            "experience",
            "projects",
            "certifications",
        ]


class ResumeSkillSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResumeSkill
        fields = [
            "id",
            "name",
            "category",
            "confidence",
        ]


class ResumeSerializer(serializers.ModelSerializer):

    analysis = ResumeAnalysisSerializer(read_only=True)
    skills = ResumeSkillSerializer(many=True, read_only=True)

    class Meta:
        model = Resume
        fields = [
            "id",
            "title",
            "file",
            "extracted_text",
            "uploaded_at",
            "updated_at",
            "is_active",
            "analysis",
            "skills",
        ]

        read_only_fields = [
            "id",
            "extracted_text",
            "uploaded_at",
            "updated_at",
        ]