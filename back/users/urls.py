from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import SignInAPIView, SignUpAPIView, UserListView,UserDetailView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', SignUpAPIView.as_view(), name='register'),
    path('login/', SignInAPIView.as_view(), name='login'),
	 path('users/', UserListView.as_view(), name='user-list'),
    path('users/<str:username>/', UserDetailView.as_view(), name='user-detail'),
]