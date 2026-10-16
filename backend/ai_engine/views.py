import logging

from django.shortcuts import get_object_or_404

from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from matching.models import MatchResult

from .models import (
    AIAnalysis,
    InterviewPreparation,
)

from .serializers import (
    AIAnalysisSerializer,
    InterviewPreparationSerializer,
)

from .services.llm_service import generate_ai_analysis
from .services.ai_validator import validate_ai_analysis

from .services.interview_service import (
    generate_interview_preparation,
)
from .services.career_chat_service import (
    generate_career_chat_reply,
)

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def career_chat(request):
    messages = request.data.get("messages")

    if not isinstance(messages, list) or not messages or len(messages) > 12:
        return Response(
            {
                "success": False,
                "message": "Send between 1 and 12 recent chat messages.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    validated_messages = []
    for message in messages:
        if not isinstance(message, dict):
            return Response(
                {
                    "success": False,
                    "message": (
                        "Each message must have the role 'user' or "
                        "'assistant' and contain 1 to 1500 characters."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        role = message.get("role")
        content = message.get("content")
        if (
            role not in {"user", "assistant"}
            or not isinstance(content, str)
            or not content.strip()
            or len(content) > 1500
        ):
            return Response(
                {
                    "success": False,
                    "message": (
                        "Each message must have the role 'user' or "
                        "'assistant' and contain 1 to 1500 characters. "
                        "Long chat history is shortened automatically."
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        validated_messages.append(
            {"role": role, "content": content.strip()}
        )

    if validated_messages[-1]["role"] != "user":
        return Response(
            {
                "success": False,
                "message": "The latest chat message must be from the user.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        reply = generate_career_chat_reply(validated_messages)
        return Response(
            {"success": True, "reply": reply},
            status=status.HTTP_200_OK,
        )
    except Exception:
        logger.exception("Career chat failed for user %s", request.user.pk)
        return Response(
            {
                "success": False,
                "message": (
                    "The CareerAI assistant is temporarily unavailable. "
                    "Please try again shortly."
                ),
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_analysis(request):
    """
    Generate AI analysis for a MatchResult.

    The matching engine is treated as the source of truth.
    Ollama only explains the deterministic results.
    """

    match_result_id = request.data.get(
        "match_result_id"
    )

    if not match_result_id:
        return Response(
            {
                "success": False,
                "message": "match_result_id is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    match_result = get_object_or_404(
        MatchResult,
        id=match_result_id,
        user=request.user
    )

    resume = match_result.resume
    job = match_result.job

    # --------------------------------------------------
    # AUTHORITATIVE RESUME SKILLS
    # --------------------------------------------------

    resume_skills = sorted(
        {
            skill.name.strip().lower()
            for skill in resume.skills.all()
            if skill.name
        }
    )

    # --------------------------------------------------
    # AUTHORITATIVE MATCHING DATA
    # --------------------------------------------------

    match_data = {
        "overall_score": float(
            match_result.overall_score
        ),

        "skill_match_score": float(
            match_result.skill_match_score
        ),

        "semantic_similarity_score": float(
            match_result.semantic_similarity_score
        ),

        "experience_match_score": float(
            match_result.experience_match_score
        ),

        "education_match_score": float(
            getattr(
                match_result,
                "education_match_score",
                100.0
            )
        ),

        "resume_skills": resume_skills,

        "matched_skills": (
            match_result.matched_skills or []
        ),

        "missing_skills": (
            match_result.missing_skills or []
        ),

        "extra_skills": (
            match_result.extra_skills or []
        ),

        "matched_required_skills": (
            getattr(
                match_result,
                "matched_required_skills",
                []
            ) or []
        ),

        "missing_required_skills": (
            getattr(
                match_result,
                "missing_required_skills",
                []
            ) or []
        ),

        "matched_preferred_skills": (
            getattr(
                match_result,
                "matched_preferred_skills",
                []
            ) or []
        ),

        "missing_preferred_skills": (
            getattr(
                match_result,
                "missing_preferred_skills",
                []
            ) or []
        ),
    }

    try:

        # --------------------------------------------------
        # GENERATE AI ANALYSIS
        # --------------------------------------------------

        ai_result = generate_ai_analysis(
            resume_text=resume.extracted_text,
            job_description=job.description,
            match_result=match_data
        )

        ai_result = validate_ai_analysis(
            ai_result,
            match_data
        )

        # --------------------------------------------------
        # REMOVE EXISTING ANALYSIS
        # --------------------------------------------------

        AIAnalysis.objects.filter(
            match_result=match_result
        ).delete()

        # --------------------------------------------------
        # CREATE NEW ANALYSIS
        # --------------------------------------------------

        ai_analysis = AIAnalysis.objects.create(
            match_result=match_result,

            summary=ai_result.get(
                "summary",
                ""
            ),

            strengths=ai_result.get(
                "strengths",
                []
            ),

            weaknesses=ai_result.get(
                "weaknesses",
                []
            ),

            critical_skill_gaps=ai_result.get(
                "critical_skill_gaps",
                []
            ),

            preferred_skill_gaps=ai_result.get(
                "preferred_skill_gaps",
                []
            ),

            recommendations=ai_result.get(
                "recommendations",
                []
            ),

            skill_gap_explanation=ai_result.get(
                "skill_gap_explanation",
                []
            ),

            interview_questions=ai_result.get(
                "interview_questions",
                []
            ),

            resume_improvements=ai_result.get(
                "resume_improvements",
                []
            ),

            job_readiness=ai_result.get(
                "job_readiness",
                {}
            )
        )

        serializer = AIAnalysisSerializer(
            ai_analysis
        )

        return Response(
            {
                "success": True,
                "message": "AI analysis generated successfully.",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    except Exception:
        logger.exception("AI analysis failed for user %s", request.user.pk)

        return Response(
            {
                "success": False,
                "message": "Failed to generate AI analysis.",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_interview_questions(request):
    """
    Generate personalized interview preparation
    for a MatchResult.
    """

    match_result_id = request.data.get(
        "match_result_id"
    )

    if not match_result_id:

        return Response(
            {
                "success": False,
                "message": (
                    "match_result_id is required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # --------------------------------------------------
    # USER OWNERSHIP CHECK
    # --------------------------------------------------

    match_result = get_object_or_404(
        MatchResult,
        id=match_result_id,
        user=request.user
    )

    resume = match_result.resume
    job = match_result.job

    # -----------------------------------------
    # AUTHORITATIVE MATCHING DATA
    # -----------------------------------------

    resume_skills = sorted(
        {
            skill.name.strip().lower()
            for skill in resume.skills.all()
            if skill.name
        }
    )

    match_data = {
        "overall_score": float(
            match_result.overall_score
        ),

        "skill_match_score": float(
            match_result.skill_match_score
        ),

        "semantic_similarity_score": float(
            match_result.semantic_similarity_score
        ),

        "experience_match_score": float(
            match_result.experience_match_score
        ),

        "resume_skills": resume_skills,

        "matched_skills": (
            match_result.matched_skills or []
        ),

        "missing_skills": (
            match_result.missing_skills or []
        ),

        "extra_skills": (
            match_result.extra_skills or []
        ),

        "matched_required_skills": (
            getattr(
                match_result,
                "matched_required_skills",
                []
            ) or []
        ),

        "missing_required_skills": (
            getattr(
                match_result,
                "missing_required_skills",
                []
            ) or []
        ),

        "matched_preferred_skills": (
            getattr(
                match_result,
                "matched_preferred_skills",
                []
            ) or []
        ),

        "missing_preferred_skills": (
            getattr(
                match_result,
                "missing_preferred_skills",
                []
            ) or []
        ),
    }

    try:

        # -----------------------------------------
        # GENERATE INTERVIEW QUESTIONS
        # -----------------------------------------

        interview_result = (
            generate_interview_preparation(
                resume_text=resume.extracted_text,
                job_description=job.description,
                match_result=match_data
            )
        )

        # -----------------------------------------
        # REMOVE OLD PREPARATION
        # -----------------------------------------

        InterviewPreparation.objects.filter(
            match_result=match_result
        ).delete()

        # -----------------------------------------
        # SAVE NEW PREPARATION
        # -----------------------------------------

        preparation = (
            InterviewPreparation.objects.create(
                match_result=match_result,

                technical_questions=(
                    interview_result.get(
                        "technical_questions",
                        []
                    )
                ),

                project_questions=(
                    interview_result.get(
                        "project_questions",
                        []
                    )
                ),

                skill_gap_questions=(
                    interview_result.get(
                        "skill_gap_questions",
                        []
                    )
                ),

                hr_questions=(
                    interview_result.get(
                        "hr_questions",
                        []
                    )
                ),
            )
        )

        serializer = InterviewPreparationSerializer(
            preparation
        )

        return Response(
            {
                "success": True,
                "message": (
                    "Interview preparation "
                    "generated successfully."
                ),
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    except Exception:
        logger.exception("Interview preparation failed for user %s", request.user.pk)

        return Response(
            {
                "success": False,
                "message": (
                    "Failed to generate "
                    "interview preparation."
                )
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ==================================================
# MY AI ANALYSES
# ==================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_ai_analyses(request):

    analyses = AIAnalysis.objects.filter(
        match_result__user=request.user
    ).select_related(
        "match_result",
        "match_result__resume",
        "match_result__job"
    ).order_by("-id")

    serializer = AIAnalysisSerializer(
        analyses,
        many=True
    )

    return Response(
        {
            "success": True,
            "message": "AI analyses retrieved successfully.",
            "data": serializer.data,
        }
    )


# ==================================================
# MY INTERVIEW PREPARATIONS
# ==================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_interview_preparations(request):

    preparations = InterviewPreparation.objects.filter(
        match_result__user=request.user
    ).select_related(
        "match_result",
        "match_result__resume",
        "match_result__job"
    ).order_by("-id")

    serializer = InterviewPreparationSerializer(
        preparations,
        many=True
    )

    return Response(
        {
            "success": True,
            "message": (
                "Interview preparations "
                "retrieved successfully."
            ),
            "data": serializer.data,
        }
    )