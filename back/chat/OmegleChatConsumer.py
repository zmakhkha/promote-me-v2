import json
import random
import time
from channels.generic.websocket import AsyncWebsocketConsumer

# Global list for waiting users, which will store the connection object itself
waiting_users = []

class OmegleChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract user details from the URL
        self.ip = self.scope['url_route']['kwargs']['ip']
        self.name = self.scope['url_route']['kwargs']['name']
        self.age = self.scope['url_route']['kwargs']['age']
        timestamp = int(time.time())
        self.username = f"{timestamp}-{self.ip}"  # Unique username
        self.user_id = f"{self.name}_{self.age}_{self.ip}"
        self.room_group_name = None
        waiting_users.append(self)

        # Accept the WebSocket connection
        await self.accept()

        # Try matching users
        await self.match_users()

    async def disconnect(self, close_code):
        # Remove user from waiting list if they were there
        if self in waiting_users:
            waiting_users.remove(self)
            print('[disconnect]= user disconnected, list containing : ', len(waiting_users))


        # If the user is in a room, notify the partner of the disconnection
        if self.room_group_name:
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "partner_disconnected", "content": "Your chat partner has disconnected."},
            )
            # Discard the user from the room group
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"[OmegleChatConsumer][receive] {data}")

    
    async def match_users(self):
        print('[match_users]= tried to match user with list containing : ', len(waiting_users))
        """Match users from the waiting list to create a chat room."""
        # If there are fewer than 2 users, wait for another user to connect
        if len(waiting_users) < 2:
            if self not in waiting_users:
                waiting_users.append(self)
            return

        # Ensure there are at least two users in waiting_users before attempting to match
        if len(waiting_users) >= 2:
            user1, user2 = random.sample(waiting_users, 2)
            print(f"[match_users] matched [{user1.username}] with [{user2.username}]")

            # Create a unique room name for the chat
            room_name = f"chat_{user1.username}_{user2.username}"

            # Set the room group for both users
            user1.room_group_name = room_name
            user2.room_group_name = room_name

            # Add both users to the same chat room
            await self.channel_layer.group_add(room_name, user1.channel_name)
            await self.channel_layer.group_add(room_name, user2.channel_name)

            # Notify both users that they have been matched
            await self.channel_layer.group_send(
                room_name,
                {
                    "type": "match_made",
                    "content": "You have been matched!",
                    "roomId": f"{room_name}",
                },
            )
            waiting_users.remove(user1)
            waiting_users.remove(user2)
            print('[match_users]= Matched two users, list containing : ', len(waiting_users))


    async def match_made(self, event):
        # Send a message to both users that they have been matched
        await self.send(text_data=json.dumps({"content": event["content"], "roomId": event["roomId"], "type": "match"}))

    async def partner_disconnected(self, event):
        # Notify the user that their partner has disconnected
        await self.send(text_data=json.dumps({"content": event["content"], "type": "disconnect"}))
        self.room_group_name = None