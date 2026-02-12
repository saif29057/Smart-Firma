from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Message
from .serializers import MessageSerializer, MessageListSerializer
from authentication.models import User

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def inbox(request):
    messages = Message.objects.filter(recipient=request.user)
    serializer = MessageListSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def sent_messages(request):
    messages = Message.objects.filter(sender=request.user)
    serializer = MessageListSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def send_message(request):
    serializer = MessageSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def message_detail(request, message_id):
    message = get_object_or_404(Message, id=message_id)
    
    if message.recipient != request.user and message.sender != request.user:
        return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    
    if message.recipient == request.user:
        message.is_read = True
        message.save()
    
    serializer = MessageSerializer(message)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_message(request, message_id):
    message = get_object_or_404(Message, id=message_id)
    
    if message.recipient != request.user and message.sender != request.user:
        return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    
    message.delete()
    return Response({'message': 'Message supprimé'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def unread_count(request):
    count = Message.objects.filter(recipient=request.user, is_read=False).count()
    return Response({'unread_count': count})
