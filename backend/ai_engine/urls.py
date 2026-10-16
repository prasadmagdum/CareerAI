from django.urls import path

from .views import (
    career_chat,
    generate_analysis,
    generate_interview_questions,
    my_ai_analyses,
    my_interview_preparations,
)


urlpatterns = [

    path(
        "chat/",
        career_chat,
        name="career-chat"
    ),

    path(
        "analyze/",
        generate_analysis,
        name="generate-ai-analysis"
    ),

    path(
        "interview/",
        generate_interview_questions,
        name="generate-interview"
    ),

    path(
        "my/",
        my_ai_analyses,
        name="my-ai-analyses"
    ),

    path(
        "my-interviews/",
        my_interview_preparations,
        name="my-interview-preparations"
    ),

]