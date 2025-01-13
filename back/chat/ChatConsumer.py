from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
import json
import datetime
from .utils import getUser, get_user_by_id
from .utils import getLogging

logger = getLogging()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope["url_route"]["kwargs"].get("token")
        if not token:
            logger.warning("ChatConsumer: Missing token.")
            await self.close()
            return

        user = await getUser(token)
        if user is None:
            logger.warning("ChatConsumer: Unauthorized user.")
            await self.close()
            return

        self.scope["user"] = user
        self.room_name = self.scope["url_route"]["kwargs"].get("room_name")

        if not self.room_name:
            logger.warning("ChatConsumer: Missing room name.")
            await self.close()
            return

        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()
        logger.info(f"ChatConsumer: {user.username} joined {self.room_name}.")

    async def disconnect(self, close_code):
        logger.info(f"ChatConsumer: Disconnected from {self.room_name}.")
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            content = data.get("content")

            if not content:
                logger.warning("ChatConsumer: Empty message.")
                return

            sender = self.scope["user"]
            timestamp = datetime.datetime.now()

            # Save the message
            await self.save_message(sender, content)

            # Broadcast message to group
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "chat_message",
                    "message": content,
                    "sender": sender.username,
                    "timestamp": {
                        "year": timestamp.year,
                        "month": timestamp.month,
                        "day": timestamp.day,
                        "hour": timestamp.hour,
                        "minute": timestamp.minute,
                    },
                },
            )
        except json.JSONDecodeError:
            logger.error("ChatConsumer: Invalid JSON received.")

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "sender": event["sender"],
                    "timestamp": event["timestamp"],
                    "message": event["message"],
                }
            )
        )

    @sync_to_async
    def save_message(self, sender, content):
        Message.objects.create(sender=sender, content=content)
