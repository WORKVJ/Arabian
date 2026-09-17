from rest_framework import serializers
from .models import PageSEO
from apps.products.serializers import MediaSerializer
from apps.products.models import Media

class PageSEOSerializer(serializers.ModelSerializer):
    og_image = MediaSerializer(read_only=True)
    og_image_url = serializers.SerializerMethodField()

    class Meta:
        model = PageSEO
        fields = [
            'id', 'path', 'page_name', 'category',
            'meta_title', 'meta_description', 'meta_keywords', 'canonical_url',
            'og_title', 'og_description', 'og_image', 'og_image_url',
            'no_index', 'created_at', 'updated_at'
        ]

    def get_og_image_url(self, obj):
        if obj.og_image and obj.og_image.file:
            return obj.og_image.file.url
        return None


class PageSEOAdminSerializer(serializers.ModelSerializer):
    og_image_id = serializers.PrimaryKeyRelatedField(
        queryset=Media.objects.all(),
        source='og_image',
        write_only=True,
        required=False,
        allow_null=True
    )
    og_image = MediaSerializer(read_only=True)

    class Meta:
        model = PageSEO
        fields = [
            'id', 'path', 'page_name', 'category',
            'meta_title', 'meta_description', 'meta_keywords', 'canonical_url',
            'og_title', 'og_description', 'og_image', 'og_image_id',
            'no_index', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
