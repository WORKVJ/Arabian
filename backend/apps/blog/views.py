import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import BlogPost, BlogCategory
from .serializers import (
    BlogCategorySerializer, BlogPostListSerializer, BlogPostDetailSerializer
)

class BlogPostFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    product = django_filters.CharFilter(field_name='related_products__slug')
    industry = django_filters.CharFilter(field_name='related_industries__slug')

    class Meta:
        model = BlogPost
        fields = ['category', 'is_featured', 'product', 'industry']


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.filter(is_active=True)
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(status='PUBLISHED').prefetch_related(
        'related_products', 'related_industries', 'related_posts'
    ).select_related('featured_image', 'category', 'author')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = BlogPostFilter
    search_fields = ['title', 'excerpt', 'content']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer
