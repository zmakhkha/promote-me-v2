import requests
import random
import faker

# Global configuration
API_URL = "http://localhost:2000/api/v1/register/"
GLOBAL_PASSWORD = "Pass123++"

# Initialize Faker to generate random user data
fake = faker.Faker()

# Function to generate a random user
def generate_random_user(i):
    """Generate a random user data."""
    # username = f"user{i}_{fake.user_name()}"
    username = fake.user_name()
    email = fake.email()
    first_name = fake.first_name()
    last_name = fake.last_name()
    birth_date = fake.date_of_birth(minimum_age=18, maximum_age=50).strftime('%Y-%m-%d')
    gender = random.choice(["Male", "Female"])
    location = fake.city() + ", " + fake.country()
    bio = fake.sentence(nb_words=15)
    interests = random.sample(["Traveling", "Photography", "Cooking", "Movies", "Fitness", "Music", "Art", "Hiking", "Gaming"], 3)
    snapchat = fake.user_name()
    instagram = fake.user_name()
    tiktok = fake.user_name()
    points = random.randint(50, 500)
    likes = random.randint(30, 150)
    views = random.randint(100, 1000)
    status = random.choice([True, False])

    return {
        "username": username,
        "email": email,
        "password": GLOBAL_PASSWORD,
        "first_name": first_name,
        "last_name": last_name,
        "birth_date": birth_date,
        "gender": gender,
        "location": location,
        "bio": bio,
        "interests": interests,
        "status": is_online,
        "snapchat": snapchat,
        "instagram": instagram,
        "tiktok": tiktok,
        "points": points,
        "likes": likes,
        "views": views
    }

def create_user(user_data):
    """Send a POST request to create a user."""
    try:
        response = requests.post(API_URL, json=user_data)
        if response.status_code == 201:
            print(f"✅ User '{user_data['username']}' created successfully.")
        else:
            print(f"❌ Failed to create user '{user_data['username']}'. Status: {response.status_code}")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"🚨 Error creating user '{user_data['username']}': {e}")

if __name__ == "__main__":
    num_users = 10  # Set the number of users you want to create
    for i in range(1, num_users + 1):
        user_data = generate_random_user(i)
        create_user(user_data)
