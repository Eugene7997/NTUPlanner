#!/usr/bin/env bash

# ensure that pip3 is installed in device
pip3 install -r requirements.txt

# creating new django project
django-admin startproject NTUPlanner
cd NTUPlanner/

# creating new django app, and copying the files over
django-admin startapp api
cd api/
rm *.py

# copying files over from NTUPlannerfiles
cp ../../apifiles/*.py .
cd ../NTUPlanner/
rm *.py
cp ../../NTUPlannerfiles/*.py .
cd ../

# migrate the database
python3 manage.py makemigrations
python3 manage.py migrate

cp -r ../scriptfiles/* .
python3 parsers.py
python3 manage.py runserver 0.0.0.0:8000
