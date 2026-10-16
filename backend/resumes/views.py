import logging

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    parser_classes,
    permission_classes,
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Resume, ResumeAnalysis, ResumeSkill
from .serializers import ResumeSerializer
from .utils.pdf_parser import extract_text_from_pdf
from .services.resume_analyzer import analyze_resume

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):

    file = request.FILES.get("file")
    title = request.data.get("title")

    if not file:
        return Response(
            {
                "success": False,
                "message": "Resume PDF file is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not title:
        return Response(
            {
                "success": False,
                "message": "Resume title is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if not file.name.lower().endswith(".pdf"):
        return Response(
            {
                "success": False,
                "message": "Only PDF files are allowed."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        extracted_text = extract_text_from_pdf(file)

        if not extracted_text:
            return Response(
                {
                    "success": False,
                    "message": "Could not extract text from the PDF."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        resume = Resume.objects.create(
            user=request.user,
            title=title,
            file=file,
            extracted_text=extracted_text,
        )

        analysis_data = analyze_resume(extracted_text)

        ResumeAnalysis.objects.create(
            resume=resume,
            candidate_name=analysis_data["candidate_name"],
            email=analysis_data["email"],
            phone=analysis_data["phone"],
            summary=analysis_data["summary"],
            total_experience_years=analysis_data[
                "total_experience_years"
            ],
            education=analysis_data["education"],
            experience=analysis_data["experience"],
            projects=analysis_data["projects"],
            certifications=analysis_data["certifications"],
        )

        for skill in analysis_data["skills"]:

            ResumeSkill.objects.create(
                resume=resume,
                name=skill["name"],
                category=skill["category"],
                confidence=skill["confidence"],
            )

        serializer = ResumeSerializer(resume)

        return Response(
            {
                "success": True,
                "message": "Resume uploaded and analyzed successfully.",
                "data": {
                    "resume": serializer.data,
                    "analysis": analysis_data,
                },
            },
            status=status.HTTP_201_CREATED
        )

    except ValueError as e:

        return Response(
            {
                "success": False,
                "message": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception:
        logger.exception("Resume processing failed for user %s", request.user.pk)

        return Response(
            {
                "success": False,
                "message": (
                    "Something went wrong while processing "
                    "the resume."
                )
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_resumes(request):

    resumes = Resume.objects.filter(
        user=request.user
    ).order_by("-uploaded_at")

    serializer = ResumeSerializer(
        resumes,
        many=True
    )

    return Response(
        {
            "success": True,
            "message": "Resumes retrieved successfully.",
            "data": serializer.data,
        }
    )