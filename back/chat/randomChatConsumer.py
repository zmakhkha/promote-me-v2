import json
import time
from asyncio import Queue
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils import getUser
from asgiref.sync import async_to_sync

class RandomChatConsumer(AsyncWebsocketConsumer):
    user_queue = Queue()  # Queue to hold unmatched users

    async def connect(self):
        token = self.scope["url_route"]["kwargs"].get("token")
        if not token:
            await self.close()
            return

        user = await getUser(token)
        if user is None:
            await self.close()
            return

        self.scope["user"] = user
        await self.accept()

        # Add user to queue
        await self.user_queue.put(user)
        await self.try_match_users()

    async def disconnect(self, close_code):
        # Remove user from the queue on disconnect
        user = self.scope["user"]
        await self.remove_user_from_queue(user)

    async def try_match_users(self):
        # Attempt to match users when the queue has at least two users
        if self.user_queue.qsize() >= 2:
            user1 = await self.user_queue.get()
            user2 = await self.user_queue.get()

            # Create a unique room name
            timestamp = int(time.time())
            room_name = f"room_{timestamp}_{user1.username}_{user2.username}"

            # Notify both users about the room
            await self.send_room_notification(user1, room_name, user2)
            await self.send_room_notification(user2, room_name, user1)

    async def send_room_notification(self, user, room_name, partner):
        # Send room redirection message
        await self.channel_layer.group_add(room_name, self.channel_name)
        await self.send(
            text_data=json.dumps(
                {
                    "type": "redirect",
                    "room_name": room_name,
                    "partner": {
                        "username": partner.username,
                        "id": partner.id,
                    },
                }
            )
        )

    async def remove_user_from_queue(self, user):
        # Remove user from the queue if they disconnect
        temp_queue = Queue()
        while not self.user_queue.empty():
            queued_user = await self.user_queue.get()
            if queued_user != user:
                await temp_queue.put(queued_user)
        self.user_queue = temp_queue
