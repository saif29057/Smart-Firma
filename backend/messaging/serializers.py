from rest_framework import serializers
from .models import Message
from authentication.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    recipient_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Message
        fields = ('id', 'sender', 'recipient', 'recipient_id', 'subject', 'content', 'is_read', 'created_at', 'updated_at')
        read_only_fields = ('id', 'sender', 'is_read', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        recipient_id = validated_data.pop('recipient_id')
        recipient = User.objects.get(id=recipient_id)
        message = Message.objects.create(
            sender=self.context['request'].user,
            recipient=recipient,
            **validated_data
        )
        return message

class MessageListSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    recipient_username = serializers.CharField(source='recipient.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ('id', 'sender_username', 'recipient_username', 'subject', 'is_read', 'created_at')
