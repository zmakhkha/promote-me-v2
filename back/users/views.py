from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from django.forms import ValidationError
from django.contrib.auth import authenticate, login
from django.core.cache import cache

from rest_framework import generics
from rest_framework.response import Response
from .models import DefaultUser
from .serializers import UserDetailSerializer, UserSerializer
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
                return Response({'email': 'This email is already in use.'}, status=status.HTTP_400_BAD_REQUEST)
            if DefaultUser.objects.filter(username=username).exists():
                return Response({'username': 'This username is already in use.'}, status=status.HTTP_400_BAD_REQUEST)

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
            valid_genders = ['male', 'female', 'other']
            if gender.lower() not in valid_genders:
                raise ValidationError(f"Gender must be one of {valid_genders}.")
            queryset = queryset.filter(gender=gender.lower())

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
