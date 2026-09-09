from rest_framework import viewsets, filters, permissions
from rest_framework.throttling import ScopedRateThrottle
from django_filters.rest_framework import DjangoFilterBackend
from .models import ContactEnquiry, QuoteRequest
from .serializers import ContactEnquirySerializer, QuoteRequestSerializer

class ContactEnquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactEnquiry.objects.all().order_by('-created_at')
    serializer_class = ContactEnquirySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['name', 'company', 'email', 'phone', 'message']
    ordering_fields = ['created_at', 'status']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_throttles(self):
        if self.action == 'create':
            self.throttle_scope = 'enquiries'
            return [ScopedRateThrottle()]
        return []

class QuoteRequestViewSet(viewsets.ModelViewSet):
    queryset = QuoteRequest.objects.all().order_by('-created_at').prefetch_related('attachments')
    serializer_class = QuoteRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'product']
    search_fields = ['name', 'company', 'email', 'phone', 'message', 'project_requirements']
    ordering_fields = ['created_at', 'status']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_throttles(self):
        if self.action == 'create':
            self.throttle_scope = 'enquiries'
            return [ScopedRateThrottle()]
        return []
