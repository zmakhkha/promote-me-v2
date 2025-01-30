from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%H:%M")
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp']