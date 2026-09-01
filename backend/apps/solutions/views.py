from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Solution
from .serializers import SolutionSerializer

class SolutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Solution.objects.filter(is_active=True).prefetch_related('related_products', 'related_industries').select_related('image')
    serializer_class = SolutionSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
