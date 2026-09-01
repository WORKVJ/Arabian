from django.contrib import admin

class SuperuserOnlyAdmin(admin.ModelAdmin):
    """
    A ModelAdmin base class that restricts access to superusers only.
    Standard staff users (clients) will not see these models in their admin panel.
    """
    def has_module_permission(self, request):
        return request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
