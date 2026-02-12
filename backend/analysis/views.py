import time
import numpy as np
from PIL import Image
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import AnalysisLog
from .serializers import AnalysisLogSerializer

# Mock model for demonstration (replace with actual model)
def load_model():
    """Load the deep learning model"""
    # This is a mock implementation
    # In production, load your actual TensorFlow/PyTorch model here
    return None

def preprocess_image(image_path):
    """Preprocess image for model input"""
    try:
        image = Image.open(image_path)
        # Resize to standard size (e.g., 224x224 for many models)
        image = image.resize((224, 224))
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        return image_array
    except Exception as e:
        raise Exception(f"Erreur de prétraitement de l'image: {str(e)}")

def predict_image(image_array, model):
    """Make prediction using the model"""
    # This is a mock implementation
    # In production, use your actual model for prediction
    
    # Simulate processing time
    time.sleep(0.5)
    
    # Mock prediction results
    classes = ['chat', 'chien', 'oiseau', 'voiture', 'personne', 'arbre', 'maison', 'fleur']
    probabilities = np.random.dirichlet(np.ones(len(classes)))
    
    # Get top 3 predictions
    top_indices = np.argsort(probabilities)[-3:][::-1]
    
    predictions = []
    for i, idx in enumerate(top_indices):
        predictions.append({
            'class': classes[idx],
            'confidence': float(probabilities[idx]),
            'rank': i + 1
        })
    
    return predictions

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    if 'image' not in request.FILES:
        return Response({'error': 'Aucune image fournie'}, status=status.HTTP_400_BAD_REQUEST)
    
    image_file = request.FILES['image']
    
    # Validate file type
    if not image_file.content_type.startswith('image/'):
        return Response({'error': 'Le fichier doit être une image'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate file size (max 10MB)
    if image_file.size > 10 * 1024 * 1024:
        return Response({'error': 'L\'image ne doit pas dépasser 10MB'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        start_time = time.time()
        
        # Save the image
        analysis = AnalysisLog.objects.create(
            user=request.user,
            image=image_file,
            result={},
            confidence=0.0,
            processing_time=0.0
        )
        
        # Preprocess the image
        image_array = preprocess_image(analysis.image.path)
        
        # Load model and make prediction
        model = load_model()
        predictions = predict_image(image_array, model)
        
        # Calculate overall confidence (average of top 3)
        overall_confidence = sum(pred['confidence'] for pred in predictions[:3]) / 3
        
        # Update analysis with results
        analysis.result = {
            'predictions': predictions,
            'top_prediction': predictions[0] if predictions else None
        }
        analysis.confidence = overall_confidence
        analysis.processing_time = time.time() - start_time
        analysis.save()
        
        serializer = AnalysisLogSerializer(analysis)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        # Clean up on error
        if 'analysis' in locals():
            analysis.delete()
        return Response({'error': f'Erreur lors de l\'analyse: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analysis_history(request):
    analyses = AnalysisLog.objects.filter(user=request.user)
    serializer = AnalysisLogSerializer(analyses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analysis_detail(request, analysis_id):
    analysis = get_object_or_404(AnalysisLog, id=analysis_id)
    
    if analysis.user != request.user and not request.user.is_staff:
        return Response({'error': 'Accès non autorisé'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = AnalysisLogSerializer(analysis)
    return Response(serializer.data)
