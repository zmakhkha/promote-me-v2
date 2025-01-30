import json
import datetime
import jwt
from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
from .utils import getUser, getLogging, get_user_by_username

logger = getLogging()

def generate_room_name(username1, username2):
    return f"room_{min(username1, username2)}_{max(username1, username2)}"

class DirectChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        authorization_header = self.scope["url_route"]["kwargs"]["token"]
        receiver_username = self.scope["url_route"]["kwargs"]["user"]
        
        if not authorization_header:
            logger.warning("DirectChatConsumer: connect - Authorization header not found.")
            await self.close()
            return

        user = await getUser(authorization_header=authorization_header)
        if user is None:
            logger.warning("DirectChatConsumer: connect - User authentication failed.")
            await self.close()
            return

        sender_username = user.username
        room_name = generate_room_name(sender_username, receiver_username)
        self.scope["user"] = user
        self.scope["room_name"] = room_name

        logger.info(f"DirectChatConsumer: connect - {sender_username} connected to {room_name}.")
        print(f"DirectChatConsumer: connect - {sender_username} connected to {room_name}.")
        await self.accept()
        
        await self.channel_layer.group_add(room_name, self.channel_name)

    async def disconnect(self, close_code):
        room_name = self.scope.get("room_name")
        if room_name:
            await self.channel_layer.group_discard(room_name, self.channel_name)
        logger.info("DirectChatConsumer: disconnect - Disconnected from WebSocket.")

    async def receive(self, text_data):
        try:
            message_data = json.loads(text_data)
            content = message_data.get("content")
            if not content:
                logger.warning("DirectChatConsumer: receive - Received empty message.")
                return
            
            sender = self.scope["user"]
            room_name = self.scope["room_name"]
            receiver_username = self.scope["url_route"]["kwargs"]["user"]
            receiver = await get_user_by_username(receiver_username)
            
            if receiver is None:
                logger.warning(f"DirectChatConsumer: receive - Receiver {receiver_username} not found.")
                return

            await self.save_message(sender.id, receiver.id, content, room_name)
            timestamp = datetime.datetime.now()
            
            await self.channel_layer.group_send(
                room_name,
                {
                    "type": "chat_message",
                    "room_name": room_name,
                    "user": sender.username,
                    "sender": sender.id,
                    "timestamp": {
                        "year": timestamp.year,
                        "month": timestamp.month,
                        "day": timestamp.day,
                        "hour": timestamp.hour,
                        "minute": timestamp.minute,
                    },
                    "content": content,
                }
            )
        except json.JSONDecodeError:
            logger.error("DirectChatConsumer: receive - Invalid JSON format.")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @sync_to_async
    def save_message(self, sender, receiver, content, room_name):
        Message.objects.create(
            sender_id=sender,
            receiver_id=receiver,
            content=content,
            room_name=room_name
        )
