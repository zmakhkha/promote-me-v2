from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from datetime import date

from .validators import *
from .models import DefaultUser, ProfileView, ProfileLike



unique_username_validator = UniqueValidator(
    queryset=DefaultUser.objects.all(), message="This username is already in use."
)
unique_email_validator = UniqueValidator(
    queryset=DefaultUser.objects.all(), message="This email is already in use."
)


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    # username = serializers.CharField(required=True, validators=[unique_username_validator, char_validator])
    username = serializers.CharField(required=True, validators=[unique_username_validator])
    email = serializers.EmailField(required=True, validators=[unique_email_validator, email_validator])
    first_name = serializers.CharField(required=True, validators=[char_validator])
    last_name = serializers.CharField(required=True, validators=[char_validator])


    class Meta:
        model = DefaultUser
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
        ]

    def create(self, validated_data):
        user = DefaultUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

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
            'bio', 'interests', 'status', 'snapchat', 'instagram', 'tiktok', 'image_url'
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
            'age', 'gender', 'location', 'bio', 'interests', 'status', 'image_url', 'image_link',
            'snapchat', 'instagram', 'tiktok', 'points', 'likes', 'views'
        ]

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = [
            'username', 'first_name', 'last_name',
            'age', 'gender', 'location', 'bio', 'interests', 'status', 'image_url', 'image_link',
            'snapchat', 'instagram', 'tiktok', 'points', 'likes', 'views'
        ]



class UserSettingsSerializer(serializers.ModelSerializer):
    # image_url = serializers.URLField(required=False)
    class Meta:
        model = DefaultUser
        # fields = [ 'first_name', 'last_name', 'bio', 'snapchat', 'tiktok', 'instagram']
        fields = ['image_url', 'image_link', 'first_name', 'last_name', 'bio', 'snapchat', 'tiktok', 'instagram']


class UserProfileSerializer(serializers.ModelSerializer):
    # image_url = serializers.URLField(required=False)
    class Meta:
        model = DefaultUser
        # fields = [ 'first_name', 'last_name', 'bio', 'snapchat', 'tiktok', 'instagram']
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'age', 'gender', 'location', 'bio', 'interests', 'status', 'image_url', 'image_link',
            'snapchat', 'instagram', 'tiktok', 'points', 'likes', 'views'
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    # image_url = serializers.URLField(required=False)
    class Meta:
        model = DefaultUser
        # fields = [ 'first_name', 'last_name', 'bio', 'snapchat', 'tiktok', 'instagram']
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'age', 'gender', 'location', 'bio', 'interests', 'status', 'image_url', 'image_link',
            'snapchat', 'instagram', 'tiktok', 'points', 'likes', 'views'
        ]

class AdminModifyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'age', 'gender', 'location', 'bio', 'interests', 'status',
            'snapchat', 'instagram', 'tiktok', 'points', 'likes', 'views'
        ]

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = ['username', 'email',  'points', 'location',  'is_staff',]

class ProfileViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileView
        fields = '__all__'

class ProfileLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileLike
        fields = '__all__'



class DiscoverProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    age = serializers.SerializerMethodField()
    specs = serializers.SerializerMethodField()
    favoriteThing = serializers.CharField(source="favorite_thing", allow_null=True)
    distance = serializers.SerializerMethodField()

    class Meta:
        model = DefaultUser
        fields = [
            "id",
            "name",
            "age",
            "is_verified",
            "bio",
            "specs",
            "looking_for",
            "interests",
            "favoriteThing",
            "causes",
            "boundary",
            "location",
            "distance",
            "image_url",
        ]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_age(self, obj):
        if obj.birth_date:
            today = date.today()
            return today.year - obj.birth_date.year - (
                (today.month, today.day) < (obj.birth_date.month, obj.birth_date.day)
            )
        return None

    def get_specs(self, obj):
        """
        Convert the specs JSON dict into a list of 'key: value' strings
        for frontend tag rendering.
        """
        if isinstance(obj.specs, dict):
            return [f"{key}: {value}" for key, value in obj.specs.items()]
        return []

    def get_distance(self, obj):
        # For now just a placeholder — later you can add distance calculation from request.user
        return "5 km"



class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = [
            "first_name",
            "last_name",
            "gender",
            "birth_date",
            "bio",
            "interests",
            "sexual_orientation",
            "latitude",
            "longitude",
            "image_profile",
            "image_2",
            "image_3",
            "image_4",
            "image_5"
        ]

    # def validate(self, data):
    #     gender = data.get("gender")
    #     if gender and gender not in ["male", "female"]:
    #         raise serializers.ValidationError({"gender": "Gender must be 'male' or 'female'."})


    #     return data


class UserPersonalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = [
            "first_name",
            "last_name",
            "birth_date",
            "gender",
            "sexual_orientation",
            "bio",
        ]

    def validate(self, data):
        gender = data.get("gender")
        if gender and gender not in ["male", "female"]:
            raise serializers.ValidationError({"gender": "Gender must be 'male' or 'female'."})


        return data

from rest_framework import serializers
from .models import DefaultUser
from datetime import date
from math import radians, cos, sin, asin, sqrt
from rest_framework import serializers
from .models import DefaultUser
from datetime import date
import math

def haversine(lon1, lat1, lon2, lat2):
    # Radius of the Earth in kilometers
    R = 6371.0

    # Convert degrees to radians
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])

    # Differences in coordinates
    dlon = lon2 - lon1
    dlat = lat2 - lat1

    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Distance in kilometers
    distance = R * c
    return distance



class DiscoverUserSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    common_tags = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = DefaultUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "is_verified",
            "age",
            "bio",
            "interests",
            "location",
            "latitude",
            "longitude",
            "points",
            "image_profile",
            "distance",
            "common_tags",  # Add common_tags here
        ]

    def get_age(self, obj):
        if obj.birth_date:
            today = date.today()
            return today.year - obj.birth_date.year - (
                (today.month, today.day) < (obj.birth_date.month, obj.birth_date.day)
            )
        return None

    def get_distance(self, obj):
        current_user = self.context.get("current_user")
        if not current_user or not obj.latitude or not obj.longitude or not current_user.latitude or not current_user.longitude:
            return None
        # Assuming haversine is already implemented
        return haversine(current_user.longitude, current_user.latitude, obj.longitude, obj.latitude)
