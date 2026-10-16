import logging

from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from jobs.models import Job
from resumes.models import Resume

from .models import MatchResult
from .serializers import MatchResultSerializer
from .services.matcher import match_resume_with_job

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def match_resume_with_job_api(request):

    resume_id = request.data.get("resume_id")
    job_id = request.data.get("job_id")

    if not resume_id:
        return Response(
            {
                "success": False,
                "message": "resume_id is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not job_id:
        return Response(
            {
                "success": False,
                "message": "job_id is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    resume = get_object_or_404(
        Resume,
        id=resume_id,
        user=request.user
    )

    job = get_object_or_404(
        Job,
        id=job_id,
        user=request.user
    )

    try:

        result = match_resume_with_job(
            resume,
            job
        )

        match_result = MatchResult.objects.create(
            user=request.user,
            resume=resume,
            job=job,
            skill_match_score=result[
                "skill_match_score"
            ],
            semantic_similarity_score=result[
                "semantic_similarity_score"
            ],
            experience_match_score=result[
                "experience_match_score"
            ],
            overall_score=result[
                "overall_score"
            ],
            matched_skills=result[
                "matched_skills"
            ],
            missing_skills=result[
                "missing_skills"
            ],
            extra_skills=result[
                "extra_skills"
            ],
            matched_required_skills=result[
                "matched_required_skills"
            ],
            missing_required_skills=result[
                "missing_required_skills"
            ],
            matched_preferred_skills=result[
                "matched_preferred_skills"
            ],
            missing_preferred_skills=result[
                "missing_preferred_skills"
            ],
        )

        serializer = MatchResultSerializer(
            match_result
        )

        return Response(
            {
                "success": True,
                "message": "Resume matched with job successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED
        )

    except Exception:
        logger.exception("Resume-job matching failed for user %s", request.user.pk)

        return Response(
            {
                "success": False,
                "message": "Failed to match resume with job.",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_matches(request):

    matches = MatchResult.objects.filter(
        user=request.user
    ).select_related(
        "resume",
        "job"
    ).order_by("-id")

    serializer = MatchResultSerializer(
        matches,
        many=True
    )

    return Response(
        {
            "success": True,
            "message": "Matches retrieved successfully.",
            "data": serializer.data,
        }
    )