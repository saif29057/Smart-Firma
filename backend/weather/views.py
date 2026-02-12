import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings
import random
from datetime import datetime, timedelta

def get_openmeteo_weather(city):
    """Récupérer les données météo depuis OpenMeteo API (gratuit, sans clé)"""
    try:
        # Géocodage pour obtenir les coordonnées de la ville
        geocoding_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=fr&format=json"
        geo_response = requests.get(geocoding_url)
        geo_response.raise_for_status()
        geo_data = geo_response.json()
        
        if not geo_data.get('results'):
            return None
            
        lat = geo_data['results'][0]['latitude']
        lon = geo_data['results'][0]['longitude']
        city_name = geo_data['results'][0]['name']
        country = geo_data['results'][0].get('country_code', 'FR')
        
        # Météo actuelle
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto"
        weather_response = requests.get(weather_url)
        weather_response.raise_for_status()
        weather_data = weather_response.json()
        
        # Conversion des codes météo OpenMeteo vers descriptions
        weather_codes = {
            0: "ciel dégagé", 1: "principalement dégagé", 2: "partiellement nuageux",
            3: "nuageux", 45: "brouillard", 48: "brouillard givrant",
            51: "bruine légère", 53: "bruine modérée", 55: "bruine dense",
            56: "bruine verglaçante légère", 57: "bruine verglaçante dense",
            61: "pluie légère", 63: "pluie modérée", 65: "pluie forte",
            66: "pluie verglaçante légère", 67: "pluie verglaçante forte",
            71: "neige légère", 73: "neige modérée", 75: "neige forte",
            77: "grains de neige", 80: "averses légères", 81: "averses modérées",
            82: "averses fortes", 85: "averses de neige légères", 86: "averses de neige fortes",
            95: "orage légère", 96: "orage modérée", 99: "orage forte"
        }
        
        # Conversion des codes météo vers icônes (similaire à OpenWeatherMap)
        code_to_icon = {
            0: "01d", 1: "01d", 2: "02d", 3: "03d", 45: "50d", 48: "50d",
            51: "09d", 53: "09d", 55: "09d", 61: "10d", 63: "10d", 65: "10d",
            71: "13d", 73: "13d", 75: "13d", 80: "09d", 81: "09d", 82: "09d",
            95: "11d", 96: "11d", 99: "11d"
        }
        
        current = weather_data['current_weather']
        hourly = weather_data['hourly']
        
        # Trouver l'index de l'heure actuelle
        current_time = datetime.now().strftime('%Y-%m-%dT%H:00')
        current_hour_index = hourly['time'].index(current_time) if current_time in hourly['time'] else 0
        
        weather_code = current['weathercode']
        description = weather_codes.get(weather_code, "inconnu")
        icon = code_to_icon.get(weather_code, "01d")
        
        return {
            'city': city_name,
            'country': country,
            'temperature': current['temperature'],
            'feels_like': current['temperature'],  # OpenMeteo n'a pas de feels_like
            'humidity': hourly['relativehumidity_2m'][current_hour_index],
            'pressure': 1013,  # Valeur par défaut (non fournie par OpenMeteo)
            'description': description,
            'icon': icon,
            'wind_speed': current['windspeed'],
            'wind_direction': current.get('winddirection', 0),
            'visibility': 10,  # Valeur par défaut (non fournie)
            'source': 'OpenMeteo'
        }
        
    except Exception as e:
        print(f"OpenMeteo API Error: {e}")
        return None

def get_openmeteo_forecast(city, days=5):
    """Récupérer les prévisions depuis OpenMeteo API"""
    try:
        # Géocodage pour obtenir les coordonnées
        geocoding_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=fr&format=json"
        geo_response = requests.get(geocoding_url)
        geo_response.raise_for_status()
        geo_data = geo_response.json()
        
        if not geo_data.get('results'):
            return None
            
        lat = geo_data['results'][0]['latitude']
        lon = geo_data['results'][0]['longitude']
        city_name = geo_data['results'][0]['name']
        country = geo_data['results'][0].get('country_code', 'FR')
        
        # Prévisions
        forecast_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m&timezone=auto&forecast_days={days}"
        forecast_response = requests.get(forecast_url)
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()
        
        weather_codes = {
            0: "ciel dégagé", 1: "principalement dégagé", 2: "partiellement nuageux",
            3: "nuageux", 45: "brouillard", 48: "brouillard givrant",
            51: "bruine légère", 53: "bruine modérée", 55: "bruine dense",
            56: "bruine verglaçante légère", 57: "bruine verglaçante dense",
            61: "pluie légère", 63: "pluie modérée", 65: "pluie forte",
            66: "pluie verglaçante légère", 67: "pluie verglaçante forte",
            71: "neige légère", 73: "neige modérée", 75: "neige forte",
            77: "grains de neige", 80: "averses légères", 81: "averses modérées",
            82: "averses fortes", 85: "averses de neige légères", 86: "averses de neige fortes",
            95: "orage légère", 96: "orage modérée", 99: "orage forte"
        }
        
        code_to_icon = {
            0: "01d", 1: "01d", 2: "02d", 3: "03d", 45: "50d", 48: "50d",
            51: "09d", 53: "09d", 55: "09d", 61: "10d", 63: "10d", 65: "10d",
            71: "13d", 73: "13d", 75: "13d", 80: "09d", 81: "09d", 82: "09d",
            95: "11d", 96: "11d", 99: "11d"
        }
        
        daily = forecast_data['daily']
        forecasts = []
        
        for i in range(min(days, len(daily['time']))):
            date = daily['time'][i]
            weather_code = daily['weathercode'][i]
            description = weather_codes.get(weather_code, "inconnu")
            icon = code_to_icon.get(weather_code, "01d")
            
            forecasts.append({
                'date': date,
                'temperature': (daily['temperature_2m_max'][i] + daily['temperature_2m_min'][i]) / 2,
                'min_temp': daily['temperature_2m_min'][i],
                'max_temp': daily['temperature_2m_max'][i],
                'humidity': 65,  # Valeur par défaut
                'description': description,
                'icon': icon,
                'wind_speed': daily['windspeed_10m'][i],
            })
        
        return {
            'city': city_name,
            'country': country,
            'forecasts': forecasts,
            'source': 'OpenMeteo'
        }
        
    except Exception as e:
        print(f"OpenMeteo Forecast Error: {e}")
        return None

def get_mock_weather_data(city):
    """Données météo simulées pour le développement"""
    weather_conditions = [
        {"desc": "ciel dégagé", "icon": "01d"},
        {"desc": "quelques nuages", "icon": "02d"},
        {"desc": "nuageux", "icon": "03d"},
        {"desc": "pluie légère", "icon": "10d"},
        {"desc": "averses", "icon": "09d"}
    ]
    
    condition = random.choice(weather_conditions)
    base_temp = random.uniform(15, 25)
    
    return {
        'city': city,
        'country': 'FR',
        'temperature': round(base_temp, 1),
        'feels_like': round(base_temp + random.uniform(-3, 3), 1),
        'humidity': random.randint(40, 80),
        'pressure': random.randint(1010, 1020),
        'description': condition['desc'],
        'icon': condition['icon'],
        'wind_speed': round(random.uniform(5, 15), 1),
        'wind_direction': random.randint(0, 360),
        'visibility': random.randint(8, 15),
        'mock_data': True  # Indicateur pour les données simulées
    }

def get_mock_forecast_data(city, days=5):
    """Données de prévision simulées"""
    forecasts = []
    base_date = datetime.now()
    
    weather_conditions = [
        {"desc": "ciel dégagé", "icon": "01d"},
        {"desc": "quelques nuages", "icon": "02d"},
        {"desc": "nuageux", "icon": "03d"},
        {"desc": "pluie légère", "icon": "10d"},
        {"desc": "averses", "icon": "09d"}
    ]
    
    for i in range(days):
        date = base_date + timedelta(days=i+1)
        condition = random.choice(weather_conditions)
        base_temp = random.uniform(15, 25)
        
        forecasts.append({
            'date': date.strftime('%Y-%m-%d'),
            'temperature': round(base_temp, 1),
            'min_temp': round(base_temp - random.uniform(3, 8), 1),
            'max_temp': round(base_temp + random.uniform(3, 8), 1),
            'humidity': random.randint(40, 80),
            'description': condition['desc'],
            'icon': condition['icon'],
            'wind_speed': round(random.uniform(5, 15), 1),
        })
    
    return {
        'city': city,
        'country': 'FR',
        'forecasts': forecasts,
        'mock_data': True  # Indicateur pour les données simulées
    }

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_weather(request):
    city = request.GET.get('city', 'Tunis')
    
    # Essayer OpenMeteo d'abord (gratuit, sans clé)
    openmeteo_data = get_openmeteo_weather(city)
    if openmeteo_data:
        return Response(openmeteo_data)
    
    # Essayer OpenWeatherMap si disponible
    api_key = getattr(settings, 'OPENWEATHER_API_KEY', None)
    if api_key:
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=fr'
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            return Response({
                'city': data['name'],
                'country': data['sys']['country'],
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'],
                'icon': data['weather'][0]['icon'],
                'wind_speed': data['wind']['speed'],
                'wind_direction': data['wind'].get('deg', 0),
                'visibility': data.get('visibility', 10000) / 1000,  # Convert to km
                'source': 'OpenWeatherMap'
            })
        
        except requests.RequestException as e:
            print(f"OpenWeatherMap API Error: {e}")
        except KeyError as e:
            print(f"OpenWeatherMap Data Error: {e}")
    
    # Fallback vers données simulées
    mock_data = get_mock_weather_data(city)
    return Response(mock_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def forecast_weather(request):
    city = request.GET.get('city', 'Tunis')
    days = min(int(request.GET.get('days', 5)), 5)  # Limit to 5 days max
    
    # Essayer OpenMeteo d'abord (gratuit, sans clé)
    openmeteo_data = get_openmeteo_forecast(city, days)
    if openmeteo_data:
        return Response(openmeteo_data)
    
    # Essayer OpenWeatherMap si disponible
    api_key = getattr(settings, 'OPENWEATHER_API_KEY', None)
    if api_key:
        url = f'http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric&lang=fr'
        
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Group forecasts by day
            daily_forecasts = {}
            for item in data['list']:
                date = item['dt_txt'].split(' ')[0]
                if date not in daily_forecasts:
                    daily_forecasts[date] = []
                daily_forecasts[date].append(item)
            
            # Get one forecast per day (midday)
            forecast_data = []
            for i, (date, forecasts) in enumerate(daily_forecasts.items()):
                if i >= days:
                    break
                
                # Find midday forecast or first available
                midday_forecast = None
                for forecast in forecasts:
                    if '12:00:00' in forecast['dt_txt']:
                        midday_forecast = forecast
                        break
                if not midday_forecast:
                    midday_forecast = forecasts[0]
                
                forecast_data.append({
                    'date': date,
                    'temperature': midday_forecast['main']['temp'],
                    'min_temp': min(f['main']['temp_min'] for f in forecasts),
                    'max_temp': max(f['main']['temp_max'] for f in forecasts),
                    'humidity': midday_forecast['main']['humidity'],
                    'description': midday_forecast['weather'][0]['description'],
                    'icon': midday_forecast['weather'][0]['icon'],
                    'wind_speed': midday_forecast['wind']['speed'],
                })
            
            return Response({
                'city': data['city']['name'],
                'country': data['city']['country'],
                'forecasts': forecast_data,
                'source': 'OpenWeatherMap'
            })
        
        except requests.RequestException as e:
            print(f"OpenWeatherMap API Error: {e}")
        except KeyError as e:
            print(f"OpenWeatherMap Data Error: {e}")
    
    # Fallback vers données simulées
    mock_data = get_mock_forecast_data(city, days)
    return Response(mock_data)
