from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from .validators import max_size_validator
from datetime import date
from django.utils.timezone import now

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

class DefaultUser(AbstractBaseUser, PermissionsMixin):
    STATUS_ONLINE = 'O'
    STATUS_OFFLINE = 'F'
    STATUS_IDLE = 'I'
    STATUS_CHAT = 'C'

    STATUS_CHOICES = [
        (STATUS_ONLINE, 'ONLINE'),
        (STATUS_OFFLINE, 'OFFLINE'),
        (STATUS_IDLE, 'IDLE'),
    ]

    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    points = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    birth_date = models.DateField(null=True, blank=True)  # Replaced age with birth_date
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    location = models.CharField(max_length=100)
    bio = models.TextField()
    interests = models.JSONField(default=list)
    image_url = models.ImageField(
        upload_to='images',
        validators=[max_size_validator],
        default='images/default.png'
    )
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=STATUS_OFFLINE)
    snapchat = models.CharField(max_length=50, blank=True, null=True)
    instagram = models.CharField(max_length=50, blank=True, null=True)
    tiktok = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = DefaultUserManager()
    
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    @property
    def age(self):
        """Calculate age dynamically from birth_date."""
        if self.birth_date:
            today = date.today()
            return today.year - self.birth_date.year - ((today.month, today.day) < (self.birth_date.month, self.birth_date.day))
        return None