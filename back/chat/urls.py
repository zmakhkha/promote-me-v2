from django.urls import path
from .views import *

urlpatterns = [
    path('messages/<str:receiver_username>/', MessageAPIView.as_view(), name='messages-between-users'),	
    path('messages-notifications/', UnseenMessagesView.as_view(), name='message-notifications'),	
    path('delete-messages/', DeleteAllMessages.as_view(), name='delete-message'),
	path("api/online-users/", OnlineUsersAPIView.as_view(), name="online-users"),
]