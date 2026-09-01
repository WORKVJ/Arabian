from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BlogCategory, BlogPost
from apps.products.serializers import MediaSerializer, ProductListSerializer
from apps.industries.serializers import IndustrySerializer

User = get_user_model()

class AuthorSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name']

    def get_name(self, obj):
        full_name = obj.get_full_name()
        return full_name if full_name else obj.username

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug', 'description', 'is_active']

class BlogPostListSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    featured_image = MediaSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'category', 'author', 'published_at', 'is_featured', 'no_index',
            'updated_at',
        ]

class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    featured_image = MediaSerializer(read_only=True)
    related_products = ProductListSerializer(many=True, read_only=True)
    related_industries = IndustrySerializer(many=True, read_only=True)
    related_posts = BlogPostListSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'content_blocks', 'featured_image',
            'category', 'author', 'status', 'is_featured', 'published_at', 'created_at', 'updated_at',
            'related_products', 'related_industries', 'related_posts',
            'seo_title', 'seo_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'no_index',
        ]
