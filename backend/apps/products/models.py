from django.db import models


class SEOBaseModel(models.Model):
    seo_title = models.CharField(max_length=70, blank=True, null=True)
    seo_description = models.CharField(max_length=160, blank=True, null=True)
    canonical_url = models.URLField(blank=True, null=True, help_text="Override auto-generated canonical if required")
    og_title = models.CharField(max_length=70, blank=True, null=True)
    og_description = models.CharField(max_length=160, blank=True, null=True)
    og_image = models.ImageField(upload_to="seo_og/", blank=True, null=True)
    no_index = models.BooleanField(default=False)

    class Meta:
        abstract = True


class Media(models.Model):
    file = models.FileField(upload_to="uploads/%Y/%m/")
    alt_text = models.CharField(max_length=150, blank=True)
    title = models.CharField(max_length=150, blank=True)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Media Library"

    def __str__(self):
        return self.title or self.file.name


class Document(models.Model):
    title = models.CharField(max_length=150)
    file = models.FileField(upload_to="documents/%Y/%m/")
    document_type = models.CharField(max_length=50, help_text="e.g., Catalog, Datasheet, Installation Guide")
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return f"{self.title} ({self.document_type})"


class ProductCategory(SEOBaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    short_description = models.TextField(
        blank=True,
        help_text="Shown on category cards and the products listing page"
    )
    description = models.TextField(blank=True)
    image = models.ForeignKey(Media, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Product Categories"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        return self.products.filter(is_active=True).count()


class Product(SEOBaseModel):
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, db_index=True)
    product_code = models.CharField(
        max_length=50, blank=True,
        help_text="Internal product code or SKU"
    )
    category = models.ForeignKey(
        ProductCategory, on_delete=models.PROTECT, related_name="products"
    )
    short_description = models.TextField(
        help_text="Shown on product cards and hero summary (2–3 sentences)"
    )
    description = models.TextField(
        help_text="Full product overview — shown in the Product Overview section"
    )
    description_blocks = models.JSONField(
        default=list,
        blank=True,
        help_text="Structured block data for block editors (e.g. EditorJS)"
    )
    # Key technical summary fields — shown in the hero spec strip
    material = models.CharField(
        max_length=150, blank=True,
        help_text="Primary material (e.g. Steel, FRP, Aluminium)"
    )
    finish = models.CharField(
        max_length=150, blank=True,
        help_text="Surface finish (e.g. Hot-Dip Galvanized, Painted)"
    )
    standard = models.CharField(
        max_length=200, blank=True,
        help_text="Applicable standards (e.g. EN ISO 1461, BS 4592)"
    )
    # Rich content fields
    applications = models.TextField(
        blank=True,
        help_text="Applications text — can be comma-separated or prose"
    )
    features = models.TextField(
        blank=True,
        help_text="Key features/benefits list — one per line"
    )
    specifications = models.JSONField(
        default=dict,
        blank=True,
        help_text="Technical spec key-value map (legacy / quick entry)"
    )
    # Relations
    documents = models.ManyToManyField(Document, related_name="products", blank=True)
    related_products = models.ManyToManyField(
        "self", blank=True, symmetrical=True,
        help_text="Select up to 4 related products shown at the bottom of the detail page"
    )
    # FAQ stored as JSON: [{"question": "...", "answer": "..."}]
    faq = models.JSONField(
        default=list,
        blank=True,
        help_text='FAQ items: [{"question": "...", "answer": "..."}]'
    )
    meta_keywords = models.CharField(
        max_length=300, blank=True,
        help_text="Comma-separated keywords for SEO reference (not rendered in HTML)"
    )
    # Flags
    is_featured = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_images")
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    alt_text = models.CharField(
        max_length=200, blank=True,
        help_text="Descriptive alt text for SEO — e.g. 'Hot-dip galvanized steel grating installed in UAE industrial facility'"
    )
    caption = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(
        default=False,
        help_text="Mark as the primary/hero image shown first in gallery"
    )

    class Meta:
        ordering = ["-is_primary", "sort_order"]

    def __str__(self):
        return f"{self.product.name} — image {self.sort_order}"


class ProductSpecification(models.Model):
    """Structured specification rows displayed in the Technical Specifications table."""
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="spec_rows"
    )
    name = models.CharField(max_length=100, help_text="Specification label (e.g. 'Bearing Bar Size')")
    value = models.CharField(max_length=255, help_text="Specification value (e.g. '25×3 mm')")
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]
        verbose_name = "Product Specification"
        verbose_name_plural = "Product Specifications"

    def __str__(self):
        return f"{self.product.name} — {self.name}: {self.value}"
