from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from datetime import datetime
import random
from users.models import DefaultUser
from .utils import getUser


class RandomChatConsumer(AsyncWebsocketConsumer):
    idle_users = set()  # Store user IDs of idle users

    async def connect(self):
        token = self.scope["url_route"]["kwargs"]["token"]
        user = await getUser(token)
        if not user or user.status != DefaultUser.STATUS_IDLE:
            await self.close()
            return

        self.scope["user"] = user
        await self.accept()

        # Add user to idle pool
        RandomChatConsumer.idle_users.add(user.id)
        await self.match_users()

    async def disconnect(self, close_code):
        user = self.scope["user"]
        RandomChatConsumer.idle_users.discard(user.id)

        # Set user status to offline
        user.status = DefaultUser.STATUS_OFFLINE
        await sync_to_async(user.save)(update_fields=["status"])

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get("type")
        if message_type == "leave_room":
            await self.disconnect()

    async def match_users(self):
        if len(RandomChatConsumer.idle_users) >= 2:
            user1_id, user2_id = random.sample(RandomChatConsumer.idle_users, 2)
            RandomChatConsumer.idle_users.discard(user1_id)
            RandomChatConsumer.idle_users.discard(user2_id)

            user1 = await sync_to_async(DefaultUser.objects.get)(id=user1_id)
            user2 = await sync_to_async(DefaultUser.objects.get)(id=user2_id)

            # Generate room name
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            room_name = f"chat_{timestamp}_{user1.username}_{user2.username}"

            # Notify users about the match
            await self.channel_layer.group_add(room_name, self.channel_name)
            await self.send(json.dumps({"type": "match", "room": room_name, "peer": user2.username}))

            # Set statuses
            user1.status = DefaultUser.STATUS_CHAT
            user2.status = DefaultUser.STATUS_CHAT
            await sync_to_async(user1.save)(update_fields=["status"])
            await sync_to_async(user2.save)(update_fields=["status"])

            # Notify the matched user
            await self.channel_layer.group_send(
                f"user_{user2.id}",
                {
                    "type": "match_notification",
                    "room": room_name,
                    "peer": user1.username,
                },
            )

    async def match_notification(self, event):
        room_name = event["room"]
        peer = event["peer"]
        await self.send(json.dumps({"type": "match", "room": room_name, "peer": peer}))
