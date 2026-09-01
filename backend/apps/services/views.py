from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Service
from .serializers import ServiceSerializer

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True).select_related('image')
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
