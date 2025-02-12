import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

# Store users waiting for a match
waiting_users = []

class OmegleChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["user"].id if self.scope["user"].is_authenticated else self.channel_name

        await self.accept()

        # Try to match with another user
        if waiting_users:
            partner = waiting_users.pop(0)
            room_name = f"chat_{partner}_{self.user_id}"
            
            self.room_group_name = room_name
            partner.room_group_name = room_name
            
            await self.channel_layer.group_add(room_name, self.channel_name)
            await self.channel_layer.group_add(room_name, partner.channel_name)

            await self.channel_layer.group_send(
                room_name,
                {
                    "type": "match_made",
                    "message": "You have been matched with a chat partner!",
                },
            )
        else:
            waiting_users.append(self)

    async def disconnect(self, close_code):
        if self in waiting_users:
            waiting_users.remove(self)
        else:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "partner_disconnected",
                    "message": "Your chat partner has disconnected.",
                },
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]

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
