import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

# Store users waiting for a match
waiting_users = []

class OmegleChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["user"].id if self.scope["user"].is_authenticated else self.channel_name
        self.room_group_name = None  # Initialize room variable

        await self.accept()

        # Check if there's a user waiting for a match
        if waiting_users:
            partner = waiting_users.pop(0)

            if partner == self:  # Prevent self-matching
                waiting_users.append(self)
                return

            room_name = f"chat_{partner.user_id}_{self.user_id}"

            self.room_group_name = room_name
            partner.room_group_name = room_name

            # Add both users to the chat room
            await self.channel_layer.group_add(room_name, self.channel_name)
            await self.channel_layer.group_add(room_name, partner.channel_name)

            # Notify both users
            await self.channel_layer.group_send(
                room_name,
                {
                    "type": "match_made",
                    "message": "You have been matched with a chat partner!",
                },
            )
        else:
            if self not in waiting_users:
                waiting_users.append(self)  # Add user to waiting queue

    async def disconnect(self, close_code):
        # Remove from waiting queue if still waiting
        if self in waiting_users:
            waiting_users.remove(self)
        elif self.room_group_name:
            # Notify chat partner about disconnection
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "partner_disconnected",
                    "message": "Your chat partner has disconnected.",
                },
            )
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        if self.room_group_name and message:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": self.user_id,
                },
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"], "sender": event["sender"]}))

    async def match_made(self, event):
        await self.send(text_data=json.dumps({"message": event["message"], "type": "match"}))

    async def partner_disconnected(self, event):
        await self.send(text_data=json.dumps({"message": event["message"], "type": "disconnect"}))
        self.room_group_name = None  # Reset room name after disconnect
