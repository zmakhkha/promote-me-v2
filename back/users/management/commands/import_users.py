import json
import random
import string
from datetime import date, timedelta
from urllib.parse import urlparse
from django.core.management.base import BaseCommand
from users.models import DefaultUser  # Update this to your actual app name

def extract_social_id(url, platform):
    parsed = urlparse(url)
    path = parsed.path.strip('/')
    domain = parsed.netloc.lower()

    if platform == 'instagram' and 'instagram' in domain:
        return path.split('/')[0]
    elif platform == 'tiktok' and 'tiktok' in domain:
        return path.split('/')[0].lstrip('@')

    return None

def parse_user_data(data):
    name_parts = data['name'].split()
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    gender = 'male' if data['gender'].lower() == 'man' else 'female'
    birth_date = date.today() - timedelta(days=int(data['age']) * 365)
    location = data.get('location', '')
    snapchat = data.get('snapId', '')
    image_link = data.get('fullImageUrl', '')

    social_urls = data.get('socialMediaUrls', [])
    instagram = None
    tiktok = None
    for url in social_urls:
        if 'instagram' in url:
            instagram = extract_social_id(url, 'instagram')
        elif 'tiktok' in url:
            tiktok = extract_social_id(url, 'tiktok')

    return {
        "first_name": first_name,
        "last_name": last_name,
        "gender": gender,
        "birth_date": birth_date,
        "location": location,
        "snapchat": snapchat,
        "instagram": instagram,
        "tiktok": tiktok,
        "image_link": image_link,
    }

def generate_password(length=12):
    while True:
        password = ''.join(random.choices(
            string.ascii_uppercase +
            string.ascii_lowercase +
            string.digits +
            "!@#$%^&*()_-=+[]{};:,.<>?", k=length))
        # Ensure it meets all conditions
        if (any(c.islower() for c in password) and
            any(c.isupper() for c in password) and
            any(c.isdigit() for c in password) and
            any(c in "!@#$%^&*()_-=+[]{};:,.<>?" for c in password)):
            return password

class Command(BaseCommand):
    help = 'Import users from a JSONL file and assign random passwords'

    def add_arguments(self, parser):
        parser.add_argument('jsonl_file', type=str, help='Path to JSONL file')

    def handle(self, *args, **options):
        file_path = options['jsonl_file']
        credentials = []

        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    data = json.loads(line)
                    user_data = parse_user_data(data)
                    username = user_data["first_name"].lower() + user_data["last_name"].lower() + str(user_data["birth_date"].year)

                    if not DefaultUser.objects.filter(username=username).exists():
                        password = generate_password()
                        user = DefaultUser.objects.create(
                            username=username,
                            email=f"{username}@example.com",
                            first_name=user_data["first_name"],
                            last_name=user_data["last_name"],
                            gender=user_data["gender"],
                            birth_date=user_data["birth_date"],
                            location=user_data["location"],
                            snapchat=user_data["snapchat"],
                            instagram=user_data["instagram"],
                            tiktok=user_data["tiktok"],
                            image_link=user_data["image_link"],
                            bio="Imported user",
                            interests=[],
                        )
                        user.set_password(password)
                        user.save()

                        credentials.append({
                            "username": username,
                            "password": password
                        })

                        self.stdout.write(self.style.SUCCESS(f"Created user: {username}"))
                    else:
                        self.stdout.write(self.style.WARNING(f"User {username} already exists"))

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"Error processing line: {e}"))

        # Save all credentials to a file
        with open("created_users.json", "w", encoding="utf-8") as out_file:
            json.dump(credentials, out_file, indent=2)
            self.stdout.write(self.style.SUCCESS("Credentials saved to created_users.json"))
