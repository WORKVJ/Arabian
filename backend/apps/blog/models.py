from django.db import models
from django.conf import settings
from apps.products.models import SEOBaseModel, Media, Product
from apps.industries.models import Industry

class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Blog Categories"

    def __str__(self):
        return self.name

class BlogPost(SEOBaseModel):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
    )
    title = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, db_index=True)
    excerpt = models.TextField()
    content = models.TextField(help_text="Primary rich text content / HTML body")
    content_blocks = models.JSONField(
        default=list, 
        blank=True, 
        help_text="Structured block layout details for future block editor integration"
    )
    featured_image = models.ForeignKey(Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="blog_posts")
    category = models.ForeignKey(BlogCategory, on_delete=models.PROTECT, related_name="posts")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="blog_posts")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT', db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    published_at = models.DateTimeField(blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    related_products = models.ManyToManyField(Product, related_name="blog_posts", blank=True)
    related_industries = models.ManyToManyField(Industry, related_name="blog_posts", blank=True)
    related_posts = models.ManyToManyField('self', blank=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title
