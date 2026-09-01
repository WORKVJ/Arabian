import tempfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import ContactEnquiry, QuoteRequest

class EnquiriesAPITests(APITestCase):
    def test_contact_submission_valid(self):
        url = reverse('contact-enquiry-list')
        data = {
            'name': 'Saleh Mohammad',
            'company': 'Al Rostamani Group',
            'email': 'saleh@alrostamani.ae',
            'phone': '+971501112223',
            'message': 'Requesting price list for custom floor grids.'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactEnquiry.objects.count(), 1)
        self.assertEqual(ContactEnquiry.objects.first().name, 'Saleh Mohammad')

    def test_contact_submission_invalid(self):
        url = reverse('contact-enquiry-list')
        # Missing required name and phone
        data = {
            'email': 'invalid-email',
            'message': 'No details.'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
        self.assertIn('email', response.data)

    def test_quote_submission_valid_multipart(self):
        url = reverse('quote-request-list')
        
        # Create a mock drawing file
        drawing = SimpleUploadedFile("drawing.dwg", b"dummy drawing content", content_type="image/vnd.dwg")
        attachment1 = SimpleUploadedFile("spec1.pdf", b"pdf content", content_type="application/pdf")
        attachment2 = SimpleUploadedFile("spec2.png", b"png content", content_type="image/png")
        
        data = {
            'name': 'Tariq Habib',
            'company': 'Habib Engineers',
            'email': 'tariq@habib.ae',
            'phone': '+971505554443',
            'product': 'FRP Moulded Gratings',
            'material': 'Polyester Resin',
            'quantity': '200 pieces',
            'dimensions': '1220x3660mm',
            'message': 'Detailed B2B specification request',
            'drawing': drawing,
            'attachments': [attachment1, attachment2]
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(QuoteRequest.objects.count(), 1)
        quote = QuoteRequest.objects.first()
        self.assertEqual(quote.attachments.count(), 2)

    def test_quote_submission_invalid_file_extension(self):
        url = reverse('quote-request-list')
        # Uploading an executable file (.exe) which is not allowed
        invalid_file = SimpleUploadedFile("script.exe", b"malicious code", content_type="application/octet-stream")
        
        data = {
            'name': 'Tariq Habib',
            'company': 'Habib Engineers',
            'email': 'tariq@habib.ae',
            'phone': '+971505554443',
            'product': 'FRP Moulded Gratings',
            'material': 'Polyester Resin',
            'quantity': '200 pieces',
            'dimensions': '1220x3660mm',
            'drawing': invalid_file
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verify that validation error message is returned
        self.assertIn('drawing', response.data)

    def test_quote_submission_oversized_file(self):
        url = reverse('quote-request-list')
        
        # Create a mock drawing file larger than 10MB
        huge_data = b"0" * (10 * 1024 * 1024 + 100)
        oversized_file = SimpleUploadedFile("huge.pdf", huge_data, content_type="application/pdf")
        
        data = {
            'name': 'Tariq Habib',
            'company': 'Habib Engineers',
            'email': 'tariq@habib.ae',
            'phone': '+971505554443',
            'product': 'FRP Moulded Gratings',
            'material': 'Polyester Resin',
            'quantity': '200 pieces',
            'dimensions': '1220x3660mm',
            'drawing': oversized_file
        }
        
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_public_get_enquiries_not_allowed(self):
        url_contact = reverse('contact-enquiry-list')
        url_quote = reverse('quote-request-list')
        
        # Public GET requests must return 405 Method Not Allowed
        response1 = self.client.get(url_contact)
        self.assertEqual(response1.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        response2 = self.client.get(url_quote)
        self.assertEqual(response2.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
