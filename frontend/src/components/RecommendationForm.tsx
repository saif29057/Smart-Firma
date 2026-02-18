import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Loader, 
  Cloud, 
  Sprout, 
  AlertTriangle, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Thermometer,
  Droplets,
  FlaskConical,
  Calendar,
  Sun,
  Info
} from "lucide-react";

// ✅ Interface pour les props
interface RecommendationFormProps {
  initialLocation?: string;
}

const API_BASE_URL = 'http://localhost:8000';

// 🌾 Mapping cultures tunisiennes avec emojis et infos
const TUNISIAN_CROPS: {[key: string]: {emoji: string; nom_ar: string; region: string; type: string}} = {
  'bledur': { emoji: '🌾', nom_ar: 'قمح صلب', region: 'Centre', type: 'Céréale' },
  'olive': { emoji: '🫒', nom_ar: 'زيتون', region: 'Toute la Tunisie', type: 'Arboriculture' },
  'dattes': { emoji: '🌴', nom_ar: 'تمر', region: 'Sud', type: 'Arboriculture' },
  'agrumes': { emoji: '🍊', nom_ar: 'حمضيات', region: 'Cap Bon', type: 'Arboriculture' },
  'orge': { emoji: '🌾', nom_ar: 'شعير', region: 'Centre/Nord', type: 'Céréale' },
  'ble_tendre': { emoji: '🌾', nom_ar: 'قمح لين', region: 'Nord', type: 'Céréale' },
  'feves': { emoji: '🫘', nom_ar: 'فول', region: 'Nord', type: 'Légumineuse' },
  'pois_chiche': { emoji: '🫘', nom_ar: 'حمص', region: 'Centre', type: 'Légumineuse' },
  'amandier': { emoji: '🌰', nom_ar: 'لوز', region: 'Sud', type: 'Arboriculture' },
  'figuier_barbarie': { emoji: '🌵', nom_ar: 'تين شوكي', region: 'Sud', type: 'Cactus' },
  'pecher': { emoji: '🍑', nom_ar: 'خوخ', region: 'Tozeur', type: 'Arboriculture' }
};

// ✅ Accepter les props
const RecommendationForm: React.FC<RecommendationFormProps> = ({ initialLocation = '' }) => {
  // ✅ Initialiser avec initialLocation
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    N: 70, P: 30, K: 50, ph: 6.5, temperature: 25, humidity: 60
  });

  // ✅ Mettre à jour quand initialLocation change
  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      console.log("📍 Localisation initiale reçue:", initialLocation);
    }
  }, [initialLocation]);

  // Géolocalisation automatique (seulement si pas de initialLocation)
  useEffect(() => {
    if (initialLocation || location) return; // Ne pas géolocaliser si déjà une location
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
            );
            const data = await res.json();
            if (data.city) {
              setLocation(data.city);
              console.log("📍 Position détectée:", data.city);
            }
          } catch (e) {
            console.log("Erreur geoloc:", e);
          }
        },
        (err) => console.log("Géolocalisation refusée:", err)
      );
    }
  }, [initialLocation, location]);

  const handleSubmit = async () => {
    if (!location.trim()) {
      setError("Veuillez entrer une localisation");
      return;
    }
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const params = new URLSearchParams({
        location: location.trim(),
        mode: manualMode ? "manual" : "auto",
        ...(manualMode && {
          N: manualData.N.toString(),
          P: manualData.P.toString(),
          K: manualData.K.toString(),
          ph: manualData.ph.toString(),
          temp: manualData.temperature.toString(),
          humidity: manualData.humidity.toString()
        })
      });
      
      const url = `${API_BASE_URL}/crops/predict_crop/?${params.toString()}`;
      console.log("🚀 Appel API:", url);
      
      const res = await fetch(url);
      const data = await res.json();
      
      console.log("📥 Réponse reçue:", data);
      
      if (!res.ok) {
        throw new Error(data.error || `Erreur serveur ${res.status}`);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResult(data);
    } catch (err: any) {
      console.error("❌ Erreur:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const getCropInfo = (crop: string) => {
    return TUNISIAN_CROPS[crop?.toLowerCase()] || { 
      emoji: '🌱', 
      nom_ar: '---', 
      region: 'Tunisie', 
      type: 'Culture' 
    };
  };

  const getConfidenceColor = (confiance: number): string => {
    if (confiance >= 80) return '#16a34a';
    if (confiance >= 60) return '#ea580c';
    return '#dc2626';
  };

  const getRegionColor = (region: string): string => {
    if (region.includes('Nord')) return '#3b82f6';
    if (region.includes('Centre')) return '#f59e0b';
    if (region.includes('Sud')) return '#dc2626';
    return '#6b7280';
  };

  // Helper pour accès sécurisé aux données
  const getMeteo = (key: string) => result?.donnees_auto?.meteo?.[key] ?? '--';
  const getSol = (key: string) => result?.donnees_auto?.sol?.[key] ?? '--';
  const getLoc = (key: string) => result?.donnees_auto?.localisation?.[key] ?? '--';

  const mainCrop = result?.recommandation?.culture;
  const cropInfo = getCropInfo(mainCrop);

  return (
    <div className="smart-farm-wrapper">
      <div className="recommendation-card">
        {/* Header */}
        <div className="card-header">
          <div className="header-icon">
            <Sprout size={32} color="white" />
          </div>
          <div className="header-text">
            <h2>🌾 Smart-Farm Tunisia</h2>
            <p>Système de recommandation agricole adapté aux cultures tunisiennes</p>
            <span className="tunisia-badge">🇹🇳 Spécialisé Nord/Centre/Sud</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="location-input-group">
            <MapPin className="input-icon" size={20} />
            <input
              type="text"
              placeholder="Votre ville (Tunis, Sfax, Tozeur, Kairouan...)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="location-input"
            />
            <button 
              onClick={handleSubmit} 
              disabled={loading || !location.trim()}
              className="analyze-btn"
            >
              {loading ? <Loader className="spin" size={18} /> : "Analyser"}
            </button>
          </div>
          
          {/* ✅ Afficher la localisation pré-remplie si elle vient du dashboard */}
          {initialLocation && (
            <div className="initial-location-hint">
              <Info size={14} />
              <span>Localisation sélectionnée depuis le tableau de bord</span>
            </div>
          )}
          
          <button 
            onClick={() => setManualMode(!manualMode)}
            className={`mode-toggle ${manualMode ? 'active' : ''}`}
          >
            {manualMode ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {manualMode ? "Masquer personnalisation" : "Personnaliser les données"}
          </button>

          {manualMode && (
            <div className="manual-inputs">
              <h4>🧪 Données du sol (optionnel)</h4>
              <div className="input-grid">
                <div className="input-group">
                  <label>Azote (N)</label>
                  <input 
                    type="number" 
                    value={manualData.N} 
                    onChange={(e) => setManualData({...manualData, N: Number(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>Phosphore (P)</label>
                  <input 
                    type="number" 
                    value={manualData.P} 
                    onChange={(e) => setManualData({...manualData, P: Number(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>Potassium (K)</label>
                  <input 
                    type="number" 
                    value={manualData.K} 
                    onChange={(e) => setManualData({...manualData, K: Number(e.target.value)})}
                  />
                </div>
                <div className="input-group">
                  <label>pH</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={manualData.ph} 
                    onChange={(e) => setManualData({...manualData, ph: Number(e.target.value)})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="alert error">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="results-container animate-in">
            {/* Main Recommendation */}
            <div className="main-recommendation" style={{
              background: `linear-gradient(135deg, ${getRegionColor(getLoc('region'))} 0%, ${getConfidenceColor(result?.recommandation?.confiance || 0)} 100%)`
            }}>
              <div className="crop-display">
                <span className="crop-emoji">{cropInfo.emoji}</span>
                <div className="crop-info">
                  <div className="crop-badges">
                    <span className="region-badge">{getLoc('region')}</span>
                    <span className="type-badge">{cropInfo.type}</span>
                  </div>
                  <h3 className="crop-name">{mainCrop}</h3>
                  <p className="crop-arabic">{cropInfo.nom_ar}</p>
                  <div 
                    className="confidence-badge"
                    style={{backgroundColor: 'rgba(255,255,255,0.25)'}}
                  >
                    <Check size={14} />
                    Confiance: {result?.recommandation?.confiance || 0}%
                  </div>
                </div>
              </div>
              
              {result?.recommandation?.alternatives?.length > 0 && (
                <div className="alternatives">
                  <span>Alternatives régionales:</span>
                  <div className="alt-badges">
                    {result.recommandation.alternatives.map((alt: any, idx: number) => {
                      const altInfo = getCropInfo(alt.culture);
                      return (
                        <span key={idx} className="alt-badge" title={altInfo.region}>
                          {altInfo.emoji} {alt.culture} ({alt.confiance}%)
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Data Cards */}
            <div className="data-grid">
              <div className="data-card weather-card">
                <div className="card-icon"><Cloud size={24} /></div>
                <div className="card-content">
                  <h4>🌤️ Météo - {getLoc('ville')}</h4>
                  <div className="metrics">
                    <div className="metric">
                      <Thermometer size={16} />
                      <span>{getMeteo('temperature')}°C</span>
                    </div>
                    <div className="metric">
                      <Droplets size={16} />
                      <span>{getMeteo('humidite')}% humidité</span>
                    </div>
                    <div className="metric">
                      <Cloud size={16} />
                      <span>{getMeteo('pluie_3jours')}mm/3j</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="data-card soil-card">
                <div className="card-icon"><FlaskConical size={24} /></div>
                <div className="card-content">
                  <h4>🧪 Sol - {getSol('type')}</h4>
                  <div className="soil-metrics">
                    <span className="soil-tag" title="Azote">N:{getSol('N')}</span>
                    <span className="soil-tag" title="Phosphore">P:{getSol('P')}</span>
                    <span className="soil-tag" title="Potassium">K:{getSol('K')}</span>
                    <span className="soil-tag" title="pH">pH:{getSol('ph')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Tunisie */}
            {(result?.conseils?.alertes_meteo?.length > 0 || result?.conseils?.analyse_sol?.length > 0) && (
              <div className="alerts-section">
                <h4><AlertTriangle size={18} /> Alertes Agro-climatiques</h4>
                {result?.conseils?.alertes_meteo?.map((alert: string, idx: number) => (
                  <div key={idx} className="alert-item weather-alert">
                    <Sun size={16} />
                    {alert}
                  </div>
                ))}
                {result?.conseils?.analyse_sol?.map((alert: string, idx: number) => (
                  <div key={idx} className="alert-item soil-alert">
                    <Info size={16} />
                    {alert}
                  </div>
                ))}
              </div>
            )}

            {/* Advice Spécifique Tunisie */}
            {result?.conseils?.culture && (
              <div className="advice-section">
                <h4><Calendar size={18} /> Fiche Technique Tunisie</h4>
                <div className="advice-grid tunisian">
                  {result.conseils.culture.saison && (
                    <div className="advice-item highlight">
                      <strong>📅 Saison optimale</strong>
                      <p>{result.conseils.culture.saison}</p>
                    </div>
                  )}
                  {result.conseils.culture.region && (
                    <div className="advice-item">
                      <strong>🗺️ Zone principale</strong>
                      <p>{result.conseils.culture.region}</p>
                    </div>
                  )}
                  {result.conseils.culture.irrigation && (
                    <div className="advice-item">
                      <strong>💧 Gestion eau</strong>
                      <p>{result.conseils.culture.irrigation}</p>
                    </div>
                  )}
                  {result.conseils.culture.rendement && (
                    <div className="advice-item">
                      <strong>📊 Rendement moyen</strong>
                      <p>{result.conseils.culture.rendement}</p>
                    </div>
                  )}
                  {result.conseils.culture.cycle && (
                    <div className="advice-item">
                      <strong>⏱️ Cycle cultural</strong>
                      <p>{result.conseils.culture.cycle}</p>
                    </div>
                  )}
                  {result.conseils.culture.export && (
                    <div className="advice-item export">
                      <strong>🌍 Export</strong>
                      <p>{result.conseils.culture.export}</p>
                    </div>
                  )}
                </div>
                
                {result.conseils.culture.alertes && (
                  <div className="culture-risks">
                    <strong>⚠️ Points d'attention:</strong>
                    <ul>
                      {result.conseils.culture.alertes.map((alert: string, idx: number) => (
                        <li key={idx}>{alert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setShowDetails(!showDetails)} className="details-toggle">
              {showDetails ? "Masquer détails techniques" : "Voir détails techniques"}
            </button>

            {showDetails && (
              <div className="technical-details">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .smart-farm-wrapper { max-width: 900px; margin: 2rem auto; font-family: 'Segoe UI', system-ui, sans-serif; }
        .recommendation-card { 
          background: linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%); 
          border-radius: 24px; 
          padding: 2rem; 
          color: white; 
          box-shadow: 0 25px 50px rgba(0,0,0,0.3); 
          border: 1px solid rgba(255,255,255,0.1);
        }
        .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .header-icon { 
          background: linear-gradient(135deg, #f59e0b, #ea580c); 
          padding: 1rem; 
          border-radius: 16px;
          box-shadow: 0 8px 16px rgba(245, 158, 11, 0.3);
        }
        .header-text h2 { margin: 0; font-size: 1.75rem; font-weight: 800; }
        .header-text p { margin: 0.5rem 0; opacity: 0.9; }
        .tunisia-badge { 
          display: inline-block; 
          background: rgba(255,255,255,0.15); 
          padding: 0.375rem 0.875rem; 
          border-radius: 20px; 
          font-size: 0.8rem; 
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .input-section { 
          background: rgba(255,255,255,0.08); 
          padding: 1.5rem; 
          border-radius: 16px; 
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .location-input-group { 
          display: flex; 
          gap: 0.75rem; 
          align-items: center; 
          background: white; 
          padding: 0.5rem; 
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .input-icon { color: #0f766e; margin-left: 0.5rem; }
        .location-input { flex: 1; border: none; padding: 0.75rem; font-size: 1rem; outline: none; color: #1e293b; }
        .analyze-btn { 
          background: linear-gradient(135deg, #059669, #047857); 
          color: white; 
          border: none; 
          padding: 0.875rem 1.75rem; 
          border-radius: 10px; 
          cursor: pointer; 
          font-weight: 700; 
          display: flex; 
          align-items: center; 
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          transition: transform 0.2s;
        }
        .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .initial-location-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          font-size: 0.85rem;
          color: #fef3c7;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .mode-toggle { 
          margin-top: 1rem; 
          background: transparent; 
          border: 1px solid rgba(255,255,255,0.3); 
          color: white; 
          padding: 0.625rem 1.25rem; 
          border-radius: 20px; 
          cursor: pointer; 
          display: inline-flex; 
          align-items: center; 
          gap: 0.5rem; 
          width: 100%; 
          justify-content: center;
          transition: all 0.2s;
        }
        .mode-toggle:hover, .mode-toggle.active { background: rgba(255,255,255,0.1); }
        .manual-inputs { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.2); }
        .input-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .input-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .input-group label { font-size: 0.8rem; opacity: 0.8; }
        .input-group input { 
          padding: 0.625rem; 
          border-radius: 8px; 
          border: 1px solid rgba(255,255,255,0.3); 
          background: rgba(255,255,255,0.1); 
          color: white; 
          text-align: center;
          font-weight: 600;
        }
        .alert { padding: 1rem; border-radius: 12px; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem; }
        .alert.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .results-container { 
          background: white; 
          color: #1e293b; 
          border-radius: 20px; 
          padding: 2rem; 
          margin-top: 1.5rem; 
          animation: fadeIn 0.5s ease-out;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .main-recommendation { 
          text-align: center; 
          padding: 2.5rem 2rem; 
          color: white; 
          border-radius: 20px; 
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }
        .main-recommendation::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .crop-display { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; position: relative; z-index: 1; }
        .crop-emoji { font-size: 5rem; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3)); animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .crop-info { text-align: left; }
        .crop-badges { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
        .region-badge, .type-badge { 
          padding: 0.25rem 0.75rem; 
          border-radius: 12px; 
          font-size: 0.7rem; 
          font-weight: 700; 
          text-transform: uppercase;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
        }
        .crop-name { margin: 0; font-size: 2.5rem; font-weight: 800; text-transform: capitalize; letter-spacing: -0.02em; }
        .crop-arabic { margin: 0.25rem 0 0.5rem; font-size: 1.25rem; opacity: 0.9; font-weight: 600; }
        .confidence-badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 0.375rem; 
          padding: 0.5rem 1rem; 
          border-radius: 20px; 
          font-size: 0.875rem; 
          font-weight: 700;
          backdrop-filter: blur(10px);
        }
        .alternatives { 
          margin-top: 1.5rem; 
          padding-top: 1.5rem; 
          border-top: 1px solid rgba(255,255,255,0.3); 
          position: relative; z-index: 1;
        }
        .alt-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 0.5rem; }
        .alt-badge { 
          background: rgba(255,255,255,0.15); 
          padding: 0.5rem 1rem; 
          border-radius: 20px; 
          font-size: 0.875rem; 
          border: 2px solid rgba(255,255,255,0.3);
          cursor: help;
          transition: all 0.2s;
        }
        .alt-badge:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }
        .data-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .data-card { 
          display: flex; 
          align-items: flex-start; 
          gap: 1rem; 
          padding: 1.25rem; 
          background: #f8fafc; 
          border-radius: 16px; 
          border: 2px solid #e2e8f0;
          transition: all 0.2s;
        }
        .data-card:hover { border-color: #0f766e; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .card-icon { padding: 0.75rem; border-radius: 12px; background: white; color: #0f766e; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .soil-card .card-icon { color: #059669; }
        .card-content h4 { margin: 0 0 0.75rem 0; color: #0f172a; font-weight: 700; }
        .metrics { display: flex; flex-direction: column; gap: 0.5rem; }
        .metric { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #475569; font-weight: 500; }
        .soil-metrics { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .soil-tag { 
          background: linear-gradient(135deg, #059669, #047857); 
          color: white; 
          padding: 0.5rem 0.875rem; 
          border-radius: 8px; 
          font-size: 0.875rem; 
          font-weight: 700;
          box-shadow: 0 2px 4px rgba(5, 150, 105, 0.3);
        }
        .alerts-section, .advice-section { margin-bottom: 1.5rem; }
        .alerts-section h4, .advice-section h4 { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          color: #0f172a; 
          font-size: 1.1rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .alert-item { 
          padding: 1rem; 
          border-radius: 12px; 
          margin-bottom: 0.75rem; 
          font-size: 0.9rem; 
          display: flex; 
          align-items: center; 
          gap: 0.75rem;
          font-weight: 500;
        }
        .alert-item.weather-alert { background: #fff7ed; color: #9a3412; border-left: 4px solid #f97316; }
        .alert-item.soil-alert { background: #f0fdf4; color: #166534; border-left: 4px solid #22c55e; }
        .advice-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
        .advice-grid.tunisian { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
        .advice-item { 
          background: #f1f5f9; 
          padding: 1.25rem; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }
        .advice-item:hover { border-color: #0f766e; background: #f8fafc; }
        .advice-item.highlight { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-color: #059669; }
        .advice-item.export { background: linear-gradient(135deg, #fef3c7, #fde68a); border-color: #f59e0b; }
        .advice-item strong { 
          display: block; 
          font-size: 0.75rem; 
          text-transform: uppercase; 
          color: #64748b; 
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }
        .advice-item p { margin: 0; font-weight: 700; color: #0f172a; font-size: 1.05rem; }
        .culture-risks { 
          margin-top: 1.5rem; 
          padding: 1.25rem; 
          background: #fef2f2; 
          border-radius: 12px; 
          border: 1px solid #fecaca;
        }
        .culture-risks strong { color: #991b1b; display: block; margin-bottom: 0.75rem; }
        .culture-risks ul { margin: 0; padding-left: 1.25rem; color: #7f1d1d; }
        .culture-risks li { margin-bottom: 0.375rem; }
        .details-toggle { 
          width: 100%; 
          padding: 1rem; 
          background: #f1f5f9; 
          border: 2px solid #e2e8f0; 
          border-radius: 12px; 
          cursor: pointer; 
          color: #475569; 
          font-weight: 600;
          transition: all 0.2s;
        }
        .details-toggle:hover { background: #e2e8f0; border-color: #cbd5e1; }
        .technical-details { 
          margin-top: 1rem; 
          padding: 1.5rem; 
          background: #0f172a; 
          color: #4ade80; 
          border-radius: 12px; 
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', monospace;
        }
        .technical-details pre { margin: 0; font-size: 0.8rem; line-height: 1.5; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .recommendation-card { padding: 1rem; }
          .input-grid { grid-template-columns: repeat(2, 1fr); }
          .crop-display { flex-direction: column; text-align: center; }
          .crop-info { text-align: center; }
          .crop-badges { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default RecommendationForm;