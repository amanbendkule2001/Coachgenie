#!/usr/bin/env bash

pip install -r requirements.txt

python server/manage.py collectstatic --noinput

python server/manage.py migrate