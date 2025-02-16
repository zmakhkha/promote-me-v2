import json
import random
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils.timezone import now
from .models import OmegleChatUser

# Global list for waiting users
waiting_users = []

class OmegleChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.channel_name  # Unique ID for anonymous users
        self.room_group_name = None  # Room name initialization
        await self.accept()

        # Save user in DB
        await self.add_user_to_db()

        # Try matching users
        await self.match_users()

    async def disconnect(self, close_code):
        # Remove user from waiting list
        if self in waiting_users:
            waiting_users.remove(self)

        # Notify partner and cleanup
        if self.room_group_name:
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "partner_disconnected", "message": "Your chat partner has disconnected."},
            )
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        # Mark user as offline
        await self.mark_user_offline()

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        if self.room_group_name and message:
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "chat_message", "message": message, "sender": self.user_id},
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"], "sender": event["sender"]}))

    async def partner_disconnected(self, event):
        await self.send(text_data=json.dumps({"message": event["message"], "type": "disconnect"}))
        self.room_group_name = None  # Reset room name

    async def match_users(self):
        """Fetch online users and create a chat room."""
        online_users = await self.get_online_users()
        
        if len(online_users) < 2:
            if self not in waiting_users:
                waiting_users.append(self)  # Add to queue if no match found
            return

        # Pick two random users
        user1, user2 = random.sample(online_users, 2)

        room_name = f"chat_{user1.username}_{user2.username}"

        user1.room_group_name = room_name
        user2.room_group_name = room_name

        # Add both users to the chat room
        await self.channel_layer.group_add(room_name, user1.channel_name)
        await self.channel_layer.group_add(room_name, user2.channel_name)

        # Notify users about their match
        await self.channel_layer.group_send(
            room_name,
            {
                "type": "match_made",
                "message": f"Room created: {room_name}",
                "room_link": f"/chat/{room_name}",
            },
        )

    async def match_made(self, event):
        """Notify the user about their match and room link."""
        await self.send(text_data=json.dumps({"message": event["message"], "room_link": event["room_link"], "type": "match"}))

    @database_sync_to_async
    def get_online_users(self):
        """Fetch online users from the database."""
        return list(OmegleChatUser.objects.filter(is_online=True))

    @database_sync_to_async
    def add_user_to_db(self):
        """Mark user as online."""
        OmegleChatUser.objects.update_or_create(username=self.user_id, defaults={"is_online": True})

    @database_sync_to_async
    def mark_user_offline(self):
        """Mark user as offline."""
        OmegleChatUser.objects.filter(username=self.user_id).update(is_online=False)
