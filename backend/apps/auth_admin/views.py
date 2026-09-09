from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from apps.products.models import Media
from apps.enquiries.models import ContactEnquiry, QuoteRequest
from apps.blog.models import BlogPost
from apps.projects.models import Project

User = get_user_model()

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Allow logging in with email as well as username
        if '@' in username:
            try:
                user_obj = User.objects.get(email__iexact=username)
                username = user_obj.username
            except User.DoesNotExist:
                return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'This account has been deactivated.'}, status=status.HTTP_403_FORBIDDEN)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
            }
        })


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully.'})


class MediaUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get('title', file_obj.name)
        alt_text = request.data.get('alt_text', title)

        media = Media.objects.create(file=file_obj, title=title, alt_text=alt_text)
        return Response({
            'id': media.id,
            'file': media.file.url,
            'title': media.title,
            'alt_text': media.alt_text,
        }, status=status.HTTP_201_CREATED)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_enquiries = ContactEnquiry.objects.count()
        unread_enquiries = ContactEnquiry.objects.filter(status='NEW').count()
        total_quotes = QuoteRequest.objects.count()
        unread_quotes = QuoteRequest.objects.filter(status='NEW').count()
        total_blogs = BlogPost.objects.count()
        published_blogs = BlogPost.objects.filter(status='PUBLISHED').count()
        total_projects = Project.objects.count()

        recent_enquiries = [
            {
                'id': e.id,
                'type': 'contact',
                'name': e.name,
                'email': e.email,
                'phone': e.phone,
                'company': e.company,
                'message': e.message[:100],
                'status': e.status,
                'created_at': e.created_at.isoformat(),
            }
            for e in ContactEnquiry.objects.order_by('-created_at')[:5]
        ]

        return Response({
            'stats': {
                'total_enquiries': total_enquiries,
                'unread_enquiries': unread_enquiries,
                'total_quotes': total_quotes,
                'unread_quotes': unread_quotes,
                'total_blogs': total_blogs,
                'published_blogs': published_blogs,
                'total_projects': total_projects,
            },
            'recent_enquiries': recent_enquiries,
        })
