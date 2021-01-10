import copy
import json
from typing import Union

from django.http import HttpResponse, StreamingHttpResponse


class CompatibleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response: Union[HttpResponse, StreamingHttpResponse] = self.get_response(request)
        if not response.streaming:
            try:
                data = json.loads(response.content)
                transformed_data = {
                    'status': response.status_code,
                    'data': data
                }
                transformed_bytes = json.dumps(transformed_data).encode('utf-8')
                new_response = HttpResponse(transformed_bytes, status=response.status_code)
                _headers = {k: v for k, v in response._headers.items() if k != 'content-length'}
                new_response._headers = {**new_response._headers, **_headers}
                new_response.cookies = response.cookies
                return new_response

            except Exception as e:
                pass

        # Code to be executed for each request/response after
        # the view is called.
        return response
