import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, permissions
from django.utils.text import slugify
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import BlogPost, BlogCategory
from .serializers import (
    BlogCategorySerializer, BlogPostListSerializer, BlogPostDetailSerializer, BlogPostAdminSerializer
)

class BlogPostFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    status = django_filters.CharFilter(field_name='status')
    product = django_filters.CharFilter(field_name='related_products__slug')
    industry = django_filters.CharFilter(field_name='related_industries__slug')

    class Meta:
        model = BlogPost
        fields = ['category', 'is_featured', 'status', 'product', 'industry']


class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    lookup_field = 'slug'

    def get_queryset(self):
        if BlogCategory.objects.count() == 0:
            defaults = [
                {'name': 'Technical Standards', 'slug': 'technical-standards', 'description': 'Industry specifications, deflection limits, and compliance guides.'},
                {'name': 'Material Engineering', 'slug': 'material-engineering', 'description': 'Resin selection, alloy comparisons, and material science deep-dives.'},
                {'name': 'Project Insights', 'slug': 'project-insights', 'description': 'Behind-the-scenes case studies from Arabian Gratings installations.'},
                {'name': 'Company News', 'slug': 'company-news', 'description': 'Corporate updates, expansions, and industry events.'},
            ]
            for d in defaults:
                BlogCategory.objects.get_or_create(slug=d['slug'], defaults={'name': d['name'], 'description': d['description'], 'is_active': True})
        return BlogCategory.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class BlogPostViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = BlogPostFilter
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at', 'title', 'status']

    def get_queryset(self):
        qs = BlogPost.objects.prefetch_related(
            'related_products', 'related_industries', 'related_posts'
        ).select_related('featured_image', 'category', 'author')

        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs.all()
        return qs.filter(status='PUBLISHED')

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        val = self.kwargs.get(lookup_url_kwarg)
        qs = self.get_queryset()
        if val and str(val).isdigit():
            return get_object_or_404(qs, pk=int(val))
        return super().get_object()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BlogPostAdminSerializer
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title', '')
        slug = (serializer.validated_data.get('slug') or '').strip()
        if not slug:
            base_slug = slugify(title)
            slug = base_slug
            counter = 1
            while BlogPost.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

        status_val = serializer.validated_data.get('status', 'DRAFT')
        published_at = serializer.validated_data.get('published_at')
        if status_val == 'PUBLISHED' and not published_at:
            published_at = timezone.now()

        category = serializer.validated_data.get('category')
        if not category:
            category = BlogCategory.objects.first()
            if not category:
                category = BlogCategory.objects.create(
                    name='Technical Standards',
                    slug='technical-standards',
                    description='Industry specifications and technical guides.',
                    is_active=True
                )

        serializer.save(
            author=self.request.user,
            category=category,
            slug=slug,
            published_at=published_at
        )

    def perform_update(self, serializer):
        status_val = serializer.validated_data.get('status')
        published_at = serializer.validated_data.get('published_at')
        instance = self.get_object()
        if status_val == 'PUBLISHED' and not instance.published_at and not published_at:
            serializer.save(published_at=timezone.now())
        else:
            serializer.save()
