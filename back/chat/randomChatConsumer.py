from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from users.models import DefaultUser
from .utils import get_user


class RandomChatConsumer(AsyncWebsocketConsumer):
    user_queue = []  # Queue to manage users waiting for a chat

    async def connect(self):
        print("[Random Chat] Attempting to connect...")

        # Extract the token from the URL
        authorization_header = self.scope["url_route"]["kwargs"].get("token")

        if not authorization_header:
            print("[Random Chat] No token provided.")
            await self.close()
            return

        # Authenticate the user
        user = await get_user(authorization_header)
        if user is None:
            print("[Random Chat] Invalid or unauthorized user.")
            await self.close()
            return

        self.scope["user"] = user
        self.chat_partner = None

        # Add the user to the queue and attempt to pair them
        await self.add_to_queue(user)
        await self.accept()

    async def disconnect(self, close_code):
        user = self.scope.get("user")

        # Remove the user from the queue and notify their chat partner
        if user:
            await self.remove_from_queue(user)
            if self.chat_partner:
                await self.channel_layer.group_send(
                    f"chat_{self.chat_partner.id}",
                    {
                        "type": "chat.message",
                        "message": "Your chat partner has disconnected.",
                        "sender": "system",
                    },
                )
                await self.channel_layer.group_discard(
                    f"chat_{self.chat_partner.id}", self.channel_name
                )
                self.chat_partner = None

        await self.channel_layer.group_discard(f"chat_{user.id}", self.channel_name)
        print(f"[Random Chat] User {user.id} disconnected.")

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")

        if self.chat_partner:
            # Send the message to the chat partner
            await self.channel_layer.group_send(
                f"chat_{self.chat_partner.id}",
                {
                    "type": "chat.message",
                    "message": message,
                    "sender": self.scope["user"].username,
                },
            )
        else:
            await self.send(
                text_data=json.dumps(
                    {"type": "error", "message": "No chat partner available."}
                )
            )

    async def chat_message(self, event):
        # Broadcast the chat message to the WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "type": "chat.message",
                    "message": event["message"],
                    "sender": event["sender"],
                }
            )
        )

    @classmethod
    async def add_to_queue(cls, user):
        cls.user_queue.append(user)
        print(f"[Random Chat] User {user.id} added to the queue.")
        await cls.pair_users()

    @classmethod
    async def remove_from_queue(cls, user):
        if user in cls.user_queue:
            cls.user_queue.remove(user)
            print(f"[Random Chat] User {user.id} removed from the queue.")

    @classmethod
    async def pair_users(cls):
        if len(cls.user_queue) >= 2:
            user1 = cls.user_queue.pop(0)
            user2 = cls.user_queue.pop(0)
            await cls.create_chat_room(user1, user2)

    @staticmethod
    async def create_chat_room(user1, user2):
        # Assign users to each other's chat groups
        await RandomChatConsumer.add_user_to_group(user1, user2)
        await RandomChatConsumer.add_user_to_group(user2, user1)

        print(
            f"[Random Chat] Chat room created between User {user1.id} and User {user2.id}."
        )

    @staticmethod
    async def add_user_to_group(user, partner):
        group_name = f"chat_{user.id}"
        await sync_to_async(DefaultUser.objects.filter(id=user.id).update)(
            chat_partner=partner
        )
        await RandomChatConsumer.channel_layer.group_add(group_name, f"chat_{partner.id}")
        print(f"[Random Chat] User {user.id} joined group {group_name}.")
