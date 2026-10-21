from rest_framework import serializers

from .models import Job, JobSkill


class JobSkillSerializer(serializers.ModelSerializer):

    class Meta:
        model = JobSkill
        fields = [
            "id",
            "name",
            "category",
            "importance",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class JobSerializer(serializers.ModelSerializer):

    skills = JobSkillSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Job

        fields = [
            "id",
            "title",
            "company",
            "location",
            "description",
            "required_experience_years",
            "extracted_text",
            "skills",
            "created_at",
            "updated_at",
            "is_active",
        ]

        read_only_fields = [
            "id",
            "extracted_text",
            "skills",
            "created_at",
            "updated_at",
        ]

    def validate_title(self, value):
        title = value.strip()
        if not title:
            raise serializers.ValidationError(
                "Job title cannot be blank."
            )
        return title

    def validate_description(self, value):
        description = value.strip()
        if not description:
            raise serializers.ValidationError(
                "Job description cannot be blank."
            )
        return description

    def validate_required_experience_years(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Required experience cannot be negative."
            )
        return value