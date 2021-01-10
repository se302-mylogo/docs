from django.http import Http404
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet, GenericViewSet, ModelViewSet
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.request import Request


class BaseViewSet(ViewSet):
    action_permissions = {}
    request: Request

    # def check_permissions(self, request):
    #     """
    #     Check if the request should be permitted.
    #     Raises an appropriate exception if the request is not permitted.
    #     """
    #     has_permission = False
    #     last_bad_permission = None
    #     for permission in self.get_permissions():
    #         if permission.has_permission(request, self):
    #             has_permission = True
    #             break
    #         else:
    #             last_bad_permission = permission
    #     if not has_permission:
    #         self.permission_denied(
    #             request,
    #             message=getattr(last_bad_permission, 'message', None),
    #             code=getattr(last_bad_permission, 'code', None)
    #         )

    def get_permissions(self):
        """
        利用ViewSet的self.action属性可以得知当前请求触发哪个action进行处理
        由此可以针对不同的action设置不同的权限类
        Superuser应具有API所有权限，因此在基类返回的权限类中注入IsSuperuser，对Superuser无条件放行。
        :return:
        """
        cur_action_perms = self.action_permissions.get(self.action, None)
        base_list = super(BaseViewSet, self).get_permissions()
        if cur_action_perms:
            return [permission() for permission in cur_action_perms] + base_list
        else:
            return base_list


class BaseGenericViewSet(BaseViewSet, GenericViewSet):
    action_serializer_classes = {}

    def get_serializer_class(self):
        """
        利用ViewSet的self.action属性可以得知当前请求触发哪个action进行处理
        由此可以针对不同的action设置不同的serializer。
        :return:
        """
        cur_action_class = self.action_serializer_classes.get(self.action)
        return cur_action_class if cur_action_class else super().get_serializer_class()


class BaseModelViewSet(BaseGenericViewSet, ModelViewSet):
    pass


class BaseSingletonViewSet(
    CreateModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
    BaseGenericViewSet
):
    """
    针对一个API接口只需要维护单一数据的需求的ViewSet。

    单一数据在RESTful实践中也是很常见的，并非所有的RESTful API对于GET /endpoint这样的请求都需要返回多条数据的列表，
    某些情况下一个API接口只需要维护特定的单一数据，例如对于一个特定的用户，其用户资料是唯一的，不存在返回数据列表的需求，
    也不需要/endpoint/{id}这样的模式来访问单个数据，类似地，对于用户资料的更新、删除也应该限制在仅在该单一数据对象上执行。
    对于这样的行为定义，常规RESTful的URL结构显得比较多余，因此我们为这样的数据需求专门定义单例ViewSet(SingletonViewSet)。
    并且我们约定，单例ViewSet的URL prefix使用/cur{name}的形式，cur表示current.

    不妨假设访问当前用户资料的接口为/curprofile，那么该接口的行为如下：
    GET /curprofile 调用retrieve action，若存在满足条件的单例数据则返回，否则返回404
    POST /curprofile 调用create_or_update action，若不存在满足条件的单例数据则创建，否则全量更新
    PUT /curprofile 调用update action，对满足条件的单例数据进行全量更新，若不存在则返回404
    PATCH /curprofile 调用partial_update action，进行增量更新，若不存在则返回404
    DELETE /curprofile 调用destroy action，若存在单例数据，则进行删除。

    需要使用projectpolaris.rest_framework.routers.SingletonViewRouter来生成上述URL结构。
    """

    def perform_get_object(self):
        """
        实际执行获取特定ViewSet所需的单例数据的方法，子类必须实现，如获取当前用户的资料、当前时间班次等。
        请勿在此方法中使用get_object_or_404辅助函数。
        :return: 满足特定ViewSet数据需求的单例数据，不存在则返回None
        """
        raise NotImplementedError('You must implement perform_get_object to return singleton data!')

    def get_object(self):
        """
        调用perform_get_object方法获取单例数据，若不存在则抛出404
        :return:
        """
        obj = self.perform_get_object()
        if not obj:
            raise Http404("Object does not exist!")

        self.check_object_permissions(self.request, obj)
        return obj

    def create_or_update(self, request: Request, *args, **kwargs):
        """
        先调用get_object，若抛出404则捕获并调用create，否则调用update
        可能存在重复数据库查询（update），但并不存在过于严重的性能问题。
        :param request:
        :return:
        """
        try:
            self.get_object()
        except Http404:
            # Hack, to invoke serializer for create
            self.action = 'create'
            return self.create(request)
        else:
            self.action = 'update'
            return self.update(request)
