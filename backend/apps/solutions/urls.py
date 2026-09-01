from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SolutionViewSet

router = DefaultRouter()
router.register('', SolutionViewSet, basename='solution')

urlpatterns = [
    path('', include(router.urls)),
]
