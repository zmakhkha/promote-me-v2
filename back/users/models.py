from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenVerifyView

from django.utils import timezone
from django.utils.timezone import now

from datetime import date
import random

from .validators import max_size_validator
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from datetime import date


# ==========================
# Custom User Manager
# ==========================
class DefaultUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


# ==========================
# Main User Model
# ==========================
class DefaultUser(AbstractBaseUser, PermissionsMixin):
    DEFAULT_SPECS = {
    "height": "",
    "religion": "",
    "smoke": "",
    "drink": ""
}
    STATUS_ONLINE = 'O'
    STATUS_OFFLINE = 'F'
    STATUS_IDLE = 'I'
    STATUS_CHAT = 'C'

    STATUS_CHOICES = [
        (STATUS_ONLINE, 'ONLINE'),
        (STATUS_OFFLINE, 'OFFLINE'),
        (STATUS_IDLE, 'IDLE'),
        (STATUS_CHAT, 'CHAT'),
    ]

    ORIENTATION_CHOICES = [
        ('male', 'Interested in Males'),
        ('female', 'Interested in Females'),
        ('bisexual', 'Bisexual'),
    ]

    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)

    points = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    views = models.IntegerField(default=0)

    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    sexual_orientation = models.CharField(max_length=10, choices=ORIENTATION_CHOICES, default='bisexual')

    bio = models.TextField(blank=True)

    interests = models.JSONField(default=list)  # list of tags
    specs = models.JSONField(default=DEFAULT_SPECS)
    looking_for = models.JSONField(default=list)
    favorite_thing = models.CharField(max_length=255, blank=True, null=True)
    causes = models.JSONField(default=list)
    boundary = models.CharField(max_length=255, blank=True, null=True)

    # Location
    location = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    # Profile picture (default)
    image_url = models.ImageField(upload_to='images', default='images/default.png')
    image_link = models.CharField(max_length=255, blank=True, null=True)

    is_verified = models.BooleanField(default=False)
    is_discoverable = models.BooleanField(default=False)

    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default=STATUS_OFFLINE)

    # Blocking/Reporting
    blocked_users = models.ManyToManyField('self', symmetrical=False, related_name='blocked_by', blank=True)
    reported_fake = models.BooleanField(default=False)

    # Social Media Links
    snapchat = models.CharField(max_length=100, blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    tiktok = models.CharField(max_length=100, blank=True)

    # Django fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # images
    image_profile = models.ImageField(upload_to='images', validators=[max_size_validator], default='images/default.png')
    image_2 = models.ImageField(upload_to='images', validators=[max_size_validator], default='images/default.png')
    image_3 = models.ImageField(upload_to='images', validators=[max_size_validator], default='images/default.png')
    image_4 = models.ImageField(upload_to='images', validators=[max_size_validator], default='images/default.png')
    image_5 = models.ImageField(upload_to='images', validators=[max_size_validator], default='images/default.png')


    objects = DefaultUserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    @property
    def age(self):
        if self.birth_date:
            today = date.today()
            return today.year - self.birth_date.year - (
                (today.month, today.day) < (self.birth_date.month, self.birth_date.day)
            )
        return None

    @property
    def fame_rating(self):
        """Example fame rating formula: likes + (views / 10) + points."""
        return self.likes + (self.views / 10) + self.points

    def is_profile_complete(self) -> bool:
        required_fields = [
            'first_name',
            'last_name',
            'birth_date',
            'gender',
            'sexual_orientation',
            'bio',
            'interests',
            'latitude',
            'longitude',
            'image_profile',
        ]

        for field in required_fields:
            value = getattr(self, field, None)

            if field == "image_profile":
                if not value or str(value) == 'images/default.png':
                    return False
            else:
                if value in [None, '', []]:
                    return False

        return True

        
        


    
class OTPVerification(models.Model):
    user = models.OneToOneField(DefaultUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.save()

class ProfileView(models.Model):
    viewer = models.ForeignKey('DefaultUser', on_delete=models.CASCADE, related_name='views_given')
    viewed = models.ForeignKey('DefaultUser', on_delete=models.CASCADE, related_name='views_received')
    date = models.DateField(default=timezone.now)

    class Meta:
        unique_together = ('viewer', 'viewed', 'date')


# class ProfileLike(models.Model):
#     liked_by = models.ForeignKey('DefaultUser', on_delete=models.CASCADE, related_name='likes_given')
#     liked_user = models.ForeignKey('DefaultUser', on_delete=models.CASCADE, related_name='likes_received')
#     created_at = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         unique_together = ('liked_by', 'liked_user')

class UserInteraction(models.Model):
    ACTION_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
    ]

    from_user = models.ForeignKey(DefaultUser, on_delete=models.CASCADE, related_name="given_actions")
    to_user = models.ForeignKey(DefaultUser, on_delete=models.CASCADE, related_name="received_actions")
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_user', 'to_user')  # prevents multiple duplicate actions

    def __str__(self):
        return f"{self.from_user} -> {self.action} -> {self.to_user}"


# =================================================================================================================


class TokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            # Optional: log or customize error response here
            return Response({'detail': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import DefaultUser, UserInteraction

class UserActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):
        action = request.data.get("action")
        if action not in ["like", "dislike"]:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            to_user = DefaultUser.objects.get(id=user_id)
        except DefaultUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create or update interaction
        interaction, created = UserInteraction.objects.update_or_create(
            from_user=request.user,
            to_user=to_user,
            defaults={"action": action},
        )

        return Response({
            "message": f"{action} recorded",
            "created": created,
        }, status=status.HTTP_200_OK)
