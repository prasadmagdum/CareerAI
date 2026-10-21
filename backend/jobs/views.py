import logging

from django.db import transaction
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Job, JobSkill
from .serializers import JobSerializer
from .services.job_analyzer import analyze_job_description

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_job(request):
    serializer = JobSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {
                "success": False,
                "message": "Job details are invalid.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        description = serializer.validated_data["description"]
        analysis_data = analyze_job_description(description)

        with transaction.atomic():
            job = serializer.save(
                user=request.user,
                extracted_text=description,
            )
            JobSkill.objects.bulk_create(
                [
                    JobSkill(
                        job=job,
                        name=skill["name"],
                        category=skill["category"],
                        importance=skill["importance"],
                    )
                    for skill in analysis_data["skills"]
                ]
            )

        serializer = JobSerializer(job)

        return Response(
            {
                "success": True,
                "message": "Job created and analyzed successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED
        )

    except Exception:
        logger.exception("Job analysis failed for user %s", request.user.pk)

        return Response(
            {
                "success": False,
                "message": "Failed to analyze job description.",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_jobs(request):

    jobs = Job.objects.filter(
        user=request.user
    ).order_by("-created_at")

    serializer = JobSerializer(
        jobs,
        many=True
    )

    return Response(
        {
            "success": True,
            "message": "Jobs retrieved successfully.",
            "data": serializer.data,
        }
    )