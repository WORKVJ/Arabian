import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer

class ProjectFilter(django_filters.FilterSet):
    industry = django_filters.CharFilter(field_name='associated_industries__slug')
    product = django_filters.CharFilter(field_name='products_used__slug')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = Project
        fields = ['industry', 'product', 'is_featured']

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.filter(is_active=True).prefetch_related(
        'project_images__media', 'products_used', 'associated_industries'
    ).select_related('featured_image')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProjectFilter
    search_fields = ['title', 'location', 'description']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer
