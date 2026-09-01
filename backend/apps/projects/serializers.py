from rest_framework import serializers
from .models import Project, ProjectImage
from apps.products.serializers import MediaSerializer, ProductListSerializer
from apps.industries.serializers import IndustrySerializer

class ProjectImageSerializer(serializers.ModelSerializer):
    media = MediaSerializer(read_only=True)

    class Meta:
        model = ProjectImage
        fields = ['id', 'media', 'sort_order']

class ProjectListSerializer(serializers.ModelSerializer):
    featured_image = MediaSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'location', 'featured_image', 
            'project_date', 'is_featured', 'is_active', 'created_at'
        ]

class ProjectDetailSerializer(serializers.ModelSerializer):
    featured_image = MediaSerializer(read_only=True)
    project_images = ProjectImageSerializer(many=True, read_only=True)
    products_used = ProductListSerializer(many=True, read_only=True)
    associated_industries = IndustrySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'location', 'associated_industries', 'description', 'description_blocks',
            'featured_image', 'project_images', 'products_used', 'project_date', 'is_featured', 'is_active',
            'created_at', 'updated_at', 'seo_title', 'seo_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'no_index'
        ]
class ProjectImageDetailSerializer(serializers.ModelSerializer):
    media = MediaSerializer(read_only=True)
    class Meta:
        model = ProjectImage
        fields = ['id', 'media', 'sort_order']
