import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_news(request):
    category = request.GET.get('category', 'general')
    country = request.GET.get('country', 'fr')
    page_size = min(int(request.GET.get('page_size', 20)), 100)
    api_key = settings.NEWS_API_KEY
    
    if not api_key:
        return Response({'error': 'Clé API News non configurée'}, status=500)
    
    url = f'https://newsapi.org/v2/top-headlines?country={country}&category={category}&pageSize={page_size}&apiKey={api_key}'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if data.get('status') != 'ok':
            return Response({'error': data.get('message', 'Erreur inconnue')}, status=400)
        
        articles = []
        for article in data.get('articles', []):
            articles.append({
                'title': article.get('title'),
                'description': article.get('description'),
                'content': article.get('content'),
                'author': article.get('author'),
                'source': article.get('source', {}).get('name'),
                'url': article.get('url'),
                'image_url': article.get('urlToImage'),
                'published_at': article.get('publishedAt'),
            })
        
        return Response({
            'total_results': data.get('totalResults', 0),
            'articles': articles,
            'category': category,
            'country': country
        })
    
    except requests.RequestException as e:
        return Response({'error': f'Erreur de récupération des actualités: {str(e)}'}, status=500)
    except KeyError as e:
        return Response({'error': f'Données d\'actualités incomplètes: {str(e)}'}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_categories(request):
    categories = [
        {'value': 'general', 'label': 'Général'},
        {'value': 'business', 'label': 'Affaires'},
        {'value': 'entertainment', 'label': 'Divertissement'},
        {'value': 'health', 'label': 'Santé'},
        {'value': 'science', 'label': 'Science'},
        {'value': 'sports', 'label': 'Sport'},
        {'value': 'technology', 'label': 'Technologie'},
    ]
    
    return Response({'categories': categories})
