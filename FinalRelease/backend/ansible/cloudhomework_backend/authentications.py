from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication as SimpleJWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.authentication import SessionAuthentication


class JWTAuthentication(SimpleJWTAuthentication):
    def authenticate(self, request: Request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token: AccessToken = self.get_validated_token(raw_token)

        return (None, validated_token)

    def authenticate_header(self, request):
        return None


class NonCSRFSessionAuthentication(SessionAuthentication):
    def authenticate(self, request):
        """
        Returns a `User` if the request session currently has a logged in user.
        Otherwise returns `None`.
        """

        # Get the session-based user from the underlying HttpRequest object
        user = getattr(request._request, 'user', None)

        if not user or not user.is_active:
            return None

        return (user, None)