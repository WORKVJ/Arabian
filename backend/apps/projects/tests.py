from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.products.models import ProductCategory, Product
from apps.industries.models import Industry
from apps.projects.models import Project

class ProjectsAPITests(APITestCase):
    def setUp(self):
        # Create category
        self.category = ProductCategory.objects.create(name="Steel", slug="steel")
        # Create product
        self.product = Product.objects.create(name="Steel Grating", slug="steel-grating", category=self.category)
        
        # Create industry
        self.industry = Industry.objects.create(name="Oil & Gas", slug="oil-gas", short_description="Desc")
        
        # Create active project
        self.project = Project.objects.create(
            title="Abu Dhabi Oil Refinement",
            slug="abu-dhabi-oil-refinement",
            location="Abu Dhabi",
            description="Grating installation project",
            is_active=True
        )
        self.project.products_used.add(self.product)
        self.project.associated_industries.add(self.industry)

    def test_list_projects(self):
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "abu-dhabi-oil-refinement")

    def test_project_detail(self):
        url = reverse('project-detail', kwargs={'slug': 'abu-dhabi-oil-refinement'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Abu Dhabi Oil Refinement")

    def test_project_filtering(self):
        url = reverse('project-list')
        
        # Filter by product slug
        response = self.client.get(url, {'product': 'steel-grating'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "abu-dhabi-oil-refinement")
        
        # Filter by industry slug
        response = self.client.get(url, {'industry': 'oil-gas'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "abu-dhabi-oil-refinement")
        
        # Filter by non-matching product
        response = self.client.get(url, {'product': 'non-existent'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)
