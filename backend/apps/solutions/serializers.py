from rest_framework import serializers
from .models import Solution
from apps.products.serializers import MediaSerializer, ProductListSerializer
from apps.industries.serializers import IndustrySerializer

class SolutionSerializer(serializers.ModelSerializer):
    image = MediaSerializer(read_only=True)
    related_products = ProductListSerializer(many=True, read_only=True)
    related_industries = IndustrySerializer(many=True, read_only=True)

    class Meta:
        model = Solution
        fields = [
            'id', 'name', 'slug', 'description', 'description_blocks', 'image', 
            'related_products', 'related_industries', 'is_active',
            'seo_title', 'seo_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'no_index'
        ]
