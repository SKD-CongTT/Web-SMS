import os
import sys
sys.path.append('../config')
from django.contrib.auth import hashers
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

saved_hash = hashers.make_password('123456')
