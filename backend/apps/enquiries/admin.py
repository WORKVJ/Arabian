from django.contrib import admin
from .models import ContactEnquiry
from apps.utils_admin import SuperuserOnlyAdmin

@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(SuperuserOnlyAdmin):
    list_display = ("name", "email", "phone", "company", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("name", "email", "phone", "company", "message")
    list_editable = ("status",)
