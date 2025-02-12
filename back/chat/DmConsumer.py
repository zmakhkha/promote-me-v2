from django.conf import settings
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
import datetime
import json
from .utils import getUser, getLogging, get_user_by_username

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

        await self.mark_messages_as_seen(room_name, user)

        # Use the room_name for group management
        group_name = room_name
        await self.channel_layer.group_add(group_name, self.channel_name)

    async def disconnect(self, close_code):
        logger.info("DmConsumer: disconnect - Disconnected from WebSocket.")
        
        # Get room name from URL kwargs
        room_name = self.scope['url_route']['kwargs']['roomId']
        
        await self.channel_layer.group_discard(room_name, self.channel_name)

    async def receive(self, text_data):
        print("DmConsumer: receive - Received message from WebSocket: %s", text_data)
        try:
            message_data = json.loads(text_data)
            content = message_data.get('content')
            if content:
                logger.debug(f"DmConsumer: receive - Message content: {content}")
                sender = self.scope['user']
                room_name = self.scope['url_route']['kwargs']['roomId']

                # Get receiver username from the room_name
                receiver_username = self.get_receiver_username(room_name, sender.username)

                # Get receiver's user object
                receiver = await get_user_by_username(receiver_username)
                if receiver is None:
                    logger.warning(f"DmConsumer: receive - Receiver {receiver_username} not found.")
                    return

                # Save the message (sender and receiver are now available)
                await self.save_message(sender.id, receiver.id, content, room_name)  # Pass room_name explicitly
                
                # Get current timestamp
                x = datetime.datetime.now()

                await self.channel_layer.group_send(
                    room_name,
                    {
                        'room_name' : room_name,
                        'type': 'chat_message',
                        'user': sender.username,
                        'sender': sender.id,
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
                await self.channel_layer.group_send(
                "update",
                    {
                        "type": "chat_update",
                    }
                )
            else:
                logger.warning("DmConsumer: receive - Received message is empty or does not contain content.")
        except json.JSONDecodeError:
            logger.error("DmConsumer: receive - Failed to parse received message as JSON.")

    async def chat_update(self, event):
        await self.send(text_data=json.dumps({
            "event": "chat_update"
        }))
    
    async def chat_message(self, event):
        room_name = event['room_name']
        content = event['content']
        sender = event['user']
        sender_id = event['sender']
        timestamp = event['timestamp']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'room_name' : room_name,
            'user': sender,
            'sender': sender_id,
            'timestamp': timestamp,
            'message': content
        }))

    @sync_to_async
    def save_message(self, sender, receiver, content, room_name):
        # Save the message with both sender and receiver and the room name
        Message.objects.create(
            sender_id=sender,
            receiver_id=receiver,
            content=content,
            room_name=room_name
        )

    def get_receiver_username(self, room_name, sender_username):
        """
        Given a room name like 'room_timestamp_username1_username2', extract the
        receiver's username by identifying which one is not the sender.
        """
        # Extract usernames from the room_name
        print(f"---------------------->|{room_name}|")
        _, _, username1, username2 = room_name.split("_")
        
        # Determine which username is the sender and which is the receiver
        if username1 == sender_username:
            return username2
        return username1

    @sync_to_async
    def mark_messages_as_seen(self, room_name, user):
        # Mark only the messages where the user is the receiver and they are not already seen
        print(f"{room_name}------{user}")
        Message.objects.filter(room_name=room_name, receiver=user, is_seen=False).update(is_seen=True)
        