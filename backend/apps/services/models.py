from django.db import models
from apps.products.models import SEOBaseModel, Media

class Service(SEOBaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField()
    description_blocks = models.JSONField(default=list, blank=True, help_text="Structured block data for future rich text editors")
    image = models.ForeignKey(Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="services")
    is_active = models.BooleanField(default=True, db_index=True)

    def __str__(self):
        return self.name
