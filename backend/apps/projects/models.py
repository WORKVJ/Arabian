from django.db import models
from apps.products.models import SEOBaseModel, Media, Product
from apps.industries.models import Industry

class Project(SEOBaseModel):
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, db_index=True)
    location = models.CharField(max_length=150)
    associated_industries = models.ManyToManyField(Industry, related_name="projects", blank=True)
    description = models.TextField()
    description_blocks = models.JSONField(default=list, blank=True, help_text="Structured block data for future rich text editors")
    featured_image = models.ForeignKey(Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="featured_projects")
    products_used = models.ManyToManyField(Product, related_name="projects", blank=True)
    project_date = models.DateField(blank=True, null=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-project_date", "-created_at"]

    def __str__(self):
        return self.title

class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project_images")
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]
