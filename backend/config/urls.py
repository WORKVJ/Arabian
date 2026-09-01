from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'healthy'})

urlpatterns = [
    path('health/', health_check),
    path('secure-admin/', admin.site.urls),
    # API endpoints
    path('api/v1/', include([
        path('products/', include('apps.products.urls')),
        path('industries/', include('apps.industries.urls')),
        path('solutions/', include('apps.solutions.urls')),
        path('services/', include('apps.services.urls')),
        path('projects/', include('apps.projects.urls')),
        path('blog/', include('apps.blog.urls')),
        path('enquiries/', include('apps.enquiries.urls')),
    ])),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
