from rest_framework import serializers
from .models import Message, OmegleChatUser

class MessageSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%H:%M")
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp']


class MessageNotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender_username", "content", "timestamp",]


class OmegleChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = OmegleChatUser
        fields = ['user_id', 'username', 'name', 'age', 'ip', 'is_online', 'created_at']