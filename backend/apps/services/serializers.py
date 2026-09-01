from rest_framework import serializers
from .models import Service
from apps.products.serializers import MediaSerializer

class ServiceSerializer(serializers.ModelSerializer):
    image = MediaSerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'description', 'description_blocks', 'image', 'is_active',
            'seo_title', 'seo_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'no_index'
        ]
