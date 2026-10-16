from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Profile
from .serializers import (
    ProfileSerializer,
    RegisterSerializer,
    UserSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def test_api(request):

    return Response({
        "success": True,
        "message": "Accounts API is working!",
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    serializer = RegisterSerializer(
        data=request.data
    )

    if serializer.is_valid():

        user = serializer.save()

        return Response(
            {
                "success": True,
                "message": "User registered successfully.",
                "data": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        {
            "success": False,
            "message": "Registration failed.",
            "errors": serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile(request):

    profile = get_object_or_404(
        Profile,
        user=request.user
    )

    if request.method == "GET":

        serializer = ProfileSerializer(
            profile
        )

        return Response(
            {
                "success": True,
                "message": "Profile retrieved successfully.",
                "data": serializer.data,
            }
        )

    serializer = ProfileSerializer(
        profile,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Profile updated successfully.",
                "data": serializer.data,
            }
        )

    return Response(
        {
            "success": False,
            "message": "Profile update failed.",
            "errors": serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST
    )