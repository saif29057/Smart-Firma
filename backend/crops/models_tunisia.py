import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

def generate_tunisia_crop_dataset():
    """
    Dataset réaliste basé sur les zones agro-écologiques tunisiennes
    Sources: INRAT, FAO, zones agro-écologiques tunisiennes
    """
    np.random.seed(42)
    data = []
    
    # ==========================================
    # ZONE NORD (Humide/sub-humide) >400mm/an
    # Béja, Jendouba, Bizerte, Nabeul, Cap Bon
    # ==========================================
    
    # OLIVIERS (Nord - Chemlali, Chetoui)
    for _ in range(200):
        data.append([
            np.random.randint(55, 75),      # N
            np.random.randint(40, 55),      # P
            np.random.randint(75, 95),      # K
            np.random.uniform(16, 22),      # Temp °C
            np.random.uniform(65, 80),      # Humidity %
            np.random.uniform(7.2, 8.2),    # pH (calcaire)
            np.random.uniform(450, 700),    # Rainfall mm
            "olive"                         # LABEL TUNISIEN
        ])
    
    # AGRUMES (Cap Bon - clémentines, oranges)
    for _ in range(150):
        data.append([
            np.random.randint(65, 85),
            np.random.randint(45, 60),
            np.random.randint(80, 100),
            np.random.uniform(18, 25),
            np.random.uniform(70, 85),
            np.random.uniform(6.8, 7.8),
            np.random.uniform(400, 600),
            "agrumes"
        ])
    
    # BLÉ TENDRE (Nord)
    for _ in range(120):
        data.append([
            np.random.randint(45, 65),
            np.random.randint(35, 50),
            np.random.randint(55, 75),
            np.random.uniform(12, 20),
            np.random.uniform(60, 75),
            np.random.uniform(7.0, 8.0),
            np.random.uniform(450, 650),
            "ble_tendre"
        ])
    
    # FÈVES (assolement)
    for _ in range(80):
        data.append([
            np.random.randint(25, 40),
            np.random.randint(20, 35),
            np.random.randint(35, 50),
            np.random.uniform(15, 22),
            np.random.uniform(60, 75),
            np.random.uniform(7.0, 8.0),
            np.random.uniform(400, 600),
            "feves"
        ])
    
    # ==========================================
    # ZONE CENTRE (Semi-aride) 250-400mm/an
    # Kairouan, Sidi Bouzid, Gafsa, Kasserine
    # ==========================================
    
    # BLÉ DUR (Tunisie = 1er producteur mondial!)
    for _ in range(250):
        data.append([
            np.random.randint(40, 60),
            np.random.randint(30, 45),
            np.random.randint(50, 70),
            np.random.uniform(14, 24),
            np.random.uniform(50, 65),
            np.random.uniform(7.5, 8.5),
            np.random.uniform(250, 400),
            "bledur"                        # CULTURE EMBLÉMATIQUE
        ])
    
    # ORGE (escourgeon)
    for _ in range(180):
        data.append([
            np.random.randint(35, 55),
            np.random.randint(25, 40),
            np.random.randint(45, 65),
            np.random.uniform(15, 26),
            np.random.uniform(45, 60),
            np.random.uniform(7.3, 8.3),
            np.random.uniform(200, 350),
            "orge"
        ])
    
    # OLIVIERS (Centre - moins d'eau, variétés résistantes)
    for _ in range(120):
        data.append([
            np.random.randint(50, 70),
            np.random.randint(35, 50),
            np.random.randint(70, 90),
            np.random.uniform(18, 28),
            np.random.uniform(50, 65),
            np.random.uniform(7.8, 8.5),
            np.random.uniform(200, 350),
            "olive"
        ])
    
    # POIS CHICHES (cicer)
    for _ in range(100):
        data.append([
            np.random.randint(20, 35),
            np.random.randint(25, 40),
            np.random.randint(40, 55),
            np.random.uniform(16, 24),
            np.random.uniform(50, 65),
            np.random.uniform(7.2, 8.2),
            np.random.uniform(250, 400),
            "pois_chiche"
        ])
    
    # ==========================================
    # ZONE SUD (Aride) <250mm/an
    # Gabès, Medenine, Tataouine, Tozeur, Kebili
    # ==========================================
    
    # DATTES (Phoenix dactylifera) - OASIS
    for _ in range(220):
        data.append([
            np.random.randint(70, 90),
            np.random.randint(55, 75),
            np.random.randint(90, 120),
            np.random.uniform(25, 35),
            np.random.uniform(40, 55),
            np.random.uniform(8.0, 8.8),
            np.random.uniform(80, 200),     # Très peu de pluie!
            "dattes"                        # DEGLET NOUR, ALLIG, KENTA
        ])
    
    # OLIVIERS OASIENS (Chemlali de Gabès)
    for _ in range(100):
        data.append([
            np.random.randint(55, 75),
            np.random.randint(40, 60),
            np.random.randint(75, 95),
            np.random.uniform(22, 32),
            np.random.uniform(45, 60),
            np.random.uniform(8.0, 8.5),
            np.random.uniform(100, 250),
            "olive"
        ])
    
    # AMANDIERS (résistant à la sécheresse)
    for _ in range(80):
        data.append([
            np.random.randint(45, 65),
            np.random.randint(35, 50),
            np.random.randint(60, 80),
            np.random.uniform(20, 30),
            np.random.uniform(45, 60),
            np.random.uniform(7.8, 8.5),
            np.random.uniform(150, 280),
            "amandier"
        ])
    
    # FIGUIERS DE BARBARIE (cactus)
    for _ in range(60):
        data.append([
            np.random.randint(30, 50),
            np.random.randint(25, 40),
            np.random.randint(50, 70),
            np.random.uniform(25, 35),
            np.random.uniform(40, 55),
            np.random.uniform(7.5, 8.5),
            np.random.uniform(100, 200),
            "figuier_barbarie"
        ])
    
    # PÊCHERS (oasis de Tozeur - spécialité)
    for _ in range(50):
        data.append([
            np.random.randint(60, 80),
            np.random.randint(45, 60),
            np.random.randint(75, 95),
            np.random.uniform(22, 32),
            np.random.uniform(50, 65),
            np.random.uniform(7.5, 8.2),
            np.random.uniform(120, 250),
            "pecher"
        ])
    
    # Créer DataFrame
    columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'label']
    df = pd.DataFrame(data, columns=columns)
    
    return df

# Générer dataset
print("🌾 Génération dataset Tunisie...")
df_tunisia = generate_tunisia_crop_dataset()

print(f"✅ Dataset créé: {len(df_tunisia)} échantillons")
print("\nDistribution des cultures:")
print(df_tunisia['label'].value_counts())

# Entraînement
X = df_tunisia.drop('label', axis=1)
y = df_tunisia['label']

model = RandomForestClassifier(
    n_estimators=200,      # Plus d'arbres pour meilleure précision
    max_depth=15,
    min_samples_split=5,
    random_state=42
)

model.fit(X, y)

# Évaluation rapide
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5)
print(f"\n📊 Précision moyenne: {scores.mean():.2f} (+/- {scores.std()*2:.2f})")

# Sauvegarde
joblib.dump(model, "crop_model_tunisia.pkl")
print("\n💾 Modèle sauvegardé: crop_model_tunisia.pkl")

# Sauvegarder aussi le dataset pour référence
df_tunisia.to_csv("crop_recommendation_tunisia.csv", index=False)
print("📁 Dataset sauvegardé: crop_recommendation_tunisia.csv")