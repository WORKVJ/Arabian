from rest_framework import serializers
from .models import Media, Document, ProductCategory, Product, ProductImage, ProductSpecification


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'file', 'alt_text', 'title', 'caption', 'created_at']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'document_type', 'description', 'sort_order', 'is_active']


class ProductCategorySerializer(serializers.ModelSerializer):
    image = MediaSerializer(read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = ProductCategory
        fields = [
            'id', 'name', 'slug', 'short_description', 'description',
            'image', 'is_active', 'sort_order', 'product_count',
            'seo_title', 'seo_description', 'canonical_url',
            'og_title', 'og_description', 'og_image', 'no_index',
        ]

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    media = MediaSerializer(read_only=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'media', 'alt_text', 'caption', 'sort_order', 'is_primary']


class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ['id', 'name', 'value', 'sort_order']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product cards on the listing page."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'product_code',
            'category_name', 'category_slug',
            'short_description', 'material', 'finish', 'standard',
            'applications', 'primary_image',
            'is_featured', 'is_active', 'sort_order', 'created_at',
        ]

    def get_primary_image(self, obj):
        img = obj.product_images.filter(is_primary=True).first() or obj.product_images.first()
        if img:
            return ProductImageSerializer(img).data
        return None


class RelatedProductSerializer(serializers.ModelSerializer):
    """Minimal serializer for related product cards at the bottom of a detail page."""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category_name', 'category_slug',
            'short_description', 'material', 'primary_image',
        ]

    def get_primary_image(self, obj):
        img = obj.product_images.filter(is_primary=True).first() or obj.product_images.first()
        if img:
            return ProductImageSerializer(img).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the product detail page."""
    category = ProductCategorySerializer(read_only=True)
    product_images = ProductImageSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    spec_rows = ProductSpecificationSerializer(many=True, read_only=True)
    related_products = RelatedProductSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'product_code',
            'category',
            'short_description', 'description', 'description_blocks',
            'material', 'finish', 'standard',
            'applications', 'features',
            'specifications', 'spec_rows',
            'faq', 'meta_keywords',
            'product_images', 'documents', 'related_products',
            'is_featured', 'is_active', 'sort_order',
            'created_at', 'updated_at',
            'seo_title', 'seo_description', 'canonical_url',
            'og_title', 'og_description', 'og_image', 'no_index',
        ]
