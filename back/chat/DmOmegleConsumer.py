from channels.generic.websocket import AsyncWebsocketConsumer
import datetime
import json
from .utils import  getLogging


logger = getLogging()

class DmOmegleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        room_name = self.scope["url_route"]["kwargs"]["roomId"]
        print(f"romm id : ------------->{room_name}")
        sender = self.scope["url_route"]["kwargs"]["sender"]

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
            message = message_data.get('content')
            if message:
                logger.debug(f"DmOmegleConsumer: receive - Message message: {message}")
                room_name = self.scope['url_route']['kwargs']['roomId']
                sender = self.scope['url_route']['kwargs']['sender']
                
                # Get current timestamp
                x = datetime.datetime.now()

                print("before : DmOmegleConsumer: sent to WebSocket")
                await self.channel_layer.group_send(
                    room_name,
                    {
                        'type': 'chat_message',
                        'sender': sender,
                        'timestamp': {
                            'year': x.year,
                            'month': x.month,
                            'day': x.day,
                            'hour': x.hour,
                            'minute': x.minute,
                        },
                        'content': message
                    }
                )
                print("after : DmOmegleConsumer: sent to WebSocket")
        except json.JSONDecodeError:
            logger.error("DmOmegleConsumer: receive - Failed to parse received message as JSON.")

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    # async def chat_message(self, event):
    #     room_name = event['room_name']
    #     content = event['content']
    #     sender = event['sender']
    #     timestamp = event['timestamp']

    #     # Send the message to the WebSocket
    #     await self.send(text_data=json.dumps({
    #         'type': 'chat_message',
    #         'room_name' : room_name,
    #         'sender': sender,
    #         'timestamp': timestamp,
    #         'content': content
    #     }))

    def get_users_username(self, room_name, sender_username):
        """
        Given a room name like 'room_timestamp_username1_username2', extract the
        receiver's username by identifying which one is not the sender.
        """
        # Extract usernames from the room_name
        _, username1, username2 = room_name.split("_")        
        return username1, username2