@echo off
set DJANGO_SETTINGS_MODULE=back.settings
@REM start cmd.exe /K "cd /d C:\Users\zakaria\work\promote-me\back && .\.venv\Scripts\activate && python manage.py migrate && python manage.py runserver"
start cmd.exe /K "cd /d C:\Users\zakaria\work\promote-me\back && .\.venv\Scripts\activate && python manage.py migrate && daphne -p 2000 back.asgi:application"
start cmd.exe /K "cd /d C:\Users\zakaria\work\promote-me\front && npm run dev"
@REM start code "C:\Users\zakaria\work\promote-me"
