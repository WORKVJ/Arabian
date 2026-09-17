from django.db import models

class PageSEO(models.Model):
    CATEGORY_CHOICES = [
        ('Core Pages', 'Core Pages'),
        ('Products', 'Product Categories & Products'),
        ('Industries', 'Industries'),
        ('Services', 'Services & Solutions'),
        ('Locations', 'GCC & Regional Locations'),
        ('Other', 'Other Pages'),
    ]

    path = models.CharField(
        max_length=255, 
        unique=True, 
        db_index=True, 
        help_text="Exact URL path (e.g. /, /about, /contact, /products/steel-gratings)"
    )
    page_name = models.CharField(
        max_length=150, 
        help_text="Human-readable label for the admin panel (e.g. 'Homepage', 'About Us')"
    )
    category = models.CharField(
        max_length=50, 
        choices=CATEGORY_CHOICES, 
        default='Core Pages',
        db_index=True
    )

    # Search Engine Meta Tags
    meta_title = models.CharField(
        max_length=150, 
        blank=True, 
        help_text="Optimal length: 50-60 characters"
    )
    meta_description = models.TextField(
        blank=True, 
        help_text="Optimal length: 150-160 characters"
    )
    meta_keywords = models.CharField(
        max_length=500, 
        blank=True, 
        help_text="Comma-separated keywords (e.g. steel gratings, frp grating saudi arabia)"
    )
    canonical_url = models.URLField(
        blank=True, 
        null=True, 
        help_text="Leave blank to use default canonical URL"
    )

    # Social Media / Open Graph (WhatsApp, LinkedIn, Twitter)
    og_title = models.CharField(
        max_length=150, 
        blank=True, 
        help_text="Title shown when sharing on WhatsApp/social media"
    )
    og_description = models.TextField(
        blank=True, 
        help_text="Description snippet shown on social media preview cards"
    )
    og_image = models.ForeignKey(
        'products.Media', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='seo_pages',
        help_text="Image displayed in WhatsApp/social media link preview"
    )

    # Robot Control
    no_index = models.BooleanField(
        default=False, 
        help_text="Check this to instruct search engines NOT to index this page (noindex)"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'path']
        verbose_name = 'Page SEO Metadata'
        verbose_name_plural = 'Page SEO Metadata'

    def __str__(self):
        return f"{self.page_name} ({self.path})"
