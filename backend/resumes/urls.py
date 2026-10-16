from django.urls import path

from .views import (
    my_resumes,
    upload_resume,
)


urlpatterns = [

    path(
        "upload/",
        upload_resume,
        name="upload-resume"
    ),

    path(
        "my/",
        my_resumes,
        name="my-resumes"
    ),

]