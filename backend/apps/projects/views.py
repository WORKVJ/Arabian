import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, permissions
from django.utils.text import slugify
from django.shortcuts import get_object_or_404
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer, ProjectAdminSerializer

class ProjectFilter(django_filters.FilterSet):
    industry = django_filters.CharFilter(field_name='associated_industries__slug')
    product = django_filters.CharFilter(field_name='products_used__slug')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    is_active = django_filters.BooleanFilter(field_name='is_active')

    class Meta:
        model = Project
        fields = ['industry', 'product', 'is_featured', 'is_active']

class ProjectViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProjectFilter
    search_fields = ['title', 'location', 'description']
    ordering_fields = ['project_date', 'created_at', 'title']

    def get_queryset(self):
        qs = Project.objects.prefetch_related(
            'project_images__media', 'products_used', 'associated_industries'
        ).select_related('featured_image')

        user = self.request.user
        if user.is_authenticated and user.is_staff:
            return qs.all()
        return qs.filter(is_active=True)

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
            return ProjectAdminSerializer
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title', '')
        slug = serializer.validated_data.get('slug', '').strip()
        if not slug:
            base_slug = slugify(title)
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
        serializer.save(slug=slug)
