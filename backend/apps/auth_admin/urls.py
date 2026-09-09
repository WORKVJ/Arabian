from django.urls import path
from .views import LoginView, CurrentUserView, LogoutView, MediaUploadView, DashboardStatsView

urlpatterns = [
    path('login/', LoginView.as_view(), name='admin_login'),
    path('me/', CurrentUserView.as_view(), name='admin_me'),
    path('logout/', LogoutView.as_view(), name='admin_logout'),
    path('upload/', MediaUploadView.as_view(), name='admin_upload'),
    path('stats/', DashboardStatsView.as_view(), name='admin_stats'),
]
