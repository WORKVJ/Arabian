from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.products.models import ProductCategory, Product, Media

class ProductsAPITests(APITestCase):
    def setUp(self):
        # Create media
        self.media = Media.objects.create(
            file="uploads/test.jpg",
            title="Test Image",
            alt_text="Test Alt Text"
        )
        
        # Create active category
        self.category = ProductCategory.objects.create(
            name="FRP Gratings",
            slug="frp-gratings",
            description="FRP description",
            image=self.media,
            is_active=True
        )
        
        # Create active product
        self.active_product = Product.objects.create(
            name="Moulded FRP Grating",
            slug="moulded-frp-grating",
            category=self.category,
            short_description="Short spec description",
            description="Detailed specifications",
            is_active=True
        )
        
        # Create inactive product
        self.inactive_product = Product.objects.create(
            name="Inactive Grating",
            slug="inactive-grating",
            category=self.category,
            short_description="Short spec description",
            description="Detailed specifications",
            is_active=False
        )

    def test_list_products(self):
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that count is correct and only active is returned
        self.assertContains(response, "moulded-frp-grating")
        self.assertNotContains(response, "inactive-grating")

    def test_retrieve_product_detail(self):
        url = reverse('product-detail', kwargs={'slug': 'moulded-frp-grating'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Moulded FRP Grating")

    def test_retrieve_inactive_product_returns_404(self):
        url = reverse('product-detail', kwargs={'slug': 'inactive-grating'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_category_filtering(self):
        url = reverse('product-list')
        
        # Test valid filtering
        response = self.client.get(url, {'category': 'frp-gratings'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "moulded-frp-grating")
        
        # Test empty filtering for non-existing category
        response = self.client.get(url, {'category': 'steel-gratings'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
