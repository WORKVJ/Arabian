from django.contrib import admin
from django.utils.html import format_html
from .models import Media, ProductImage, ProductSpecification, Document, ProductCategory, Product
from apps.utils_admin import SuperuserOnlyAdmin


# ─────────────────────────────────────────────
# Media
# ─────────────────────────────────────────────

@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ("title", "alt_text", "image_preview", "created_at")
    search_fields = ("title", "alt_text")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.file:
            ext = obj.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                return format_html('<img src="{}" width="80" style="border-radius:4px;" />', obj.file.url)
        return "No Preview"
    image_preview.short_description = "Preview"

