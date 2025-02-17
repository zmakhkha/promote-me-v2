from django.db import models
from django.conf import settings
from django.utils.timezone import now

user = settings.AUTH_USER_MODEL

class Message(models.Model):
    sender = models.ForeignKey(user, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(user, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    room_name = models.CharField(max_length=255)
    is_seen = models.BooleanField(default=False) 

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} in room {self.room_name} at {self.timestamp}"

class OmegleChatUser(models.Model):
    user_id = models.CharField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)  # Unique username based on timestamp and IP
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    ip = models.GenericIPAddressField()
    is_online = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = f"{int(now().timestamp())}_{self.ip}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.age}) - {self.ip} ({'Online' if self.is_online else 'Offline'})"
