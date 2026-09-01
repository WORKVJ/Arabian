from django.db import models

class ContactEnquiry(models.Model):
    STATUS_CHOICES = (
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('SPAM', 'Spam'),
        ('CLOSED', 'Closed'),
    )
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Contact Enquiries"

    def __str__(self):
        return f"{self.name} - {self.email}"

class QuoteRequest(models.Model):
    STATUS_CHOICES = (
        ('NEW', 'New'),
        ('CONTACTED', 'Contacted'),
        ('QUOTATION_SENT', 'Quotation Sent'),
        ('IN_PROGRESS', 'In Progress'),
        ('CLOSED', 'Closed'),
        ('SPAM', 'Spam'),
    )
    name = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    product = models.CharField(max_length=100)
    material = models.CharField(max_length=100)
    quantity = models.CharField(max_length=50)
    dimensions = models.CharField(max_length=100)
    project_requirements = models.TextField(blank=True)
    drawing = models.FileField(upload_to="quotes/drawings/", blank=True, null=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Quote Requests"

    def __str__(self):
        return f"Quote Request #{self.pk} - {self.company}"

class QuoteAttachment(models.Model):
    quote_request = models.ForeignKey(QuoteRequest, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="quotes/attachments/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
