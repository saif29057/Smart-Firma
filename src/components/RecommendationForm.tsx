import React, { useState, useEffect } from "react";
import { 
  MapPin, Loader, Cloud, Sprout, AlertTriangle, Check, 
  ChevronDown, ChevronUp, Thermometer, Droplets, 
  FlaskConical, Calendar, Sun, Info
} from "lucide-react";

interface RecommendationFormProps {
  initialLocation?: string;
}

const API_BASE_URL = 'http://localhost:8000';

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

const RecommendationForm: React.FC<RecommendationFormProps> = ({ initialLocation = '' }) => {
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    N: 70, P: 30, K: 50, ph: 6.5, temperature: 25, humidity: 60
  });

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (initialLocation || location) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=fr`
            );
            const data = await res.json();
            if (data.city) setLocation(data.city);
          } catch (e) {}
        },
        () => {}
      );
    }
  }, [initialLocation, location]);

  const handleSubmit = async () => {
    if (!location.trim()) { setError("Veuillez entrer une localisation"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const params = new URLSearchParams({
        location: location.trim(),
        mode: manualMode ? "manual" : "auto",
        ...(manualMode && {
          N: manualData.N.toString(), P: manualData.P.toString(),
          K: manualData.K.toString(), ph: manualData.ph.toString(),
          temp: manualData.temperature.toString(), humidity: manualData.humidity.toString()
        })
      });
      const res = await fetch(`${API_BASE_URL}/crops/predict_crop/?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || `Erreur serveur ${res.status}`);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const getCropInfo = (crop: string) => TUNISIAN_CROPS[crop?.toLowerCase()] || { emoji: '🌱', nom_ar: '---', region: 'Tunisie', type: 'Culture' };
  const getMeteo = (key: string) => result?.donnees_auto?.meteo?.[key] ?? '--';
  const getSol = (key: string) => result?.donnees_auto?.sol?.[key] ?? '--';
  const getLoc = (key: string) => result?.donnees_auto?.localisation?.[key] ?? '--';

  const mainCrop = result?.recommandation?.culture;
  const cropInfo = getCropInfo(mainCrop);

  return (
    <div className="sf-wrapper">
      <div className="sf-card">

        {/* Header */}
        <div className="sf-header">
          <div className="sf-header-icon">
            <Sprout size={32} color="#fffdf9" />
          </div>
          <div className="sf-header-text">
            <p>Système de recommandation agricole adapté aux cultures tunisiennes . </p>
          </div>
                      <span className="sf-badge">🇹🇳 Spécialisé Nord/Centre/Sud</span>

        </div>

        {/* Input */}
        <div className="sf-input-section">
          <div className="sf-location-group">
            <MapPin size={20} color="#8B5E3C" style={{marginLeft: '0.5rem', flexShrink: 0}} />
            <input
              type="text"
              placeholder="Votre ville (Tunis, Sfax, Tozeur, Kairouan...)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="sf-input"
            />
            <button onClick={handleSubmit} disabled={loading || !location.trim()} className="sf-analyze-btn">
              {loading ? <Loader size={18} className="sf-spin" /> : "Analyser"}
            </button>
          </div>

          {initialLocation && (
            <div className="sf-hint">
              <Info size={14} />
              <span>Localisation sélectionnée depuis le tableau de bord</span>
            </div>
          )}

          <button onClick={() => setManualMode(!manualMode)} className={`sf-toggle ${manualMode ? 'active' : ''}`}>
            {manualMode ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {manualMode ? "Masquer personnalisation" : "Personnaliser les données"}
          </button>

          {manualMode && (
            <div className="sf-manual">
              <h4>🧪 Données du sol (optionnel)</h4>
              <div className="sf-input-grid">
                {[
                  { label: 'Azote (N)', key: 'N' },
                  { label: 'Phosphore (P)', key: 'P' },
                  { label: 'Potassium (K)', key: 'K' },
                  { label: 'pH', key: 'ph', step: 0.1 },
                ].map(({ label, key, step }) => (
                  <div key={key} className="sf-input-group">
                    <label>{label}</label>
                    <input
                      type="number"
                      step={step}
                      value={(manualData as any)[key]}
                      onChange={(e) => setManualData({ ...manualData, [key]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="sf-error">
            <AlertTriangle size={20} /><span>{error}</span>
          </div>
        )}

        {result && (
          <div className="sf-results">
            {/* Recommandation principale */}
            <div className="sf-main-rec">
              <div className="sf-crop-display">
                <span className="sf-crop-emoji">{cropInfo.emoji}</span>
                <div className="sf-crop-info">
                  <div className="sf-crop-badges">
                    <span className="sf-region-badge">{getLoc('region')}</span>
                    <span className="sf-type-badge">{cropInfo.type}</span>
                  </div>
                  <h3 className="sf-crop-name">{mainCrop}</h3>
                  <p className="sf-crop-arabic">{cropInfo.nom_ar}</p>
                  <div className="sf-confidence">
                    <Check size={14} />
                    Confiance: {result?.recommandation?.confiance || 0}%
                  </div>
                </div>
              </div>
              {result?.recommandation?.alternatives?.length > 0 && (
                <div className="sf-alternatives">
                  <span>Alternatives régionales:</span>
                  <div className="sf-alt-badges">
                    {result.recommandation.alternatives.map((alt: any, idx: number) => {
                      const altInfo = getCropInfo(alt.culture);
                      return (
                        <span key={idx} className="sf-alt-badge">
                          {altInfo.emoji} {alt.culture} ({alt.confiance}%)
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Data cards */}
            <div className="sf-data-grid">
              <div className="sf-data-card">
                <div className="sf-card-icon"><Cloud size={24} /></div>
                <div>
                  <h4>🌤️ Météo - {getLoc('ville')}</h4>
                  <div className="sf-metrics">
                    <div className="sf-metric"><Thermometer size={16} /><span>{getMeteo('temperature')}°C</span></div>
                    <div className="sf-metric"><Droplets size={16} /><span>{getMeteo('humidite')}% humidité</span></div>
                    <div className="sf-metric"><Cloud size={16} /><span>{getMeteo('pluie_3jours')}mm/3j</span></div>
                  </div>
                </div>
              </div>
              <div className="sf-data-card">
                <div className="sf-card-icon soil"><FlaskConical size={24} /></div>
                <div>
                  <h4>🧪 Sol - {getSol('type')}</h4>
                  <div className="sf-soil-tags">
                    <span className="sf-soil-tag">N:{getSol('N')}</span>
                    <span className="sf-soil-tag">P:{getSol('P')}</span>
                    <span className="sf-soil-tag">K:{getSol('K')}</span>
                    <span className="sf-soil-tag">pH:{getSol('ph')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertes */}
            {(result?.conseils?.alertes_meteo?.length > 0 || result?.conseils?.analyse_sol?.length > 0) && (
              <div className="sf-alerts">
                <h4><AlertTriangle size={18} /> Alertes Agro-climatiques</h4>
                {result?.conseils?.alertes_meteo?.map((alert: string, idx: number) => (
                  <div key={idx} className="sf-alert-item weather"><Sun size={16} />{alert}</div>
                ))}
                {result?.conseils?.analyse_sol?.map((alert: string, idx: number) => (
                  <div key={idx} className="sf-alert-item soil"><Info size={16} />{alert}</div>
                ))}
              </div>
            )}

            {/* Fiche technique */}
            {result?.conseils?.culture && (
              <div className="sf-advice">
                <h4><Calendar size={18} /> Fiche Technique Tunisie</h4>
                <div className="sf-advice-grid">
                  {result.conseils.culture.saison && <div className="sf-advice-item highlight"><strong>📅 Saison optimale</strong><p>{result.conseils.culture.saison}</p></div>}
                  {result.conseils.culture.region && <div className="sf-advice-item"><strong>🗺️ Zone principale</strong><p>{result.conseils.culture.region}</p></div>}
                  {result.conseils.culture.irrigation && <div className="sf-advice-item"><strong>💧 Gestion eau</strong><p>{result.conseils.culture.irrigation}</p></div>}
                  {result.conseils.culture.rendement && <div className="sf-advice-item"><strong>📊 Rendement moyen</strong><p>{result.conseils.culture.rendement}</p></div>}
                  {result.conseils.culture.cycle && <div className="sf-advice-item"><strong>⏱️ Cycle cultural</strong><p>{result.conseils.culture.cycle}</p></div>}
                  {result.conseils.culture.export && <div className="sf-advice-item export"><strong>🌍 Export</strong><p>{result.conseils.culture.export}</p></div>}
                </div>
                {result.conseils.culture.alertes && (
                  <div className="sf-risks">
                    <strong>⚠️ Points d'attention:</strong>
                    <ul>{result.conseils.culture.alertes.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setShowDetails(!showDetails)} className="sf-details-toggle">
              {showDetails ? "Masquer détails techniques" : "Voir détails techniques"}
            </button>
            {showDetails && (
              <div className="sf-technical">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .sf-wrapper { max-width: 900px; margin: 2rem auto; font-family: 'Segoe UI', system-ui, sans-serif; }

        .sf-card {
          background: linear-gradient(160deg, #6b4c2a 0%, #3d2b1a 100%);
          border-radius: 24px;
          padding: 2rem;
          color: #f5ede0;
          box-shadow: 0 25px 50px rgba(61, 43, 26, 0.4);
          border: 1px solid rgba(212, 184, 150, 0.2);
        }

        /* Header */
        .sf-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .sf-header-icon {
          background: linear-gradient(135deg, #d4a853, #8B5E3C);
          padding: 1rem; border-radius: 16px;
          box-shadow: 0 8px 16px rgba(212, 168, 83, 0.3);
          flex-shrink: 0;
        }
        .sf-header-text h2 { margin: 0; font-size: 1.75rem; font-weight: 800; color: #f5ede0; }
        .sf-header-text p { margin: 0.5rem 0; opacity: 0.85; color: #d4b896; }
        .sf-badge {
          display: inline-block;
          background: rgba(212, 168, 83, 0.2);
          padding: 0.375rem 0.875rem;
          border-radius: 20px; font-size: 0.8rem; font-weight: 600;
          border: 1px solid rgba(212, 168, 83, 0.4);
          color: #d4a853;
        }

        /* Input section */
        .sf-input-section {
          background: rgba(245, 237, 224, 0.08);
          padding: 1.5rem; border-radius: 16px; margin-bottom: 1.5rem;
          border: 1px solid rgba(212, 184, 150, 0.2);
        }
        .sf-location-group {
          display: flex; gap: 0.75rem; align-items: center;
          background: #fffdf9; padding: 0.5rem;
          border-radius: 12px; box-shadow: 0 4px 12px rgba(61,43,26,0.2);
        }
        .sf-input {
          flex: 1; border: none; padding: 0.75rem;
          font-size: 1rem; outline: none; color: #3d2b1a;
          background: transparent;
        }
        .sf-analyze-btn {
          background: linear-gradient(135deg, #8B5E3C, #6b4c2a);
          color: #f5ede0; border: none;
          padding: 0.875rem 1.75rem; border-radius: 10px;
          cursor: pointer; font-weight: 700;
          display: flex; align-items: center; gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(107, 76, 42, 0.4);
          transition: transform 0.2s, opacity 0.2s;
          white-space: nowrap;
        }
        .sf-analyze-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .sf-analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .sf-hint {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 0.75rem; padding: 0.5rem 0.75rem;
          background: rgba(212, 168, 83, 0.15); border-radius: 8px;
          font-size: 0.85rem; color: #f5ede0;
          border: 1px solid rgba(212, 168, 83, 0.3);
        }
        .sf-toggle {
          margin-top: 1rem; background: transparent;
          border: 1px solid rgba(212, 184, 150, 0.4); color: #f5ede0;
          padding: 0.625rem 1.25rem; border-radius: 20px;
          cursor: pointer; display: inline-flex;
          align-items: center; gap: 0.5rem;
          width: 100%; justify-content: center; transition: all 0.2s;
        }
        .sf-toggle:hover, .sf-toggle.active { background: rgba(212, 184, 150, 0.15); }

        .sf-manual { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(212, 184, 150, 0.3); }
        .sf-manual h4 { color: #d4b896; margin: 0 0 1rem; }
        .sf-input-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .sf-input-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .sf-input-group label { font-size: 0.8rem; color: #d4b896; }
        .sf-input-group input {
          padding: 0.625rem; border-radius: 8px;
          border: 1px solid rgba(212, 184, 150, 0.3);
          background: rgba(245, 237, 224, 0.1); color: #f5ede0;
          text-align: center; font-weight: 600;
        }

        .sf-error {
          padding: 1rem; border-radius: 12px; margin-bottom: 1rem;
          display: flex; align-items: center; gap: 0.75rem;
          background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;
        }

        /* Results */
        .sf-results {
          background: #fffdf9; color: #3d2b1a;
          border-radius: 20px; padding: 2rem; margin-top: 1.5rem;
          animation: sfFadeIn 0.5s ease-out;
          box-shadow: 0 20px 40px rgba(61,43,26,0.25);
        }
        @keyframes sfFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .sf-main-rec {
          text-align: center; padding: 2.5rem 2rem;
          background: linear-gradient(135deg, #6b4c2a 0%, #3d2b1a 100%);
          color: #f5ede0; border-radius: 20px; margin-bottom: 1.5rem;
          box-shadow: 0 10px 30px rgba(61,43,26,0.3);
          position: relative; overflow: hidden;
        }
        .sf-main-rec::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(45deg, rgba(212,168,83,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .sf-crop-display { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1rem; position: relative; z-index: 1; }
        .sf-crop-emoji { font-size: 5rem; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3)); animation: sfBounce 2s infinite; }
        @keyframes sfBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .sf-crop-info { text-align: left; }
        .sf-crop-badges { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
        .sf-region-badge, .sf-type-badge {
          padding: 0.25rem 0.75rem; border-radius: 12px;
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          background: rgba(212,168,83,0.25); border: 1px solid rgba(212,168,83,0.4);
          color: #d4a853;
        }
        .sf-crop-name { margin: 0; font-size: 2.5rem; font-weight: 800; text-transform: capitalize; color: #f5ede0; }
        .sf-crop-arabic { margin: 0.25rem 0 0.5rem; font-size: 1.25rem; opacity: 0.9; font-weight: 600; color: #d4b896; }
        .sf-confidence {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.5rem 1rem; border-radius: 20px;
          font-size: 0.875rem; font-weight: 700;
          background: rgba(212,168,83,0.25); color: #d4a853;
          border: 1px solid rgba(212,168,83,0.4);
        }
        .sf-alternatives {
          margin-top: 1.5rem; padding-top: 1.5rem;
          border-top: 1px solid rgba(212, 184, 150, 0.3);
          position: relative; z-index: 1;
        }
        .sf-alt-badges { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 0.5rem; }
        .sf-alt-badge {
          background: rgba(212,184,150,0.15); padding: 0.5rem 1rem;
          border-radius: 20px; font-size: 0.875rem;
          border: 2px solid rgba(212,184,150,0.3); color: #f5ede0;
          transition: all 0.2s; cursor: default;
        }
        .sf-alt-badge:hover { background: rgba(212,184,150,0.25); transform: translateY(-2px); }

        /* Data cards */
        .sf-data-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .sf-data-card {
          display: flex; align-items: flex-start; gap: 1rem;
          padding: 1.25rem; background: #fdf8f3;
          border-radius: 16px; border: 2px solid #e8d5b7;
          transition: all 0.2s;
        }
        .sf-data-card:hover { border-color: #8B5E3C; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(107,76,42,0.15); }
        .sf-card-icon {
          padding: 0.75rem; border-radius: 12px;
          background: #f5ede0; color: #8B5E3C;
          box-shadow: 0 2px 8px rgba(107,76,42,0.15); flex-shrink: 0;
        }
        .sf-card-icon.soil { color: #6b4c2a; }
        .sf-data-card h4 { margin: 0 0 0.75rem; color: #3d2b1a; font-weight: 700; }
        .sf-metrics { display: flex; flex-direction: column; gap: 0.5rem; }
        .sf-metric { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #6b4c2a; font-weight: 500; }
        .sf-soil-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .sf-soil-tag {
          background: linear-gradient(135deg, #8B5E3C, #6b4c2a);
          color: #f5ede0; padding: 0.5rem 0.875rem;
          border-radius: 8px; font-size: 0.875rem; font-weight: 700;
          box-shadow: 0 2px 4px rgba(107,76,42,0.3);
        }

        /* Alerts */
        .sf-alerts, .sf-advice { margin-bottom: 1.5rem; }
        .sf-alerts h4, .sf-advice h4 {
          display: flex; align-items: center; gap: 0.5rem;
          color: #3d2b1a; font-size: 1.1rem;
          margin-bottom: 1rem; padding-bottom: 0.5rem;
          border-bottom: 2px solid #e8d5b7;
        }
        .sf-alert-item {
          padding: 1rem; border-radius: 12px; margin-bottom: 0.75rem;
          font-size: 0.9rem; display: flex; align-items: center;
          gap: 0.75rem; font-weight: 500;
        }
        .sf-alert-item.weather { background: #fff7ed; color: #9a3412; border-left: 4px solid #f97316; }
        .sf-alert-item.soil { background: #fdf8f3; color: #6b4c2a; border-left: 4px solid #8B5E3C; }

        /* Advice */
        .sf-advice-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .sf-advice-item {
          background: #fdf8f3; padding: 1.25rem;
          border-radius: 12px; border: 1px solid #e8d5b7; transition: all 0.2s;
        }
        .sf-advice-item:hover { border-color: #8B5E3C; }
        .sf-advice-item.highlight { background: linear-gradient(135deg, #fdf8f3, #f5ede0); border-color: #d4b896; }
        .sf-advice-item.export { background: linear-gradient(135deg, #fef3c7, #fde68a); border-color: #f59e0b; }
        .sf-advice-item strong { display: block; font-size: 0.75rem; text-transform: uppercase; color: #8a6a4a; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
        .sf-advice-item p { margin: 0; font-weight: 700; color: #3d2b1a; font-size: 1rem; }

        .sf-risks {
          margin-top: 1.5rem; padding: 1.25rem;
          background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca;
        }
        .sf-risks strong { color: #991b1b; display: block; margin-bottom: 0.75rem; }
        .sf-risks ul { margin: 0; padding-left: 1.25rem; color: #7f1d1d; }
        .sf-risks li { margin-bottom: 0.375rem; }

        .sf-details-toggle {
          width: 100%; padding: 1rem;
          background: #f5ede0; border: 2px solid #e8d5b7;
          border-radius: 12px; cursor: pointer; color: #6b4c2a;
          font-weight: 600; transition: all 0.2s;
        }
        .sf-details-toggle:hover { background: #e8d5b7; border-color: #d4b896; }
        .sf-technical {
          margin-top: 1rem; padding: 1.5rem;
          background: #1e0f00; color: #d4a853;
          border-radius: 12px; overflow-x: auto;
          font-family: 'Monaco', 'Menlo', monospace;
        }
        .sf-technical pre { margin: 0; font-size: 0.8rem; line-height: 1.5; }
        .sf-spin { animation: sfSpin 1s linear infinite; }
        @keyframes sfSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .sf-card { padding: 1rem; }
          .sf-input-grid { grid-template-columns: repeat(2, 1fr); }
          .sf-crop-display { flex-direction: column; text-align: center; }
          .sf-crop-info { text-align: center; }
          .sf-crop-badges { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default RecommendationForm;