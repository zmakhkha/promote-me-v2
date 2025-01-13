from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
import datetime
import json
from .utils import get_user_by_id, getUser, getLogging

logger = getLogging()

class DmConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        authorization_header = self.scope["url_route"]["kwargs"]["token"]
        room_name = self.scope["url_route"]["kwargs"]["roomId"]
        
        if not authorization_header:
            logger.warning("DmConsumer: connect - Connection rejected: Authorization header not found.")
            await self.close()
            return

        user = await getUser(authorization_header=authorization_header)
        if user is None:
            logger.warning("DmConsumer: connect - User not found.")
            await self.close()
            return
        self.scope["user"] = user

        logger.info(f"DmConsumer: connect - {user.username} Connected successfully.")
        await self.accept()

        # Use the room_name for group management
        group_name = room_name
        await self.channel_layer.group_add(group_name, self.channel_name)

    async def disconnect(self, close_code):
        logger.info("DmConsumer: disconnect - Disconnected from WebSocket.")
        
        # Get room name from URL kwargs
        room_name = self.scope['url_route']['kwargs']['roomname']
        
        await self.channel_layer.group_discard(room_name, self.channel_name)

    async def receive(self, text_data):
        logger.info("DmConsumer: receive - Received message from WebSocket: %s", text_data)
        try:
            message_data = json.loads(text_data)
            content = message_data.get('content')
            if content:
                logger.debug(f"DmConsumer: receive - Message content: {content}")
                sender_id = self.scope['user'].id

                # Save the message (receiver information is part of the room)
                await self.save_message(sender_id, content)
                x = datetime.datetime.now()

                room_name = self.scope['url_route']['kwargs']['roomname']

                await self.channel_layer.group_send(
                    room_name,
                    {
                        'type': 'chat_message',
                        'user': self.scope['user'].username,
                        'sender': self.scope['user'].id,
                        'timestamp': {
                            'year': x.year,
                            'month': x.month,
                            'day': x.day,
                            'hour': x.hour,
                            'minute': x.minute,
                        },
                        'content': content
                    }
                )
            else:
                logger.warning("DmConsumer: receive - Received message is empty or does not contain content.")
        except json.JSONDecodeError:
            logger.error("DmConsumer: receive - Failed to parse received message as JSON.")

    async def chat_message(self, event):
        content = event['content']
        sender = event['user']
        sender_id = event['sender']
        timestamp = event['timestamp']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'user': sender,
            'sender': sender_id,
            'timestamp': timestamp,
            'message': content
        }))

    @sync_to_async
    def save_message(self, sender_id, content):
        logger.info("DmConsumer: save_message - Saving new message.")
        user = settings.AUTH_USER_MODEL
        # You might want to adjust the Message creation logic to save to a "group chat" table
        if sender_id:
            message = Message.objects.create(sender_id=sender_id, content=content)
            message.save()
