import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib


# Charger le dataset
df = pd.read_csv("Crop_recommendation.csv")

# Séparer les features et le label
X = df[['N','P','K','temperature','humidity','ph','rainfall']]
y = df['label']

# Entraîner le modèle
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Sauvegarder le modèle
joblib.dump(model, "crop_model.pkl")