"""
WSGI config for huxgym project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
from decouple import config
from .settings import *
from django.core.wsgi import get_wsgi_application

if config('DEVELOPMENT'):
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'huxgym.settings.local')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                          'huxgym.settings.production')

application = get_wsgi_application()
