#!/bin/bash
rm -rf server/migrations
rm -rf db.sqlite3
./manage.py makemigrations server
./manage.py migrate
./manage.py createsuperuser
./manage.py runserver
