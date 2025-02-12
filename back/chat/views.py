from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

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

from django.db.models import OuterRef, Subquery
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Message
from .serializers import MessageSerializer, MessageNotificationSerializer

class UnseenMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get the last unseen message per sender
        last_unseen_subquery = Message.objects.filter(
            sender=OuterRef("sender"),
            receiver=user,
            is_seen=False
        ).order_by("-timestamp").values("id")[:1]  # Get only the latest unseen message ID

        unseen_messages = Message.objects.filter(
            id__in=Subquery(last_unseen_subquery)
        )

        serializer = MessageNotificationSerializer(unseen_messages, many=True)
        return Response({"unseen_messages": serializer.data}, status=status.HTTP_200_OK)



class MarkMessagesAsSeenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Marks all unseen messages in the given conversation as seen.
        """
        room_name = request.data.get("room_name")
        if not room_name:
            return Response({"error": "room_name is required"}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        # Mark all unseen messages in this conversation as seen
        updated_count = Message.objects.filter(room_name=room_name, receiver=user, is_seen=False).update(is_seen=True)

        return Response({"message": f"{updated_count} messages marked as seen"}, status=status.HTTP_200_OK)



class DeleteAllMessages(APIView):
    permission_classes = [IsAuthenticated]  # Only superusers or admins can delete messages

    def delete(self, request, *args, **kwargs):
        # Delete all messages from the Message table
        Message.objects.all().delete()
        
        return Response({"message": "All messages have been deleted."}, status=status.HTTP_204_NO_CONTENT)