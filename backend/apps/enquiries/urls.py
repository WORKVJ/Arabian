from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactEnquiryViewSet, QuoteRequestViewSet

router = DefaultRouter()
router.register('contact', ContactEnquiryViewSet, basename='contact-enquiry')
router.register('quote', QuoteRequestViewSet, basename='quote-request')

urlpatterns = [
    path('', include(router.urls)),
]
