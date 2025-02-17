from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Message
import datetime
import json
import random
import string
from .utils import  getLogging


logger = getLogging()

class DmOmegleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        room_name = self.scope["url_route"]["kwargs"]["roomId"]

        # # Generate a random username for non-authenticated users
        # guest_username = f"guest_{self.generate_random_string(8)}"
        # self.scope["user"] = {"username": guest_username}
        # self.scope['user']

        # logger.info(f"DmOmegleConsumer: connect - {guest_username} Connected successfully.")
        await self.accept()


        # Use the room_name for group management
        group_name = room_name
        await self.channel_layer.group_add(group_name, self.channel_name)

    async def disconnect(self, close_code):
        logger.info("DmOmegleConsumer: disconnect - Disconnected from WebSocket.")
        
        # Get room name from URL kwargs
        room_name = self.scope['url_route']['kwargs']['roomId']
        
        await self.channel_layer.group_discard(room_name, self.channel_name)

    async def receive(self, text_data):
        print(f"hahia: |{text_data}|")
        print("DmOmegleConsumer: receive - Received message from WebSocket: %s", text_data)
        try:
            message_data = json.loads(text_data)
            content = message_data.get('content')
            if content:
                logger.debug(f"DmOmegleConsumer: receive - Message content: {content}")
                # sender = self.scope['user']
                room_name = self.scope['url_route']['kwargs']['roomId']

                # Get receiver username from the room_name
                receiver_username = self.get_receiver_username(room_name, sender['username'])

                # Get current timestamp
                x = datetime.datetime.now()

                await self.channel_layer.group_send(
                    room_name,
                    {
                        'room_name' : room_name,
                        'type': 'chat_message',
                        # 'user': sender['username'],
                        # 'sender': sender['username'],  # Send username instead of user id
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
                logger.warning("DmOmegleConsumer: receive - Received message is empty or does not contain content.")
        except json.JSONDecodeError:
            logger.error("DmOmegleConsumer: receive - Failed to parse received message as JSON.")

    async def chat_update(self, event):
        await self.send(text_data=json.dumps({
            "event": "chat_update"
        }))
    
    async def chat_message(self, event):
        room_name = event['room_name']
        content = event['content']
        # sender = event['user']
        # sender_id = event['sender']
        timestamp = event['timestamp']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'room_name' : room_name,
            # 'user': sender,
            # 'sender': sender_id,
            'timestamp': timestamp,
            'message': content
        }))

    def get_receiver_username(self, room_name, sender_username):
        """
        Given a room name like 'room_timestamp_username1_username2', extract the
        receiver's username by identifying which one is not the sender.
        """
        # Extract usernames from the room_name
        print(f"---------------------->|{room_name}|")
        _, username1, username2 = room_name.split("_")
        
        # Determine which username is the sender and which is the receiver
        if username1 == sender_username:
            return username2
        return username1

    def generate_random_string(self, length=8):
        """Generate a random string of letters and digits for guest users."""
        return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
