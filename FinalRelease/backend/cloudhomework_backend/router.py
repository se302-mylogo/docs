from rest_framework.routers import SimpleRouter, DefaultRouter, DynamicRoute, Route
from rest_framework_nested.routers import NestedMixin


class SingletonViewRouter(DefaultRouter):
    routes = [
        Route(
            url=r'^{prefix}{trailing_slash}$',
            mapping={
                'get': 'retrieve',
                'post': 'create_or_update',
                'put': 'update',
                'patch': 'partial_update',
                'delete': 'destroy'
            },
            name='{basename}-list',
            detail=False,
            initkwargs={'suffix': 'List'}
        ),
        # Dynamically generated list routes. Generated using
        # @action(detail=False) decorator on methods of the viewset.
        DynamicRoute(
            url=r'^{prefix}/{url_path}{trailing_slash}$',
            name='{basename}-{url_name}',
            detail=False,
            initkwargs={}
        )
    ]


class NestedSingletonViewRouter(NestedMixin, SingletonViewRouter):
    pass
