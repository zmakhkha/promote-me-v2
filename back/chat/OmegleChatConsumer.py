import json
import random
import time
from channels.generic.websocket import AsyncWebsocketConsumer

# Global list for waiting users
waiting_users = []

class OmegleChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Handles new WebSocket connections."""
        # Extract user details from the URL
        self.ip = self.scope['url_route']['kwargs']['ip']
        self.name = self.scope['url_route']['kwargs']['name']
        self.age = self.scope['url_route']['kwargs']['age']
        timestamp = int(time.time())
        self.username = f"{timestamp}-{self.ip}"  # Unique username
        self.user_id = f"{self.name}_{self.age}_{self.ip}"
        self.room_group_name = None

        # Accept WebSocket connection
        await self.accept()

        # Add user to waiting list and try matching
        if self not in waiting_users:
            waiting_users.append(self)

        await self.match_users()

    async def disconnect(self, close_code):
        """Handles WebSocket disconnections."""
        # Remove user from waiting list if they were there
        if self in waiting_users:
            waiting_users.remove(self)
            print(f"[disconnect] User {self.username} disconnected, waiting list size: {len(waiting_users)}")

        # Notify partner if the user was in a chat room
        if self.room_group_name:
            room_name = self.room_group_name
            self.room_group_name = None  # Clear before notifying others

            await self.channel_layer.group_send(
                room_name,
                {
                    "type": "partner_disconnected",
                    "content": "Your chat partner has disconnected.",
                },
            )

            # Remove user from the chat room group
            await self.channel_layer.group_discard(room_name, self.channel_name)

    async def partner_disconnected(self, event):
        """Handles partner disconnection messages."""
        await self.send(text_data=json.dumps({
            "content": event["content"],
            "type": "disconnect"
        }))
        self.room_group_name = None

    async def receive(self, text_data):
        """Handles incoming messages from users."""
        data = json.loads(text_data)
        print(f"[OmegleChatConsumer][receive] {data}")

    async def match_users(self):
        """Matches users from the waiting list to create a chat room."""
        print(f"[match_users] Trying to match user, waiting list size: {len(waiting_users)}")

        if len(waiting_users) < 2:
            return  # Not enough users to match

        # Ensure only users without a room are matched
        available_users = [user for user in waiting_users if user.room_group_name is None]

        if len(available_users) < 2:
            return  # Not enough free users to match

        user1, user2 = random.sample(available_users, 2)
        print(f"[match_users] Matched {user1.username} with {user2.username}")

        # Create a unique chat room
        room_name = f"chat_{user1.username}_{user2.username}"
        user1.room_group_name = room_name
        user2.room_group_name = room_name

        # Add both users to the chat room group
        await self.channel_layer.group_add(room_name, user1.channel_name)
        await self.channel_layer.group_add(room_name, user2.channel_name)

        # Notify both users
        await self.channel_layer.group_send(
            room_name,
            {
                "type": "match_made",
                "content": "You have been matched!",
                "roomId": room_name,
            },
        )

        # Remove matched users from the waiting list
        waiting_users.remove(user1)
        waiting_users.remove(user2)
        print(f"[match_users] Matched users, waiting list size: {len(waiting_users)}")

    async def match_made(self, event):
        """Sends a match confirmation message to both users."""
        await self.send(text_data=json.dumps({
            "content": event["content"],
            "roomId": event["roomId"],
            "type": "match"
        }))
