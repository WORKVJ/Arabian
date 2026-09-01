from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from .models import ContactEnquiry, QuoteRequest
from .serializers import ContactEnquirySerializer, QuoteRequestSerializer

class ContactEnquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactEnquiry.objects.all()
    serializer_class = ContactEnquirySerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'enquiries'

class QuoteRequestViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'enquiries'
