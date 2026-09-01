from django.db import models
from apps.products.models import SEOBaseModel, Media, Product

class Industry(SEOBaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    short_description = models.TextField()
    description = models.TextField()
    description_blocks = models.JSONField(default=list, blank=True, help_text="Structured block data for future rich text editors")
    image = models.ForeignKey(Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="industries")
    applications = models.TextField(blank=True)
    related_products = models.ManyToManyField(Product, related_name="industries", blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        verbose_name_plural = "Industries"
        ordering = ["name"]

    def __str__(self):
        return self.name
