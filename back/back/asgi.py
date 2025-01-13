# isort: skip_file
from django.core.asgi import get_asgi_application
from django.urls import path,re_path
from channels.routing import ProtocolTypeRouter, URLRouter

import os
django_asgi_app = get_asgi_application()

from chat.DmConsumer import DmConsumer
from chat.randomChatConsumer import RandomChatConsumer
from chat.statusConsumer import StatusConsumer
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myChat.settings')

application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': URLRouter([
	path("ws/status/<str:token>/<int:type>", StatusConsumer.as_asgi()),
	path("ws/random/<str:token>", RandomChatConsumer.as_asgi()),
  path("ws/chat/<str:token>/<str:roomId>", DmConsumer.as_asgi()),
  ]
    ),
})