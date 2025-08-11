import os
import django
from faker import Faker
from random import choice, randint, uniform
from datetime import date

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")  
django.setup()

from users.models import DefaultUser 

fake = Faker()

DEFAULT_SPECS = {
    "height": "180cm",
    "religion": "none",
    "smoke": "no",
    "drink": "yes"
}

def create_dummy_users():
    try:
        for i in range(5):
            username = fake.user_name()
            email = fake.unique.email()

            user, created = DefaultUser.objects.get_or_create(
                username=username,
                defaults={
                    "first_name": fake.first_name(),
                    "last_name": fake.last_name(),
                    "email": email,
                    "birth_date": fake.date_of_birth(minimum_age=20, maximum_age=40),
                    "gender": choice(["male", "female"]),
                    "sexual_orientation": choice(["male", "female", "bisexual"]),
                    "bio": fake.sentence(nb_words=12),
                    "interests": fake.words(nb=5),
                    "specs": DEFAULT_SPECS,
                    "looking_for": choice([["friendship"], ["dating"], ["long term", "friendship"]]),
                    "favorite_thing": fake.word(),
                    "causes": choice([["environment"], ["animal rights"], ["equality"]]),
                    "boundary": fake.sentence(nb_words=6),
                    "location": fake.city(),
                    "latitude": round(uniform(-90, 90), 6),
                    "longitude": round(uniform(-180, 180), 6),
                    "points": randint(0, 100),
                    "likes": randint(0, 50),
                    "views": randint(0, 200),
                    "is_verified": choice([True, False]),
                    "is_discoverable": True,
                    "snapchat": f"{username}_snap",
                    "instagram": f"{username}_insta",
                    "tiktok": f"{username}_tok"
                }
            )

            if created:
                user.set_password("MKSzak123")
                user.save()
                print(f"✅ Created dummy user: {username}")
            else:
                print(f"⚠ User already exists: {username}")

    except Exception as e:
        print(f"❌ Error while creating dummy users: {e}")
        exit()

if __name__ == "__main__":
    create_dummy_users()
