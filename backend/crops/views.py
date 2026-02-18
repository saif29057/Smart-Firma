from django.http import JsonResponse
import joblib
import requests
import pandas as pd
from datetime import datetime
from functools import lru_cache

# Chargement du modèle
try:
    model = joblib.load("crop_model_tunisia.pkl")
    print("✅ Modèle ML chargé avec succès")
except Exception as e:
    print(f"❌ Erreur chargement modèle: {e}")
    model = None

# ============================================
# BASE DE DONNÉES SOL - TUNISIE
# ============================================
SOIL_DATABASE = {
    "Tunis": {"N": 80, "P": 35, "K": 55, "ph": 6.8, "type": "Limoneux", "region": "Nord"},
    "Nabeul": {"N": 90, "P": 40, "K": 60, "ph": 6.5, "type": "Sableux", "region": "Nord-Est"},
    "Sfax": {"N": 70, "P": 30, "K": 50, "ph": 6.6, "type": "Argilo-limoneux", "region": "Est"},
    "Gabès": {"N": 65, "P": 28, "K": 45, "ph": 6.4, "type": "Sableux", "region": "Sud-Est"},
    "Kairouan": {"N": 75, "P": 32, "K": 52, "ph": 6.7, "type": "Argileux", "region": "Centre"},
    "Bizerte": {"N": 85, "P": 38, "K": 58, "ph": 6.9, "type": "Limoneux", "region": "Nord"},
    "Gafsa": {"N": 60, "P": 25, "K": 40, "ph": 6.3, "type": "Limoneux", "region": "Sud-Ouest"},
    "Tozeur": {"N": 55, "P": 20, "K": 35, "ph": 6.2, "type": "Sableux", "region": "Sud-Ouest"},
    "Médenine": {"N": 58, "P": 22, "K": 38, "ph": 6.3, "type": "Sableux", "region": "Sud"},
    "Zaghouan": {"N": 82, "P": 36, "K": 54, "ph": 6.8, "type": "Argileux", "region": "Nord-Est"},
    "Siliana": {"N": 78, "P": 34, "K": 53, "ph": 6.7, "type": "Limoneux", "region": "Nord-Ouest"},
    "Kasserine": {"N": 62, "P": 26, "K": 42, "ph": 6.4, "type": "Argilo-limoneux", "region": "Centre-Ouest"},
    "Le Kef": {"N": 76, "P": 33, "K": 51, "ph": 6.6, "type": "Argilo-limoneux", "region": "Nord-Ouest"},
    "Mahdia": {"N": 73, "P": 31, "K": 49, "ph": 6.5, "type": "Limoneux", "region": "Est"},
    "Monastir": {"N": 74, "P": 32, "K": 50, "ph": 6.6, "type": "Sableux", "region": "Est"},
    "Ben Arous": {"N": 81, "P": 36, "K": 56, "ph": 6.8, "type": "Limoneux", "region": "Nord"},
    "Ariana": {"N": 79, "P": 34, "K": 54, "ph": 6.7, "type": "Limoneux", "region": "Nord"},
    "Manouba": {"N": 77, "P": 33, "K": 52, "ph": 6.6, "type": "Argilo-limoneux", "region": "Nord"},
    "Sidi Bouzid": {"N": 68, "P": 29, "K": 48, "ph": 6.5, "type": "Limoneux", "region": "Centre"},
    "Jendouba": {"N": 82, "P": 36, "K": 54, "ph": 6.8, "type": "Argileux", "region": "Nord-Ouest"},
    "Béja": {"N": 79, "P": 34, "K": 52, "ph": 6.7, "type": "Limoneux", "region": "Nord-Ouest"},
    "Tataouine": {"N": 50, "P": 18, "K": 32, "ph": 6.1, "type": "Sableux", "region": "Sud"},
    "Kebili": {"N": 52, "P": 19, "K": 33, "ph": 6.2, "type": "Sableux", "region": "Sud"},
}

# ============================================
# API MÉTÉO CORRIGÉE
# ============================================

@lru_cache(maxsize=128)
def get_coordinates(city):
    """Cache les coordonnées géographiques"""
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=fr&format=json"
        print(f"🔍 Géocodage: {url}")
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if data.get('results'):
            return {
                'lat': data['results'][0]['latitude'],
                'lon': data['results'][0]['longitude'],
                'name': data['results'][0]['name'],
                'country': data['results'][0].get('country', 'Tunisia')
            }
        return None
    except Exception as e:
        print(f"❌ Erreur géocodage: {e}")
        return None

def get_weather_data(city):
    """Récupère météo actuelle et prévisions - VERSION CORRIGÉE"""
    coords = get_coordinates(city)
    if not coords:
        print(f"❌ Coordonnées non trouvées pour: {city}")
        return None
    
    try:
        # CORRECTION: relativehumidity_2m (pas 2cm)
        url = (f"https://api.open-meteo.com/v1/forecast?"
               f"latitude={coords['lat']}&longitude={coords['lon']}"
               f"&current=temperature_2m,relative_humidity_2m,precipitation,weather_code"
               f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum"
               f"&timezone=Africa/Tunis&forecast_days=3")
        
        print(f"🌤️ Appel météo: {url}")
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        current = data['current']
        daily = data['daily']
        
        # Calculer pluviométrie sur 3 jours
        rainfall_3d = sum(daily['precipitation_sum']) if daily.get('precipitation_sum') else 0
        
        result = {
            'temperature': current['temperature_2m'],
            'humidity': current['relative_humidity_2m'],  # CORRECTION ICI
            'rainfall_current': current.get('precipitation', 0),
            'rainfall_forecast_3d': rainfall_3d,
            'weather_code': current['weather_code'],
            'city': coords['name'],
            'coordinates': coords
        }
        
        print(f"✅ Données météo récupérées: {result}")
        return result
        
    except Exception as e:
        print(f"❌ Erreur API météo: {e}")
        import traceback
        traceback.print_exc()
        return None

# ============================================
# CONSEILS DE CULTURE
# ============================================


CROP_ADVICE = {
    'bledur': {
        'nom_ar': 'قمح صلب',
        'saison': 'Hiver (Nov-Déc)',
        'region': 'Centre Tunisie (Kairouan, Sidi Bouzid)',
        'irrigation': 'Pluvial ou 1-2 irrigations d\'appoint',
        'alertes': ['Tunisie = 1er producteur mondial', 'Surveiller rouille noire', 'Récolte Juin'],
        'rendement': '1.5-2.5 tonnes/ha',
        'cycle': '130-160 jours',
        'export': 'Oui - Qualité premium'
    },
    'olive': {
        'nom_ar': 'زيتون',
        'saison': 'Pérenne',
        'region': 'Toute la Tunisie (Nord: huile, Sud: conserve)',
        'irrigation': 'Pluvial ou déficit contrôlé',
        'alertes': ['Mouche de l\'olive (juin-oct)', 'Cycle biennal', 'Récolte Nov-Fev'],
        'rendement': '20-50 kg/arbre',
        'cycle': 'Annuel',
        'export': 'Oui - Huile d\'olive AOC'
    },
    'dattes': {
        'nom_ar': 'تمر',
        'saison': 'Pérenne',
        'region': 'Sud (Tozeur, Kebili, Gabès)',
        'irrigation': 'Oasis - Eau fossile ou Drip',
        'alertes': ['Deglet Nour = reine', 'Bayoudh (maladie fongique)', 'Pollinisation manuelle'],
        'rendement': '50-100 kg/pied',
        'cycle': 'Récolte Sept-Nov',
        'export': 'Oui - Deglet Nour premium'
    },
    'agrumes': {
        'nom_ar': 'حمضيات',
        'saison': 'Pérenne',
        'region': 'Cap Bon (Nabeul)',
        'irrigation': 'Goutte-à-goutte obligatoire',
        'alertes': ['Maladie du dragon (HLB)', 'Clémentines de Tunisie AOC'],
        'rendement': '15-30 tonnes/ha',
        'cycle': 'Récolte Nov-Mars',
        'export': 'Oui - UE principalement'
    },
    'orge': {
        'nom_ar': 'شعير',
        'saison': 'Hiver',
        'region': 'Centre et Nord',
        'irrigation': 'Pluvial',
        'alertes': ['Fourrage ou brasserie', 'Précède blé dur'],
        'rendement': '1.5-2 tonnes/ha',
        'cycle': '110-130 jours',
        'export': 'Non - Auto-consommation'
    },
    'ble_tendre': {
        'nom_ar': 'قحن لين',
        'saison': 'Hiver',
        'region': 'Nord (Béja, Jendouba)',
        'irrigation': 'Pluvial',
        'alertes': ['Pain traditionnel', 'Moins de rendement que dur'],
        'rendement': '2-3 tonnes/ha',
        'cycle': '120-140 jours',
        'export': 'Non'
    },
    'feves': {
        'nom_ar': 'فول',
        'saison': 'Hiver',
        'region': 'Nord et Centre',
        'irrigation': 'Pluvial',
        'alertes': ['Culture de complément', 'Fixe l\'azote'],
        'rendement': '1-1.5 tonnes/ha',
        'cycle': '140-160 jours',
        'export': 'Non'
    },
    'pois_chiche': {
        'nom_ar': 'حمص',
        'saison': 'Hiver',
        'region': 'Centre (Kairouan)',
        'irrigation': 'Pluvial',
        'alertes': ['Couscous traditionnel', 'Très rustique'],
        'rendement': '0.8-1.2 tonnes/ha',
        'cycle': '130-150 jours',
        'export': 'Limité'
    },
    'amandier': {
        'nom_ar': 'لوز',
        'saison': 'Pérenne',
        'region': 'Sud (Sfax, Gabès)',
        'irrigation': 'Déficit contrôlé',
        'alertes': ['Floraison précoce = gel', 'Variétés Atocha, Ferragnès'],
        'rendement': '300-800 kg/ha',
        'cycle': 'Récolte Août-Sept',
        'export': 'En développement'
    },
    'figuier_barbarie': {
        'nom_ar': 'تين شوكي',
        'saison': 'Pérenne',
        'region': 'Sud (résistant à sécheresse)',
        'irrigation': 'Aucune (pluvial <150mm)',
        'alertes': ['Cochenille = danger', 'Fruit du futur pour la sécheresse'],
        'rendement': '10-20 tonnes/ha',
        'cycle': 'Récolte Juillet-Oct',
        'export': 'Oui - Figues de barbarie'
    },
    'pecher': {
        'nom_ar': 'خوخ',
        'saison': 'Pérenne',
        'region': 'Oasis Tozeur (spécialité)',
        'irrigation': 'Goutte-à-goutte',
        'alertes': ['Pêche de Tozeur AOC', 'Très sensible au gel'],
        'rendement': '15-25 tonnes/ha',
        'cycle': 'Récolte Mai-Juin',
        'export': 'Local'
    }
}

def get_crop_advice(crop, weather_data, soil_data):
    """Conseils personnalisés pour la Tunisie"""
    advice = CROP_ADVICE.get(crop, {})
    
    weather_alerts = []
    
    # Alertes météo spécifiques Tunisie
    if weather_data['rainfall_forecast_3d'] > 20:
        weather_alerts.append("🌧️ Pluies rares mais intenses - Risque d'érosion sur sols fragiles")
    elif weather_data['rainfall_forecast_3d'] < 1 and weather_data['temperature'] > 35:
        weather_alerts.append("☀️ Canicule - Irrigation d'urgence si culture estivale")
    
    if weather_data['humidity'] > 75 and weather_data['temperature'] > 25:
        weather_alerts.append("💧 Conditions humides - Risque Oidium (oliviers) ou Fusarium")
    
    # Alertes régionales
    region = soil_data.get('region', '')
    if 'Sud' in region and crop in ['bledur', 'ble_tendre']:
        weather_alerts.append("⚠️ Céréales improbables au Sud sans irrigation - Préférer dattes ou olives")
    
    if 'Nord' in region and crop == 'dattes':
        weather_alerts.append("⚠️ Dattes déconseillées au Nord - Humidité trop élevée pour Deglet Nour")
    
    # Analyse sol tunisien (sols calcaires)
    soil_analysis = []
    if soil_data['ph'] > 8.0:
        soil_analysis.append("⚠️ Sol très calcaire - Vérifier chlorose ferrique (Fe-chelates)")
    if soil_data['N'] < 50:
        soil_analysis.append("💡 Azote faible - Engrais azoté fractionné recommandé")
    if soil_data['K'] < 40 and crop in ['dattes', 'olive']:
        soil_analysis.append("💡 Potassium faible - Important pour qualité fruit")
    
    return {
        'culture': advice,
        'alertes_meteo': weather_alerts,
        'analyse_sol': soil_analysis,
        'conditions_actuelles': {
            'temperature': weather_data['temperature'],
            'humidite': weather_data['humidity'],
            'pluie_prevue_3j': weather_data['rainfall_forecast_3d']
        }
    }

# ============================================
# VUE PRINCIPALE CORRIGÉE
# ============================================

def predict_crop(request):
    """Endpoint principal - Automatique avec option manuelle"""
    print(f"📥 Requête reçue: {request.GET}")
    
    location = request.GET.get("location")
    mode = request.GET.get("mode", "auto")
    
    if not location:
        return JsonResponse({"error": "Localisation requise"}, status=400)
    
    # 1. DONNÉES MÉTÉO
    weather_data = get_weather_data(location)
    
    if not weather_data:
        return JsonResponse({
            "error": "Données météo indisponibles",
            "solution": "Vérifiez l'orthographe ou essayez une ville majeure (Tunis, Sfax, etc.)"
        }, status=503)
    
    # 2. DONNÉES SOL (valeurs par défaut si ville inconnue)
    soil_data = SOIL_DATABASE.get(location, {
        "N": 70, "P": 30, "K": 50, "ph": 6.5, 
        "type": "Standard", "region": "Inconnue"
    })
    
    # 3. MODE MANUEL (surcharge)
    if mode == "manual":
        try:
            soil_data = {
                "N": int(request.GET.get("N", soil_data["N"])),
                "P": int(request.GET.get("P", soil_data["P"])),
                "K": int(request.GET.get("K", soil_data["K"])),
                "ph": float(request.GET.get("ph", soil_data["ph"])),
                "type": request.GET.get("soil_type", soil_data.get("type", "Standard")),
                "region": soil_data.get("region", "Inconnue")
            }
            weather_data['temperature'] = float(request.GET.get("temp", weather_data['temperature']))
            weather_data['humidity'] = int(request.GET.get("humidity", weather_data['humidity']))
        except ValueError as e:
            return JsonResponse({"error": f"Valeur invalide: {e}"}, status=400)
    
    # 4. PRÉDICTION ML
    if model is None:
        return JsonResponse({"error": "Modèle ML non disponible"}, status=503)
    
    try:
        features = pd.DataFrame([{
            "N": soil_data["N"],
            "P": soil_data["P"],
            "K": soil_data["K"],
            "temperature": weather_data['temperature'],
            "humidity": weather_data['humidity'],
            "ph": soil_data["ph"],
            "rainfall": weather_data['rainfall_forecast_3d']
        }])
        
        recommended_crop = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        confidence = max(probabilities) * 100
        
        # Top alternatives
        crop_classes = model.classes_
        top_indices = probabilities.argsort()[-3:][::-1]
        alternatives = [
            {"culture": crop_classes[i], "confiance": round(probabilities[i] * 100, 1)}
            for i in top_indices if crop_classes[i] != recommended_crop
        ][:2]
        
        print(f"✅ Prédiction: {recommended_crop} ({confidence:.1f}%)")
        
    except Exception as e:
        print(f"❌ Erreur prédiction: {e}")
        return JsonResponse({"error": f"Erreur prédiction: {str(e)}"}, status=500)
    
    # 5. CONSEILS
    advice = get_crop_advice(recommended_crop, weather_data, soil_data)
    
    # 6. RÉPONSE
    response_data = {
        "recommandation": {
            "culture": recommended_crop,
            "confiance": round(confidence, 1),
            "alternatives": alternatives
        },
        "donnees_auto": {
            "localisation": {
                "ville": weather_data['city'],
                "coordonnees": weather_data['coordinates']
            },
            "meteo": {
                "temperature": weather_data['temperature'],
                "humidite": weather_data['humidity'],
                "pluie_3jours": weather_data['rainfall_forecast_3d']
            },
            "sol": soil_data
        },
        "conseils": advice,
        "mode": mode,
        "timestamp": datetime.now().isoformat()
    }
    
    return JsonResponse(response_data)

def get_locations(request):
    """Liste les villes disponibles"""
    return JsonResponse({
        "villes": list(SOIL_DATABASE.keys()),
        "total": len(SOIL_DATABASE),
        "regions": list(set(s["region"] for s in SOIL_DATABASE.values()))
    })