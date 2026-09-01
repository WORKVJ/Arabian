from django.contrib import admin
from .models import Project, ProjectImage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "location", "is_featured", "is_active", "project_date")
    list_filter = ("is_featured", "is_active", "project_date")
    search_fields = ("title", "location", "description")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProjectImageInline]
    filter_horizontal = ("associated_industries", "products_used")
