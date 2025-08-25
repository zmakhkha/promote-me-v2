
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from faker import Faker
import random
from datetime import date, timedelta
import requests
from io import BytesIO
from PIL import Image
import os

# Import your models
from users.models import DefaultUser, UserInteraction, ProfileView  # Replace 'your_app' with your actual app name

User = get_user_model()
fake = Faker()

class Command(BaseCommand):
    help = 'Generate 100 dummy users with realistic data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=100,
            help='Number of users to create (default: 100)'
        )
        parser.add_argument(
            '--with-images',
            action='store_true',
            help='Download and set profile images from random photo service'
        )

    def handle(self, *args, **options):
        count = options['count']
        with_images = options['with_images']
        
        self.stdout.write(f'Creating {count} dummy users...')
        
        # Sample data for realistic profiles
        interests_pool = [
            'travel', 'photography', 'cooking', 'fitness', 'reading', 'music',
            'dancing', 'hiking', 'gaming', 'art', 'movies', 'sports', 'yoga',
            'meditation', 'writing', 'volunteering', 'pets', 'technology',
            'fashion', 'food', 'wine', 'coffee', 'beach', 'mountains',
            'concerts', 'theater', 'museums', 'adventure', 'nature', 'cycling'
        ]
        
        causes_pool = [
            'environment', 'animal rights', 'education', 'poverty', 'healthcare',
            'human rights', 'climate change', 'mental health', 'social justice',
            'community development', 'arts', 'technology access', 'food security',
            'homelessness', 'veterans', 'children', 'elderly care'
        ]
        
        looking_for_pool = [
            'serious relationship', 'casual dating', 'friendship', 'networking',
            'travel companion', 'activity partner', 'long-term commitment',
            'someone to explore the city with', 'intellectual conversations',
            'shared adventures', 'meaningful connection'
        ]
        
        favorite_things = [
            'sunset walks on the beach', 'cozy coffee shop mornings', 'live music venues',
            'trying new restaurants', 'weekend hiking trails', 'movie marathons',
            'cooking experiments', 'bookstore browsing', 'art gallery visits',
            'spontaneous road trips', 'farmers market adventures', 'craft beer tastings'
        ]
        
        boundaries = [
            'Respect personal space', 'Open communication is key', 'No drama please',
            'Looking for genuine connections', 'Honesty above all', 'Let\'s take things slow',
            'Family oriented', 'Career focused', 'Adventure seeker', 'Homebody at heart'
        ]
        
        # Cities with coordinates for realistic location data
        cities = [
            {'name': 'New York, NY', 'lat': 40.7128, 'lng': -74.0060},
            {'name': 'Los Angeles, CA', 'lat': 34.0522, 'lng': -118.2437},
            {'name': 'Chicago, IL', 'lat': 41.8781, 'lng': -87.6298},
            {'name': 'Houston, TX', 'lat': 29.7604, 'lng': -95.3698},
            {'name': 'Phoenix, AZ', 'lat': 33.4484, 'lng': -112.0740},
            {'name': 'Philadelphia, PA', 'lat': 39.9526, 'lng': -75.1652},
            {'name': 'San Antonio, TX', 'lat': 29.4241, 'lng': -98.4936},
            {'name': 'San Diego, CA', 'lat': 32.7157, 'lng': -117.1611},
            {'name': 'Dallas, TX', 'lat': 32.7767, 'lng': -96.7970},
            {'name': 'San Jose, CA', 'lat': 37.3382, 'lng': -121.8863},
            {'name': 'Austin, TX', 'lat': 30.2672, 'lng': -97.7431},
            {'name': 'Jacksonville, FL', 'lat': 30.3322, 'lng': -81.6557},
            {'name': 'Fort Worth, TX', 'lat': 32.7555, 'lng': -97.3308},
            {'name': 'Columbus, OH', 'lat': 39.9612, 'lng': -82.9988},
            {'name': 'San Francisco, CA', 'lat': 37.7749, 'lng': -122.4194},
            {'name': 'Charlotte, NC', 'lat': 35.2271, 'lng': -80.8431},
            {'name': 'Indianapolis, IN', 'lat': 39.7684, 'lng': -86.1581},
            {'name': 'Seattle, WA', 'lat': 47.6062, 'lng': -122.3321},
            {'name': 'Denver, CO', 'lat': 39.7392, 'lng': -104.9903},
            {'name': 'Boston, MA', 'lat': 42.3601, 'lng': -71.0589}
        ]

        created_users = []
        
        for i in range(count):
            try:
                # Generate basic info
                gender = random.choice(['male', 'female'])
                first_name = fake.first_name_male() if gender == 'male' else fake.first_name_female()
                last_name = fake.last_name()
                
                # Create unique username and email
                username = f"{first_name.lower()}{last_name.lower()}{random.randint(100, 9999)}"
                email = f"{username}@{fake.free_email_domain()}"
                
                # Generate birth date (18-65 years old)
                birth_date = fake.date_of_birth(minimum_age=18, maximum_age=65)
                
                # Random location
                city = random.choice(cities)
                
                # Add some randomness to coordinates (within ~50km radius)
                lat_offset = random.uniform(-0.5, 0.5)
                lng_offset = random.uniform(-0.5, 0.5)
                
                # Generate realistic profile data
                user_interests = random.sample(interests_pool, random.randint(3, 8))
                user_causes = random.sample(causes_pool, random.randint(1, 4))
                user_looking_for = random.sample(looking_for_pool, random.randint(1, 3))
                
                # Generate specs
                specs = {
                    "height": f"{random.randint(150, 200)}cm",
                    "religion": random.choice(['Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Atheist', 'Agnostic', 'Other', '']),
                    "smoke": random.choice(['Never', 'Occasionally', 'Regularly', 'Trying to quit', '']),
                    "drink": random.choice(['Never', 'Socially', 'Regularly', 'Occasionally', ''])
                }
                
                # Create user
                user = DefaultUser.objects.create_user(
                    username=username,
                    email=email,
                    password='testpass123',  # You can change this default password
                    first_name=first_name,
                    last_name=last_name,
                    birth_date=birth_date,
                    gender=gender,
                    sexual_orientation=random.choice(['male', 'female', 'bisexual']),
                    bio=fake.text(max_nb_chars=300),
                    interests=user_interests,
                    specs=specs,
                    looking_for=user_looking_for,
                    favorite_thing=random.choice(favorite_things),
                    causes=user_causes,
                    boundary=random.choice(boundaries),
                    location=city['name'],
                    latitude=city['lat'] + lat_offset,
                    longitude=city['lng'] + lng_offset,
                    points=random.randint(0, 1000),
                    likes=random.randint(0, 500),
                    views=random.randint(0, 2000),
                    is_verified=random.choice([True, False]) if random.random() < 0.3 else False,
                    is_discoverable=random.choice([True, False]) if random.random() < 0.8 else True,
                    status=random.choice([
                        DefaultUser.STATUS_ONLINE,
                        DefaultUser.STATUS_OFFLINE,
                        DefaultUser.STATUS_IDLE,
                        DefaultUser.STATUS_CHAT
                    ]),
                    snapchat=f"{username}_snap" if random.random() < 0.4 else '',
                    instagram=f"{username}_insta" if random.random() < 0.6 else '',
                    tiktok=f"@{username}_tiktok" if random.random() < 0.3 else '',
                )
                
                # Download and set profile image if requested
                if with_images:
                    try:
                        # Using picsum.photos for random images
                        img_url = f"https://picsum.photos/400/600?random={i}"
                        response = requests.get(img_url, timeout=10)
                        if response.status_code == 200:
                            img = Image.open(BytesIO(response.content))
                            img_io = BytesIO()
                            img.save(img_io, format='JPEG', quality=85)
                            img_content = ContentFile(img_io.getvalue())
                            user.image_profile.save(
                                f"profile_{user.id}.jpg",
                                img_content,
                                save=True
                            )
                    except Exception as e:
                        self.stdout.write(f"Failed to download image for user {username}: {e}")
                
                created_users.append(user)
                
                if (i + 1) % 10 == 0:
                    self.stdout.write(f"Created {i + 1} users...")
                    
            except Exception as e:
                self.stdout.write(f"Error creating user {i + 1}: {e}")
                continue
        
        self.stdout.write(f"Successfully created {len(created_users)} users!")
        
        # Generate some random interactions
        if len(created_users) > 1:
            self.stdout.write("Generating random user interactions...")
            
            for _ in range(min(500, len(created_users) * 5)):  # Generate up to 500 interactions
                try:
                    from_user = random.choice(created_users)
                    to_user = random.choice(created_users)
                    
                    if from_user != to_user:  # Don't let users interact with themselves
                        action = random.choice(['like', 'dislike'])
                        UserInteraction.objects.get_or_create(
                            from_user=from_user,
                            to_user=to_user,
                            defaults={'action': action}
                        )
                except Exception as e:
                    continue
            
            # Generate some profile views
            self.stdout.write("Generating profile views...")
            for _ in range(min(1000, len(created_users) * 10)):
                try:
                    viewer = random.choice(created_users)
                    viewed = random.choice(created_users)
                    
                    if viewer != viewed:
                        # Random date within last 30 days
                        view_date = fake.date_between(start_date='-30d', end_date='today')
                        ProfileView.objects.get_or_create(
                            viewer=viewer,
                            viewed=viewed,
                            date=view_date
                        )
                except Exception as e:
                    continue
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully generated {len(created_users)} dummy users with realistic data!'
            )
        )
        
        # Print some statistics
        total_interactions = UserInteraction.objects.count()
        total_views = ProfileView.objects.count()
        verified_count = DefaultUser.objects.filter(is_verified=True).count()
        
        self.stdout.write(f"Statistics:")
        self.stdout.write(f"- Total users: {DefaultUser.objects.count()}")
        self.stdout.write(f"- Verified users: {verified_count}")
        self.stdout.write(f"- Total interactions: {total_interactions}")
        self.stdout.write(f"- Total profile views: {total_views}")