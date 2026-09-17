from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import PageSEO
from .serializers import PageSEOSerializer, PageSEOAdminSerializer

class PageSEOViewSet(viewsets.ModelViewSet):
    queryset = PageSEO.objects.select_related('og_image').all()
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'no_index']
    search_fields = ['page_name', 'path', 'meta_title', 'meta_description', 'meta_keywords']
    ordering_fields = ['page_name', 'path', 'category', 'updated_at']
    ordering = ['category', 'page_name']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'lookup']:
            # Allow public or read-only listing/lookup
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PageSEOAdminSerializer
        return PageSEOSerializer

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def lookup(self, request):
        """
        Public endpoint for Next.js to fetch SEO metadata by URL path.
        Usage: /api/v1/seo/lookup/?path=/about
        """
        path = request.query_params.get('path', '').strip()
        if not path:
            return Response({'error': 'Path parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Normalize path
        normalized_path = path if path.startswith('/') else f"/{path}"
        # Try exact path first
        seo = PageSEO.objects.filter(path=normalized_path).first()
        if not seo and normalized_path.endswith('/') and len(normalized_path) > 1:
            seo = PageSEO.objects.filter(path=normalized_path.rstrip('/')).first()
        elif not seo and not normalized_path.endswith('/'):
            seo = PageSEO.objects.filter(path=f"{normalized_path}/").first()

        if not seo:
            return Response({'error': f'No custom SEO metadata found for {path}'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PageSEOSerializer(seo)
        return Response(serializer.data)
