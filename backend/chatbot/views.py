from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
from openai import OpenAI
import json

# Configure OpenAI
client = OpenAI(api_key=settings.OPENAI_API_KEY)

AGRICULTURAL_CONTEXT = """
Tu es un assistant expert en agriculture pour Smart Firma, une plateforme intelligente pour les agriculteurs tunisiens.
Ton domaine d'expertise inclut:
- Les cultures adaptées au climat tunisien (oliviers, céréales, agrumes, légumes, dattes)
- Les pratiques agricoles durables et biologiques
- La gestion de l'irrigation et des ressources en eau
- Les prévisions météorologiques et leur impact sur l'agriculture
- Les maladies des plantes et les traitements biologiques
- Les calendriers de plantation et de récolte
- Les techniques de modernisation agricole
- Les subventions et programmes gouvernementaux agricoles en Tunisie

Sois concis, pratique et donne des conseils spécifiques à l'agriculture tunisienne.
"""

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def chat_with_ai(request):
    try:
        user_message = request.data.get('message', '').strip()
        
        if not user_message:
            return Response(
                {'error': 'Le message ne peut pas être vide'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Utiliser uniquement l'API OpenAI
        messages = [
            {"role": "system", "content": AGRICULTURAL_CONTEXT},
            {"role": "user", "content": user_message}
        ]
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        # Sauvegarder la conversation dans la base de données
        from .models import ChatMessage
        ChatMessage.objects.create(
            user=request.user,
            message=user_message,
            response=ai_response
        )
        
        return Response({
            'response': ai_response,
            'timestamp': ChatMessage.objects.filter(user=request.user).first().created_at if ChatMessage.objects.filter(user=request.user).exists() else None
        })
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors du traitement: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def chat_history(request):
    try:
        from .models import ChatMessage
        messages = ChatMessage.objects.filter(user=request.user)[:50]  # Limiter à 50 derniers messages
        
        history = []
        for msg in messages:
            history.append({
                'id': msg.id,
                'message': msg.message,
                'response': msg.response,
                'created_at': msg.created_at
            })
        
        return Response({'history': history})
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de la récupération de l\'historique: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_chat_history(request):
    try:
        from .models import ChatMessage
        ChatMessage.objects.filter(user=request.user).delete()
        
        return Response({'message': 'Historique de conversation effacé avec succès'})
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de l\'effacement de l\'historique: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
