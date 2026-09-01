import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import ProductCategory, Product
from .serializers import (
    ProductCategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    material = django_filters.CharFilter(field_name='material', lookup_expr='icontains')

    class Meta:
        model = Product
        fields = ['category', 'is_featured', 'material']


class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        ProductCategory.objects
        .filter(is_active=True)
        .select_related('image')
        .prefetch_related('products')
    )
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Product.objects
        .filter(is_active=True)
        .select_related('category', 'category__image')
        .prefetch_related(
            'product_images__media',
            'documents',
            'spec_rows',
            'related_products__product_images__media',
            'related_products__category',
        )
    )
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'short_description', 'description', 'material']
    ordering_fields = ['sort_order', 'name', 'created_at']
    ordering = ['sort_order', '-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
