import logging
from datetime import datetime
from datetime import date

# Django imports
from django.contrib.auth import authenticate, login
from django.core.cache import cache
from django.core.mail import send_mail
from django.forms import ValidationError as DjangoValidationError
from django.db.models import F, Func, Value
from django.db.models.functions import ExtractYear
from django.shortcuts import get_object_or_404

# DRF imports
from rest_framework import generics, status
from rest_framework import status, permissions
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

# Local imports
from .models import (OTPVerification,DefaultUser, ProfileView, ProfileLike)
from .serializers import (
    AdminModifyUserSerializer,
    AdminUserSerializer,
    DiscoverProfileSerializer,
    RegisterUserSerializer,
    UserDetailSerializer,
    UserListSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    UserSerializer,
    UserSettingsSerializer,
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status


# Set up logger
logger = logging.getLogger(__name__)


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
                'is_staff' : user.is_staff,
                'is_complete': user.is_profile_complete(),
            }, status=status.HTTP_200_OK)
        else:
            cache.set(cache_key, attempts + 1, timeout=300)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class SignUpAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Log the request data for debugging purposes
        logger.debug(f"Request Data: {request.data}")
        
        serializer = RegisterUserSerializer(data=request.data)
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
                # Log the validation error
                logger.error(f"ValidationError during account creation: {e.messages}")
                return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)

        # Log serializer errors if validation fails
        for field, errors in serializer.errors.items():
            logger.error(f"Validation Error in field '{field}': {errors}")
        
        # Return serializer errors as response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserListSerializer

    def get_queryset(self):
        queryset = DefaultUser.objects.all()
        platform = self.kwargs.get('platform')

        if platform:
            platform = platform.lower()
            if platform not in ['snap', 'tiktok', 'insta']:
                raise ValidationError("Platform must be one of: snap, tiktok, insta.")

            platform_field = {
                'snap': 'snapchat__isnull',
                'tiktok': 'tiktok__isnull',
                'insta': 'instagram__isnull'
            }

            # Exclude users with null or blank platform fields
            kwargs = {platform_field[platform]: False}
            queryset = queryset.filter(**kwargs).exclude(**{platform_field[platform].replace('__isnull', ''): ""})

        # Additional filters
        age_from = self.request.query_params.get('age_from')
        age_to = self.request.query_params.get('age_to')
        gender = self.request.query_params.get('gender')

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

        if gender:
            valid_genders = ['male', 'female', 'other']
            if gender not in valid_genders:
                raise ValidationError(f"Gender must be one of {valid_genders}.")
            queryset = queryset.filter(gender=gender)

        return queryset

class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
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


class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]
    # permission_classes = [AllowAny]

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

class AdminUserListView(APIView):
    # permission_classes = [IsAdminUser]
    # permission_classes = [AllowAny]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # if not request.user.is_staff:  # Double-check admin status
        #     return Response({'error': 'Role non valid'}, status=status.HTTP_401_UNAUTHORIZED)

        # Exclude the logged-in admin from the returned data
        users = DefaultUser.objects.exclude(id=request.user.id)
        serializer = AdminUserSerializer(users, many=True)
        serializer = UserDetailSerializer(users, many=True)
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

class VerifyUSernameView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Attempt to get or create a user
            user = DefaultUser.objects.get(username=username)
        except Exception as e:
            # Catch any unexpected errors and return an error response
            return Response({"message": "Username vailable."}, status=status.HTTP_200_OK)
        return Response({"error": "Username already used !!"}, status=status.HTTP_400_BAD_REQUEST)

class SendOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Attempt to get or create a user
            user, created = DefaultUser.objects.get_or_create(username=email, email=email)
        except Exception as e:
            # Catch any unexpected errors and return an error response
            return Response({"error": "Email already used !!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_instance, _ = OTPVerification.objects.get_or_create(user=user)
            otp_instance.generate_otp()

            # Send OTP via email
            send_mail(
                "Your OTP Code",
                f"Your OTP code is {otp_instance.otp}",
                "your-email@gmail.com",
                [email],
                fail_silently=False,
            )
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            # Handle errors related to OTP generation or sending the email
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        print(f"Received email: {email}, otp: {otp}")

        try:
            user = DefaultUser.objects.get(email=email)
            otp_instance = OTPVerification.objects.get(user=user)

            if otp_instance.otp == otp:
                otp_instance.delete()  # OTP is used, delete it
                user.delete()
                return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        except DefaultUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        except OTPVerification.DoesNotExist:
            return Response({"error": "OTP not found"}, status=status.HTTP_404_NOT_FOUND)

class RecordProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print('------------++-------------')
        viewed_username = request.data.get('viewed_username')
        try:
            viewer = request.user
            viewed = DefaultUser.objects.get(username=viewed_username)

            if viewer == viewed:
                return Response({'detail': 'Cannot view your own profile.'}, status=status.HTTP_400_BAD_REQUEST)

            today = date.today()
            _, created = ProfileView.objects.get_or_create(viewer=viewer, viewed=viewed, date=today)
            if created:
                viewer.points += 5
                viewed.points += 10
                viewed.views += 1
                viewer.save()
                viewed.save()

            return Response({'detail': 'Profile view recorded.'}, status=status.HTTP_200_OK)

        except DefaultUser.DoesNotExist:
            return Response({'detail': 'Viewed user not found.'}, status=status.HTTP_404_NOT_FOUND)

class LikeUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        liked_username = request.data.get('liked_username')
        try:
            liker = request.user
            liked = DefaultUser.objects.get(username=liked_username)

            if liker == liked:
                return Response({'detail': 'Cannot like yourself.'}, status=status.HTTP_400_BAD_REQUEST)

            _, created = ProfileLike.objects.get_or_create(liked_by=liker, liked_user=liked)
            if created:
                liker.points += 2
                liked.likes += 1
                liker.save()
                liked.save()
                return Response({'detail': 'User liked.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'You already liked this user.'}, status=status.HTTP_200_OK)

        except DefaultUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


class DislikeUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        disliked_username = request.data.get('disliked_username')
        try:
            disliker = request.user
            disliked = DefaultUser.objects.get(username=disliked_username)

            if disliker == disliked:
                return Response({'detail': 'Cannot dislike yourself.'}, status=status.HTTP_400_BAD_REQUEST)

            # Find the like object if it exists
            like_obj = ProfileLike.objects.filter(liked_by=disliker, liked_user=disliked).first()
            
            if like_obj:
                # Remove like, update like counts, and delete the relationship
                disliked.likes -= 1 if disliked.likes > 0 else 0
                disliker.save()
                disliked.save()
                like_obj.delete()
                return Response({'detail': 'User disliked.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'You have not liked this user yet.'}, status=status.HTTP_200_OK)

        except DefaultUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class CheckLikeStatus(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request,username, *args, **kwargs):
        # username = request.data.get('username')        
        print(f"--------->{username}")
        # Get the target user
        target_user = DefaultUser.objects.get(username=username)
            
        # Check if there is a like relationship between the authenticated user and the target user
        like_exists = ProfileLike.objects.filter(liked_by=request.user, liked_user=target_user).exists()
        if like_exists:
            return Response({'detail': True}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': False}, status=status.HTTP_200_OK)


class DiscoverProfilesAPIView(APIView):
    """
    Get a list of profiles for discovery cards.
    """

    def get(self, request, *args, **kwargs):
        users = DefaultUser.objects.filter(is_discoverable=True).order_by("-id")[:20]
        serializer = DiscoverProfileSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserPersonalInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileUpdateSerializer(user)
        return Response(serializer.data)
    def put(self, request):
        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserImageDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        image_field = request.data.get('image_field')

        allowed_fields = [
            'image_profile',
            'image_2',
            'image_3',
            'image_4',
            'image_5',
        ]
        if image_field not in allowed_fields:
            return Response (
                {'error': 'Invalid image field.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        setattr(user, image_field, '')
        user.save()
        return Response(
                {"message": f"{image_field} deleted successfully."},
                status= status.HTTP_200_OK
            
        )


from rest_framework import generics, permissions
from django.db.models import Q, Count
from .models import DefaultUser
from .serializers import DiscoverUserSerializer
from rest_framework import serializers
from .models import DefaultUser
from datetime import date
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    # Calculate the great circle distance between two points in km
    # from https://stackoverflow.com/a/4913653
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    km = 6371 * c
    return km

from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import DiscoverUserSerializer
from .models import DefaultUser
from django.db.models import Q
from datetime import date

class DiscoverUserListView(generics.ListAPIView):
    serializer_class = DiscoverUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Exclude self and admins
        qs = DefaultUser.objects.filter(is_active=True, is_staff=False).exclude(id=user.id)

        # Sexual orientation matching logic
        user_orientation = user.sexual_orientation or "bisexual"
        user_gender = user.gender

        # Build gender filter based on orientation
        if user_orientation == "bisexual":
            gender_filter = Q()
        elif user_orientation == "male":
            gender_filter = Q(gender="male")
        elif user_orientation == "female":
            gender_filter = Q(gender="female")
        else:
            gender_filter = Q()

        # Users to show must be interested in user's gender (handle bisexuality of other users)
        interested_in_user_gender = Q(
            sexual_orientation="bisexual") | Q(sexual_orientation=user_gender)

        qs = qs.filter(gender_filter).filter(interested_in_user_gender)
        return qs

    def list(self, request, *args, **kwargs):
        # Override to add sorting, filtering, and common tags count
        queryset = self.get_queryset()
        user = request.user
        user_interests = set(user.interests or [])

        # Fetch all candidates
        candidates = list(queryset)

        # Calculate common tags count and distances
        results = []
        for candidate in candidates:
            candidate_interests = set(candidate.interests or [])
            common_tags = len(user_interests.intersection(candidate_interests))

            dist = None
            if user.latitude and user.longitude and candidate.latitude and candidate.longitude:
                dist = haversine(user.longitude, user.latitude, candidate.longitude, candidate.latitude)
            else:
                dist = 9999  # far if no location

            results.append({
                "user": candidate,
                "common_tags": common_tags,
                "distance": dist,
                "age": candidate.age or 0,
                "fame_rating": candidate.fame_rating,
            })

        # Apply filtering (example filters from query params)
        age_min = request.query_params.get("age_min")
        age_max = request.query_params.get("age_max")
        max_distance = request.query_params.get("max_distance")
        min_fame = request.query_params.get("min_fame")
        min_common_tags = request.query_params.get("min_common_tags")

        if age_min:
            results = [r for r in results if r["age"] >= int(age_min)]
        if age_max:
            results = [r for r in results if r["age"] <= int(age_max)]
        if max_distance:
            results = [r for r in results if r["distance"] <= float(max_distance)]
        if min_fame:
            results = [r for r in results if r["fame_rating"] >= float(min_fame)]
        if min_common_tags:
            results = [r for r in results if r["common_tags"] >= int(min_common_tags)]

        # Sorting param
        sort_by = request.query_params.get("sort_by", "distance")  # default sort by distance
        reverse = False

        if sort_by == "age":
            key = lambda x: x["age"]
        elif sort_by == "fame_rating":
            key = lambda x: x["fame_rating"]
            reverse = True
        elif sort_by == "common_tags":
            key = lambda x: x["common_tags"]
            reverse = True
        else:  # distance or default
            key = lambda x: x["distance"]

        results.sort(key=key, reverse=reverse)

        # Paginate manually or return full list for now
        page_size = 20
        page = int(request.query_params.get("page", 1))
        start = (page - 1) * page_size
        end = start + page_size
        paged_results = results[start:end]

        # Serialize only the user objects
        serializer = self.get_serializer(
            [r["user"] for r in paged_results],
            many=True,
            context={"current_user": user}
        )

        # Add common_tags and distance to each serialized item
        data = serializer.data
        for idx, item in enumerate(data):
            item["common_tags"] = paged_results[idx]["common_tags"]
            item["distance"] = round(paged_results[idx]["distance"], 1) if paged_results[idx]["distance"] is not None else None

        return Response({
            "results": data,
            "page": page,
            "page_size": page_size,
            "total": len(results),
        })
