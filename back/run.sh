python manage.py makemigrations
python manage.py migrate
# python manage.py flush --no-input
# python manage.py seed_pg

# daphne -e ssl:2000 back.asgi:application
#daphne -b 0.0.0.0 -p 8000 back.asgi:application

python manage.py runserver 0.0.0.0:2000