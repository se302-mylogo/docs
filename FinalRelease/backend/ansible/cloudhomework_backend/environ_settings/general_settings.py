import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cloudhomework',
        'USER': 'postgres',
        'PASSWORD': 'fourstring',
        'HOST': '127.0.0.1',
        'PORT': 5432,
    }
}

REDIS_HOST = '127.0.0.1'

REDIS_PORT = 26379

REDIS_DB = 0

REDIS_HASH_KEY = 'url_shortener'

REDIS_SENTINEL = True

REDIS_SENTINEL_MASTER = 'mymaster'

REDIS_SENTINEL_SOCKS_TIMEOUT = 0.1

MEDIA_ROOT = f'{BASE_DIR}/medias'

MEDIA_BASE_URL = 'http://localhost:8080/medias'
