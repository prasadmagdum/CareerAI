from django.urls import path

from .views import (
    match_resume_with_job_api,
    my_matches,
)


urlpatterns = [

    path(
        "",
        match_resume_with_job_api,
        name="match-resume-job"
    ),

    path(
        "my/",
        my_matches,
        name="my-matches"
    ),

]