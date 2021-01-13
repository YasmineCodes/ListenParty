"""
WSGI config for listen_party project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
from dotenv import load_dotenv
from django.core.wsgi import get_wsgi_application

project_dir = os.path.dirname(os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))))

load_dotenv(os.path.join(project_dir, '.env'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'listen_party.settings')

application = get_wsgi_application()
