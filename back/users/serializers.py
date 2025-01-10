from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework import serializers

from .validators import *
from .models import DefaultUser

unique_username_validator = UniqueValidator(
    queryset=DefaultUser.objects.all(), message="This username is already in use."
)
unique_email_validator = UniqueValidator(
    queryset=DefaultUser.objects.all(), message="This email is already in use."
)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    # username = serializers.CharField(required=True, validators=[unique_username_validator, char_validator])
    username = serializers.CharField(required=True, validators=[unique_username_validator])
    email = serializers.EmailField(required=True, validators=[unique_email_validator, email_validator])
    first_name = serializers.CharField(required=True, validators=[char_validator])
    last_name = serializers.CharField(required=True, validators=[char_validator])
    birth_date = serializers.DateField(required=True)  # Birth date is required
    age = serializers.ReadOnlyField()  # Age is calculated dynamically
    gender = serializers.CharField(required=True)
    location = serializers.CharField(required=True)
    bio = serializers.CharField(required=True)
    interests = serializers.JSONField(required=True)
    snapchat = serializers.CharField(required=True)
    instagram = serializers.CharField(required=True)
    tiktok = serializers.CharField(required=True)


    class Meta:
        model = DefaultUser
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'points', 'likes', 'views', 'birth_date', 'age', 'gender', 'location',
            'bio', 'interests', 'is_online', 'snapchat', 'instagram', 'tiktok', 'image_url'
        ]

    def create(self, validated_data):
        user = DefaultUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            points=validated_data.get('points', 0),
            likes=validated_data.get('likes', 0),
            views=validated_data.get('views', 0),
            birth_date=validated_data['birth_date'],
            gender=validated_data['gender'],
            location=validated_data['location'],
            bio=validated_data['bio'],
            interests=validated_data['interests'],
            snapchat=validated_data['snapchat'],
            instagram=validated_data['instagram'],
            tiktok=validated_data['tiktok'],
            image_url=validated_data['image_url'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'age', 'gender', 'location', 'bio', 'interests', 'is_online', 'image_url',
            'snapchat', 'instagram', 'tiktok', 'points', 'likes', 'views'
        ]

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = [
            'username', 'first_name', 'last_name',
            'age', 'gender', 'location', 'bio', 'interests', 'is_online', 'image_url',
            'snapchat', 'instagram', 'tiktok', 'points', 'likes', 'views'
        ]

from rest_framework import serializers
from .models import DefaultUser

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = ['image_url', 'first_name', 'last_name', 'bio', 'snapchat', 'tiktok', 'instagram']
