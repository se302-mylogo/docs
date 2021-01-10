import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cloudhomework-db',
        'USER': 'testuser',
        'PASSWORD': 'ZVsW[/hJA?bLjGC+\Isk]G5G',
        'HOST': 'cloudhomework-db',
        'PORT': 5432,
    }
}

REDIS_HOST = 'rfs-redis-cluster'

REDIS_PORT = 26379

REDIS_DB = 0

REDIS_HASH_KEY = 'url_shortener'

REDIS_SENTINEL = True

REDIS_SENTINEL_MASTER = 'mymaster'

REDIS_SENTINEL_SOCKS_TIMEOUT = 0.1

DEBUG = False

CORS_ORIGIN_WHITELIST = [
    "https://fourstring.dev",
    "https://api.fourstring.dev",
    "http://localhost:8000"
]

ALLOWED_HOSTS = ['api.fourstring.dev']

MEDIA_ROOT = f'{BASE_DIR}/medias'

MEDIA_BASE_URL = 'https://api.fourstring.dev/medias'

MIDDLEWARE = [
    'cloudhomework_backend.middlewares.CompatibleMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

SESSION_COOKIE_SAMESITE = 'None'

SESSION_COOKIE_SECURE = True
