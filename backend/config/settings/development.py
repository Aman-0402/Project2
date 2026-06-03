"""Development settings — extends base.py."""
import os
from .base import *  # noqa

# Guard: refuse to load development settings in a production-like environment
_dsm = os.environ.get('DJANGO_SETTINGS_MODULE', '')
if _dsm and not _dsm.endswith('development') and os.environ.get('DJANGO_ENV') != 'development':
    raise RuntimeError(
        f"development.py loaded but DJANGO_SETTINGS_MODULE='{_dsm}'. "
        "Set DJANGO_ENV=development or fix DJANGO_SETTINGS_MODULE."
    )

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Show emails in console during development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable Cloudinary in dev — use local media storage
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

# Allow all CORS origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Detailed logging in development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
