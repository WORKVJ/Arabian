from rest_framework import serializers
from .models import Industry
from apps.products.serializers import MediaSerializer, ProductListSerializer

class IndustrySerializer(serializers.ModelSerializer):
    image = MediaSerializer(read_only=True)
    related_products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = Industry
        fields = [
            'id', 'name', 'slug', 'short_description', 'description', 'description_blocks', 
            'image', 'applications', 'related_products', 'is_active',
            'seo_title', 'seo_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'no_index'
        ]
