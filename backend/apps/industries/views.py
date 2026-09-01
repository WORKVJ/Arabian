from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Industry
from .serializers import IndustrySerializer

class IndustryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Industry.objects.filter(is_active=True).prefetch_related('related_products').select_related('image')
    serializer_class = IndustrySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        slug_value = self.kwargs[lookup_url_kwarg]
        
        # Try exact match, fallback to replacing underscores with hyphens
        try:
            return queryset.get(slug=slug_value)
        except Industry.DoesNotExist:
            normalized_slug = slug_value.replace('_', '-')
            # If that also fails, let the standard get() throw Http404 exception
            return queryset.get(slug=normalized_slug)
