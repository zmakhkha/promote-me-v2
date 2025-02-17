# isort: skip_file
from django.core.asgi import get_asgi_application
from django.urls import path,re_path
from channels.routing import ProtocolTypeRouter, URLRouter

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django_asgi_app = get_asgi_application()

from chat.DirectChatConsumer import DirectChatConsumer
from chat.DmConsumer import DmConsumer
from chat.DmOmegleConsumer import DmOmegleConsumer
from chat.randomChatConsumer import RandomChatConsumer
from chat.statusConsumer import StatusConsumer
from chat.OmegleChatConsumer import OmegleChatConsumer

application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': URLRouter([
	path("ws/status/<str:token>/<int:type>", StatusConsumer.as_asgi()),
	path("ws/random/<str:token>", RandomChatConsumer.as_asgi()),
  path("ws/chat/<str:token>/<str:roomId>", DmConsumer.as_asgi()),
  path("ws/omegle-chat/<str:roomId>", DmOmegleConsumer.as_asgi()),
  path("ws/direct/<str:token>/<str:user>", DirectChatConsumer.as_asgi()),
  path("ws/omegle/<str:ip>/<str:name>/<str:age>", OmegleChatConsumer.as_asgi()),
  # path("ws/chat/<str:token>/<str:roomId>", DmConsumer.as_asgi()),
  ]
    ),
})