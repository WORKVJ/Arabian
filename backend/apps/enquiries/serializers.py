import os
from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import ContactEnquiry, QuoteRequest, QuoteAttachment

ALLOWED_EXTENSIONS = ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_uploaded_file(file):
    # Validate file size
    if file.size > MAX_FILE_SIZE:
        raise serializers.ValidationError(f"File '{file.name}' exceeds the maximum allowed size of 10MB.")
    
    # Validate extension
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise serializers.ValidationError(
            f"File extension '{ext}' for file '{file.name}' is not allowed. Allowed types are: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return file

class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactEnquiry
        fields = ['id', 'name', 'company', 'email', 'phone', 'message', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def validate_phone(self, value):
        if not value:
            raise serializers.ValidationError("Phone number is required.")
        return value

class QuoteAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteAttachment
        fields = ['id', 'file', 'created_at']

class QuoteRequestSerializer(serializers.ModelSerializer):
    attachments = QuoteAttachmentSerializer(many=True, read_only=True)
    drawing = serializers.FileField(required=False, allow_null=True, validators=[validate_uploaded_file])

    class Meta:
        model = QuoteRequest
        fields = [
            'id', 'name', 'company', 'email', 'phone', 'product', 
            'material', 'quantity', 'dimensions', 'project_requirements', 
            'drawing', 'message', 'status', 'attachments', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        # Extract files from request
        request = self.context.get('request')
        attachments_data = []
        if request and request.FILES:
            files = request.FILES.getlist('attachments')
            # Validate each attachment file
            for file in files:
                validate_uploaded_file(file)
                attachments_data.append(file)
        
        # Create quote request
        quote_request = QuoteRequest.objects.create(**validated_data)
        
        # Create quote attachments
        for attachment_file in attachments_data:
            QuoteAttachment.objects.create(quote_request=quote_request, file=attachment_file)
            
        return quote_request
