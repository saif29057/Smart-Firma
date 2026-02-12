from rest_framework import serializers
from .models import AnalysisLog

class AnalysisLogSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(source='image', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = AnalysisLog
        fields = ('id', 'user', 'user_username', 'image', 'image_url', 'result', 'confidence', 'processing_time', 'created_at')
        read_only_fields = ('id', 'user', 'user_username', 'confidence', 'processing_time', 'created_at')
