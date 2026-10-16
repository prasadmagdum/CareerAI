from django.urls import path

from .views import (
    profile,
    register,
    test_api,
)


urlpatterns = [

    path(
        "test/",
        test_api,
        name="test-api"
    ),

    path(
        "register/",
        register,
        name="register"
    ),

    path(
        "profile/",
        profile,
        name="profile"
    ),
]