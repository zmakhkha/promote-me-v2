from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from users.models import DefaultUser
from .utils import getUser


class StatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("[Status Socket Connection] Attempting to connect...")
        authorization_header = self.scope["url_route"]["kwargs"]["token"]
        if not authorization_header:
            await self.close()
            return

        user = await getUser(authorization_header)
        print('user->', user)
        if user is None:
            print("[Status Socket Connection] Connection rejected: User not found.")
            await self.close()
            return

        self.scope["user"] = user
        ConnType = self.scope["url_route"]["kwargs"]["type"]
        status_message = ""
        
        if ConnType == 1:
            user.status = DefaultUser.STATUS_ONLINE
            status_message = "ONLINE"
        elif ConnType == 2:
            user.status = DefaultUser.STATUS_IDLE
            status_message = "IDLE"
        
        await sync_to_async(user.save)(update_fields=['status'])
        await self.accept()
        await self.channel_layer.group_add('status_group', self.channel_name)
        await self.channel_layer.group_send(
            'status_group',
            {
                'type': 'status_user',
                'action': 'A user is now ONLINE !',
            }
        )

        print(f"[Status Socket Connection] DefaultUser {user.id} ({user.username}) connected with status: {status_message}")

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        if user:
            user.status = DefaultUser.STATUS_OFFLINE
            await sync_to_async(user.save)(update_fields=['status'])
            print(f"[Status Socket Connection] DefaultUser {user.id} ({user.username}) disconnected.")
        await self.channel_layer.group_send(
            'status_group',
            {
                'type': 'status_user',
                'action': 'A user is now OFFLINE !',
            }
        )
        await self.channel_layer.group_discard('status_group', self.channel_name)

            

    async def receive(self, text_data):
        pass

    async def status_user(self, event):
        action = event['action']
        await self.send(text_data=json.dumps({
            'type': 'status_user',
            'action': action,
        }))
