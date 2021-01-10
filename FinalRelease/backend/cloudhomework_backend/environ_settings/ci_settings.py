DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'url_shortener',
        'USER': 'root',
        'PASSWORD': 'fourstring',
        'HOST': '127.0.0.1',
        'PORT': 3306,
        'OPTIONS': {
            'charset': 'utf8mb4'
        }
    }
}

REDIS_HOST = '127.0.0.1'

REDIS_PORT = 26379

REDIS_DB = 0

REDIS_HASH_KEY = 'url_shortener'

REDIS_SENTINEL = True

REDIS_SENTINEL_MASTER = 'mymaster'

REDIS_SENTINEL_SOCKS_TIMEOUT = 0.1

ELASTIC_CLOUDID = "url-shortener:YXNpYS1lYXN0MS5nY3AuZWxhc3RpYy1jbG91ZC5jb20kNjlmMThlOWJhZjliNGI2MTk5MmM2MDRkNjNhMWVjZmIkZDk2YzI0N2UyYjlhNGQyYWIwOGNjZTc0ODlkZTA1YTE="

ELASTIC_AUTH = ("elastic", "Jt0T4oY0jq0bzj1Vu1wlwkh0")

LOG_INDEX = "redirector-logs"
