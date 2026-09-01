from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, BlogCategoryViewSet

router = DefaultRouter()
router.register('categories', BlogCategoryViewSet, basename='blog-category')
router.register('', BlogPostViewSet, basename='blog-post')

urlpatterns = [
    path('', include(router.urls)),
]
