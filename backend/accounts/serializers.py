from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password2 = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "password",
            "password2",
        ]

    def validate(self, attrs):

        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {
                    "password": "Passwords do not match."
                }
            )

        if User.objects.filter(
            username=attrs["username"]
        ).exists():

            raise serializers.ValidationError(
                {
                    "username": "Username already exists."
                }
            )

        if User.objects.filter(
            email=attrs["email"]
        ).exists():

            raise serializers.ValidationError(
                {
                    "email": "Email already exists."
                }
            )

        return attrs

    def create(self, validated_data):

        validated_data.pop("password2")

        password = validated_data.pop(
            "password"
        )

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        Profile.objects.create(
            user=user
        )

        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "email",
        ]


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    class Meta:
        model = Profile
        fields = [
            "username",
            "email",
            "phone",
            "location",
            "bio",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "username",
            "email",
            "created_at",
            "updated_at",
        ]