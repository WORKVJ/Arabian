from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from apps.blog.models import BlogCategory, BlogPost

User = get_user_model()

class BlogAPITests(APITestCase):
    def setUp(self):
        # Create user
        self.user = User.objects.create_user(username="author1", password="password123")
        
        # Create category
        self.category = BlogCategory.objects.create(
            name="Technical Guides",
            slug="technical-guides",
            description="Technical engineering guides"
        )
        
        # Create published post
        self.published_post = BlogPost.objects.create(
            title="Choosing the Right Grating",
            slug="choosing-the-right-grating",
            excerpt="Excerpt of post",
            content="Detailed text content",
            category=self.category,
            author=self.user,
            status="PUBLISHED"
        )
        
        # Create draft post
        self.draft_post = BlogPost.objects.create(
            title="Draft Engineering Secrets",
            slug="draft-secrets",
            excerpt="Excerpt of draft",
            content="Detailed draft text",
            category=self.category,
            author=self.user,
            status="DRAFT"
        )

    def test_list_blog_posts(self):
        url = reverse('blog-post-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that only published posts are returned
        self.assertContains(response, "choosing-the-right-grating")
        self.assertNotContains(response, "draft-secrets")

    def test_retrieve_blog_post_detail(self):
        url = reverse('blog-post-detail', kwargs={'slug': 'choosing-the-right-grating'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], "Choosing the Right Grating")

    def test_retrieve_draft_post_returns_404(self):
        url = reverse('blog-post-detail', kwargs={'slug': 'draft-secrets'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_category_filtering(self):
        url = reverse('blog-post-list')
        response = self.client.get(url, {'category': 'technical-guides'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "choosing-the-right-grating")
