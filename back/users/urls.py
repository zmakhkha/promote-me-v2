from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (SendOTPView,
 SignInAPIView,
 SignUpAPIView,
 UserListView,
 UserDetailView,
 UserProfileView,
 UserSettingsView,
 UserListView,
 ModifyUserView,
 VerifyOTPView,
 VerifyUSernameView,
 RecordProfileView,
 LikeUser,
 DislikeUser,
 CheckLikeStatus
 )

urlpatterns = [
    #tokens
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    #auth
    path('register/', SignUpAPIView.as_view(), name='register'),
    path('login/', SignInAPIView.as_view(), name='login'),
    
    #user list
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<str:username>/', UserDetailView.as_view(), name='user-detail'),
	path('settings/', UserSettingsView.as_view(), name='user-settings'),
	path('profile/', UserProfileView.as_view(), name='user-profile'),
   
   #Admin
    path('list-users/', UserListView.as_view(), name='list-user'),
    path('modify-user/', ModifyUserView.as_view(), name='modify-user'),
   
   #otp
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("verify-username/", VerifyUSernameView.as_view(), name="verify-username"),
	
    #
    path('profile/view/', RecordProfileView.as_view(), name='record-profile-view'),
    path('profile/like/', LikeUser.as_view(), name='like-user'),
    path('profile/dislike/', DislikeUser.as_view(), name='dislike-user'),
    path('profile/like-status/<str:username>/', CheckLikeStatus.as_view(), name='like-status'),
]