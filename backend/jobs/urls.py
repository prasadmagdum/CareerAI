from django.urls import path

from .views import (
    create_job,
    my_jobs,
)


urlpatterns = [

    path(
        "",
        create_job,
        name="create-job"
    ),

    path(
        "my/",
        my_jobs,
        name="my-jobs"
    ),

]