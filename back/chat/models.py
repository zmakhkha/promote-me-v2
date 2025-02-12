from django.db import models
from django.conf import settings

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
