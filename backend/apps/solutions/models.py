from django.db import models
from apps.products.models import SEOBaseModel, Media, Product
from apps.industries.models import Industry

class Solution(SEOBaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField()
    description_blocks = models.JSONField(default=list, blank=True, help_text="Structured block data for future rich text editors")
    image = models.ForeignKey(Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="solutions")
    related_products = models.ManyToManyField(Product, related_name="solutions", blank=True)
    related_industries = models.ManyToManyField(Industry, related_name="solutions", blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    def __str__(self):
        return self.name
