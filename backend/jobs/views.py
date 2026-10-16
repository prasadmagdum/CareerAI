import logging

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

    title = request.data.get("title")
    company = request.data.get("company", "")
    location = request.data.get("location", "")
    description = request.data.get("description")
    required_experience_years = request.data.get(
        "required_experience_years",
        0
    )

    if not title:
        return Response(
            {
                "success": False,
                "message": "Job title is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not description:
        return Response(
            {
                "success": False,
                "message": "Job description is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        analysis_data = analyze_job_description(description)

        job = Job.objects.create(
            user=request.user,
            title=title,
            company=company,
            location=location,
            description=description,
            required_experience_years=required_experience_years,
            extracted_text=description,
        )

        for skill in analysis_data["skills"]:

            JobSkill.objects.create(
                job=job,
                name=skill["name"],
                category=skill["category"],
                importance=skill["importance"],
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