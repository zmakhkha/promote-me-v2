import json
import random
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .utils import getUser
from users.models import DefaultUser


class RandomChatConsumer(AsyncWebsocketConsumer):
    user_queue = []
    matching_group = "matching"  # All users join this group

    async def connect(self):
        print("[RandomChatConsumer] connect: Attempting to connect.")
        token = self.scope["url_route"]["kwargs"].get("token")
        if not token:
            print("[RandomChatConsumer] connect: No token provided. Closing connection.")
            await self.close()
            return

        user = await getUser(token)
        if user is None or user.status != DefaultUser.STATUS_IDLE:
            print(f"[RandomChatConsumer] connect: Invalid user or status not IDLE. User: {user}, Status: {user.status if user else 'None'}. Closing connection.")
            await self.close()
            return

        self.scope["user"] = user
        print(f"[RandomChatConsumer] connect: Connection accepted. User: {user.username}, Status: {user.status}.")
        await self.accept()

        # Add user to the "matching" group and the queue
        await self.channel_layer.group_add(self.matching_group, self.channel_name)
        await self.add_user_to_queue(user)

        # Try matching users
        await self.try_match_users()

    async def disconnect(self, close_code):
        print("[RandomChatConsumer] disconnect: Disconnecting user.")
        user = self.scope.get("user")
        if user:
            print(f"[RandomChatConsumer] disconnect: Removing user {user.username} from group and queue.")
            # Remove user from the matching group and queue
            await self.channel_layer.group_discard(self.matching_group, self.channel_name)
            await self.remove_user_from_queue(user)

    async def try_match_users(self):
        print("[RandomChatConsumer] try_match_users: Attempting to match users.")
        if len(self.user_queue) >= 2:
            # Shuffle the user queue for randomness
            random.shuffle(self.user_queue)
            print("[RandomChatConsumer] try_match_users: User queue shuffled.")

            # Match the first two users
            user1 = self.user_queue.pop(0)
            user2 = self.user_queue.pop(0)
            print(f"[RandomChatConsumer] try_match_users: Matched users {user1.username} and {user2.username}.")

            # Create a unique room name for the matched pair
            timestamp = int(time.time())
            room_name = f"room_{timestamp}_{user1.username}_{user2.username}"
            print(f"[RandomChatConsumer] try_match_users: Created room {room_name}.")

            # Notify all users in the matching group about the match
            await self.broadcast_room_notification(user1, user2, room_name)

            # Update statuses to indicate they are chatting
            await self.update_user_status(user1, DefaultUser.STATUS_CHAT)
            await self.update_user_status(user2, DefaultUser.STATUS_CHAT)

            # Remove matched users from the queue
            await self.remove_user_from_queue(user1)
            await self.remove_user_from_queue(user2)

    async def broadcast_room_notification(self, user1, user2, room_name):
        print(f"[RandomChatConsumer] broadcast_room_notification: Broadcasting room notification for room {room_name}.")
        # Send the notification to all users in the "matching" group
        await self.channel_layer.group_send(
            self.matching_group,
            {
                "type": "chat.message",
                "message": {
                    "type": "redirect",
                    "room_name": room_name,
                    "users": {
                        "user1": {"username": user1.username, "id": user1.id},
                        "user2": {"username": user2.username, "id": user2.id},
                    },
                },
            },
        )

    async def chat_message(self, event):
        message = event["message"]
        print(f"[RandomChatConsumer] chat_message: Sending message to WebSocket. Message: {message}.")
        await self.send(text_data=json.dumps(message))

    async def add_user_to_queue(self, user):
        print(f"[RandomChatConsumer] add_user_to_queue: Adding user {user.username} to queue. Current Status: {user.status}.")
        # Add user to the queue and update status to IDLE
        print(f"[RandomChatConsumer] Queue size [Before]: {len(self.user_queue)}.")
        self.user_queue.append(user)
        print(f"[RandomChatConsumer] Queue size [After]: {len(self.user_queue)}.")
        await self.update_user_status(user, DefaultUser.STATUS_IDLE)

    async def remove_user_from_queue(self, user):
        print(f"[RandomChatConsumer] remove_user_from_queue: Removing user {user.username} from queue. Current Status: {user.status}.")
        # Remove user from the queue and update status to OFFLINE
        if user in self.user_queue:
            self.user_queue.remove(user)
        await self.update_user_status(user, DefaultUser.STATUS_OFFLINE)

    async def update_user_status(self, user, status):
        print(f"[RandomChatConsumer] update_user_status: Updating status for user {user.username} to {status}.")
        user.status = status
        await sync_to_async(user.save)(update_fields=["status"])
