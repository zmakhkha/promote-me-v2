from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from django.forms import ValidationError
from django.contrib.auth import authenticate, login
from django.core.cache import cache
from django.shortcuts import get_object_or_404


from rest_framework import generics
from rest_framework.response import Response
from .models import DefaultUser
from .serializers import AdminModifyUserSerializer, AdminUserSerializer, UserDetailSerializer, UserProfileSerializer, UserSerializer
from rest_framework.exceptions import ValidationError


from .models import DefaultUser
from .serializers import UserListSerializer, UserSerializer

class SignInAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        cache_key = f"login_attempts_{username}"
        attempts = cache.get(cache_key, 0)

        if attempts >= 5:
            return Response({'error': 'Too many login attempts. Please try again later.'}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            cache.delete(cache_key)
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_staff' : user.is_staff
            }, status=status.HTTP_200_OK)
        else:
            cache.set(cache_key, attempts + 1, timeout=300)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class SignUpAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            email = serializer.validated_data.get('email')

            if DefaultUser.objects.filter(email=email).exists():
                return Response({'error': 'This email is already in use.'}, status=status.HTTP_400_BAD_REQUEST)
            if DefaultUser.objects.filter(username=username).exists():
                return Response({'error': 'This username is already in use.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                serializer.save()
                return Response({'status': 'Account created successfully'}, status=status.HTTP_201_CREATED)
            except ValidationError as e:
                return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from django.db.models import F, Func, Value
from django.db.models.functions import ExtractYear
from datetime import datetime

from .models import DefaultUser
from .serializers import UserListSerializer


class UserListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserListSerializer

    def get_queryset(self):
        queryset = DefaultUser.objects.all()
        # queryset = queryset.exclude(id = self.request.user.id)

        # Get query parameters
        age_from = self.request.query_params.get('age_from')
        age_to = self.request.query_params.get('age_to')
        gender = self.request.query_params.get('gender')

        # Filter by age range
        current_year = datetime.now().year
        if age_from or age_to:
            try:
                if age_from:
                    birth_year_to = current_year - int(age_from)
                    queryset = queryset.filter(birth_date__year__lte=birth_year_to)
                if age_to:
                    birth_year_from = current_year - int(age_to)
                    queryset = queryset.filter(birth_date__year__gte=birth_year_from)
            except ValueError:
                raise ValidationError("Age parameters must be valid integers.")

        # Filter by gender
        if gender:
            valid_genders = ['Male', 'Female', 'other']
            if gender not in valid_genders:
                raise ValidationError(f"Gender must be one of {valid_genders}.")
            queryset = queryset.filter(gender=gender)

        return queryset


from rest_framework import generics
from rest_framework.exceptions import NotFound
from .models import DefaultUser
from .serializers import UserListSerializer

class UserDetailView(generics.RetrieveAPIView):
    queryset = DefaultUser.objects.all()
    serializer_class = UserDetailSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny]

    def get_object(self):
        username = self.kwargs.get('username')
        try:
            return self.queryset.get(username=username)
        except DefaultUser.DoesNotExist:
            raise NotFound({"Error": "User not found!"})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserSettingsSerializer

class UserSettingsView(APIView):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSettingsSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSettingsSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    

class UserListView(APIView):
    # permission_classes = [IsAdminUser]
    permission_classes = [AllowAny]

    def get(self, request):
        # if not request.user.is_staff:  # Double-check admin status
        #     return Response({'error': 'Role non valid'}, status=status.HTTP_401_UNAUTHORIZED)

        # Exclude the logged-in admin from the returned data
        users = DefaultUser.objects.exclude(id=request.user.id)
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)
    
class ModifyUserView(APIView):
    def get(self, request, *args, **kwargs):
        username = request.query_params.get("username")
        if not username:
            return Response({"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(DefaultUser, username=username)
        serializer = AdminModifyUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        username = request.data.get("username")
        if not username:
            return Response({"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(DefaultUser, username=username)

        serializer = AdminModifyUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User data updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    