from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import SignInAPIView, SignUpAPIView

urlpatterns = [
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/register/', SignUpAPIView.as_view(), name='register'),
    path('api/v1/login/', SignInAPIView.as_view(), name='login'),
]