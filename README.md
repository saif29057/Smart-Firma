# Smart Firma

Plateforme web intelligente pour la gestion d'entreprise avec React et Django.

## Fonctionnalités

- **Authentification et rôles** : Système d'inscription, connexion avec gestion des rôles Admin/User
- **Tableaux de bord** : Interface différente pour administrateurs et utilisateurs
- **Météo** : Affichage météo en temps réel et prévisions sur 5 jours (OpenWeatherMap API)
- **Chatbot** : Assistant intelligent avec actualités (News API) et messagerie interne
- **Analyse d'images** : Classification d'images avec Deep Learning (TensorFlow/PyTorch)
- **Messagerie interne** : Communication entre utilisateurs et administrateurs

## Architecture

- **Frontend** : React + TypeScript + React Router + Axios
- **Backend** : Django + Django REST Framework + PostgreSQL
- **Authentification** : Token-based avec Django REST Framework
- **APIs externes** : OpenWeatherMap, News API
- **Machine Learning** : TensorFlow/PyTorch pour l'analyse d'images

## Prérequis

- Node.js 16+
- Python 3.11+
- PostgreSQL (optionnel, SQLite par défaut)

## Installation

### Backend

1. Naviguer vers le dossier backend :
```bash
cd smart-firma/backend
```

2. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
```

3. Installer les dépendances :
```bash
pip install -r requirements.txt
```

4. Configurer les variables d'environnement :
```bash
cp .env.example .env
# Éditer .env avec vos clés API et configuration
```

5. Appliquer les migrations :
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Créer un superutilisateur :
```bash
python manage.py createsuperuser
```

7. Démarrer le serveur :
```bash
python manage.py runserver
```

### Frontend

1. Naviguer vers le dossier frontend :
```bash
cd smart-firma/frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Démarrer l'application :
```bash
npm start
```

## Configuration des variables d'environnement

### Backend (.env)

```env
SECRET_KEY=django-insecure-your-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://username:password@localhost:5432/smartfirma
OPENWEATHER_API_KEY=your-openweather-api-key
NEWS_API_KEY=your-news-api-key
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Clés API requises

1. **OpenWeatherMap API** :
   - Créer un compte sur https://openweathermap.org/api
   - Obtenir une clé API gratuite
   - Ajouter la clé dans le fichier .env

2. **News API** :
   - Créer un compte sur https://newsapi.org
   - Obtenir une clé API gratuite
   - Ajouter la clé dans le fichier .env

## Structure du projet

```
smart-firma/
├── backend/                    # Django backend
│   ├── authentication/         # Authentification et gestion des utilisateurs
│   ├── messaging/             # Messagerie interne
│   ├── weather/               # API météo
│   ├── news/                  # API actualités
│   ├── analysis/              # Analyse d'images
│   ├── smartfirma/            # Configuration Django
│   └── requirements.txt       # Dépendances Python
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── pages/            # Pages de l'application
│   │   ├── services/         # Services API
│   │   ├── contexts/         # Contextes React
│   │   └── App.tsx           # Composant principal
│   └── package.json          # Dépendances Node.js
└── README.md                  # Documentation
```

## Utilisation

1. **Inscription** : Créez un compte via le formulaire d'inscription
2. **Connexion** : Connectez-vous avec vos identifiants
3. **Navigation** : Accédez aux différentes fonctionnalités via le menu
4. **Admin** : Le compte `admin` a accès au tableau de bord administrateur

## Fonctionnalités détaillées

### Authentification
- Inscription et validation des utilisateurs
- Connexion sécurisée avec tokens
- Gestion des rôles (Admin/User)
- Profil utilisateur personnalisable

### Tableaux de bord
- **Admin** : Gestion des utilisateurs, statistiques, messagerie
- **User** : Profil personnel, paramètres, messagerie avec admin

### Météo
- Météo actuelle pour n'importe quelle ville
- Prévisions sur 5 jours
- Interface responsive avec icônes

### Chatbot
- Assistant intelligent avec réponses prédéfinies
- Accès aux actualités par catégorie
- Messagerie interne avec les administrateurs

### Analyse d'images
- Upload d'images
- Classification avec Deep Learning
- Historique des analyses
- Résultats détaillés avec scores de confiance

## Déploiement

### Production

1. **Backend** :
   - Configurer PostgreSQL
   - Mettre `DEBUG=False`
   - Configurer les variables d'environnement
   - Utiliser un serveur WSGI (Gunicorn)

2. **Frontend** :
   - Construire l'application : `npm run build`
   - Servir les fichiers statiques avec Nginx ou Apache

## API Documentation

Les endpoints API sont disponibles sous `/api/` :

- `/api/auth/` : Authentification
- `/api/messaging/` : Messagerie
- `/api/weather/` : Météo
- `/api/news/` : Actualités
- `/api/analysis/` : Analyse d'images

## Contributing

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Créer une Pull Request

## License

Ce projet est sous licence MIT.
