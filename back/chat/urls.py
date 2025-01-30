from django.urls import path

from .views import MessageAPIView

urlpatterns = [
    path('messages/<str:receiver_username>/', MessageAPIView.as_view(), name='messages-between-users'),	
	
]