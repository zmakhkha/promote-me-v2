from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()

class MessageAPIView(ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        receiver_username = self.kwargs.get("receiver_username")
        receiver = User.objects.filter(username=receiver_username).first()
        if receiver:
            return Message.objects.filter(sender=self.request.user, receiver=receiver) | \
                   Message.objects.filter(sender=receiver, receiver=self.request.user).order_by("timestamp")
        return Message.objects.none()
