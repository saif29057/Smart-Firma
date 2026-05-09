import React, { useState, useRef } from 'react';
import { analysisService, AnalysisLog, Prediction } from '../services/analysisService';
import '../styles/ModernAnalysis.css';

const Analysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisLog | null>(null);
  const [history, setHistory] = useState<AnalysisLog[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner une image valide');
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const analysisResult = await analysisService.uploadImage(selectedImage);
      setResult(analysisResult);
      
      // Ajouter à l'historique
      setHistory(prev => [analysisResult, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#27ae60';
    if (confidence >= 0.6) return '#f39c12';
    return '#e74c3c';
  };

  const formatTime = (seconds: number) => {
    return `${(seconds * 1000).toFixed(0)}ms`;
  };

  return (
    <div className="analysis-page">
      {/* Hero Section */}
      <div className="analysis-hero">
        <div className="hero-content">
          <div className="hero-icon">🌿</div>
          <h1>Analyse Agricole Intelligente</h1>
          <p className="hero-subtitle">Détectez les maladies des plantes avec notre IA spécialisée pour l'agriculture tunisienne</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Précision</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Maladies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{'<'}2s</span>
              <span className="stat-label">Analyse</span>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="leaf-pattern">🍃</div>
        </div>
      </div>

      <div className="analysis-content">
        <div className="upload-section">
          <div className="upload-card modern-card">
            <div className="card-header">
              <div className="card-icon">📸</div>
              <h2>Analyse de Plante</h2>
              <p>Prenez une photo ou téléchargez une image de votre plante</p>
            </div>
            
            <div className="upload-area modern-upload">
              {previewUrl ? (
                <div className="image-preview-container">
                  <div className="preview-wrapper">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                    <div className="preview-overlay">
                      <button onClick={handleReset} className="btn btn-outline change-btn">
                        <span className="btn-icon">🔄</span>
                        Changer
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder modern-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">🌿</div>
                    <h3>Cliquez pour analyser</h3>
                    <p>Glissez-déposez une image ou cliquez pour sélectionner</p>
                    <div className="supported-formats">
                      <span className="format-tag">PNG</span>
                      <span className="format-tag">JPG</span>
                      <span className="format-tag">GIF</span>
                      <span className="size-info">Max 10MB</span>
                    </div>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input"
              />
            </div>

            {error && <div className="alert alert-error modern-alert">{error}</div>}

            {selectedImage && (
              <div className="upload-actions">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="btn btn-primary analyze-btn modern-analyze-btn"
                >
                  <span className="btn-icon">🔍</span>
                  {isAnalyzing ? 'Analyse en cours...' : 'Lancer l\'analyse IA'}
                </button>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="results-section">
            <div className="results-card modern-results">
              <div className="results-header">
                <div className="results-icon">🌿</div>
                <h2>Résultats de l'Analyse IA</h2>
                <div className="confidence-badge" style={{ 
                  backgroundColor: getConfidenceColor(result.confidence),
                  color: '#fff'
                }}>
                  {(result.confidence * 100).toFixed(1)}% de confiance
                </div>
              </div>
              
              <div className="result-summary">
                <div className="top-prediction main-prediction">
                  <div className="prediction-header">
                    <h3>Diagnostic Principal</h3>
                    <div className="prediction-status">
                      <span className="status-dot" style={{ 
                        backgroundColor: getConfidenceColor(result.result.top_prediction.confidence)
                      }}></span>
                      {result.result.top_prediction.confidence >= 0.8 ? 'Haute confiance' : 
                       result.result.top_prediction.confidence >= 0.6 ? 'Confiance moyenne' : 'Faible confiance'}
                    </div>
                  </div>
                  <div className="prediction-item main">
                    <div className="disease-info">
                      <div className="disease-icon">🦠</div>
                      <div className="disease-details">
                        <span className="class-name">{result.result.top_prediction.class}</span>
                        <div className="confidence-visual">
                          <div className="confidence-progress">
                            <div 
                              className="confidence-fill"
                              style={{ 
                                width: `${result.result.top_prediction.confidence * 100}%`,
                                backgroundColor: getConfidenceColor(result.result.top_prediction.confidence)
                              }}
                            ></div>
                          </div>
                          <span className="confidence-percentage">
                            {(result.result.top_prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="all-predictions predictions-list">
                  <h3>Autres possibilités</h3>
                  <div className="predictions-grid">
                    {result.result.predictions.slice(1).map((prediction: Prediction, index: number) => (
                      <div key={index} className="prediction-card">
                        <div className="prediction-rank">#{prediction.rank + 1}</div>
                        <div className="prediction-content">
                          <span className="class-name">{prediction.class}</span>
                          <div className="mini-confidence-bar">
                            <div 
                              className="confidence-fill"
                              style={{ 
                                width: `${prediction.confidence * 100}%`,
                                backgroundColor: getConfidenceColor(prediction.confidence)
                              }}
                            ></div>
                          </div>
                          <span className="confidence-value">
                            {(prediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="analysis-meta modern-meta">
                <div className="meta-grid">
                  <div className="meta-item">
                    <div className="meta-icon">⚡</div>
                    <div className="meta-content">
                      <span className="label">Temps de traitement</span>
                      <span className="value">{formatTime(result.processing_time)}</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon">📅</div>
                    <div className="meta-content">
                      <span className="label">Date d'analyse</span>
                      <span className="value">
                        {new Date(result.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <div className="meta-icon">🎯</div>
                    <div className="meta-content">
                      <span className="label">Confiance globale</span>
                      <span className="value confidence-high">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
                {result?.result.recommendations && (
          <div className="recommendations-section">
            <div className="reco-main-card modern-card">
              <div className="card-header reco-card-header">
                <div className="card-icon">🩺</div>
                <h2>Recommandations Agricoles</h2>
                <p>Actions à entreprendre suite au diagnostic</p>
              </div>

              <div className="reco-body">
                {/* Bannière urgence */}
                <div className={`urgence-banner urgence-${result.result.recommendations.urgence}`}>
                  {result.result.recommendations.urgence === 'critique' && '🚨 URGENT — '}
                  {result.result.recommendations.urgence === 'haute'    && '⚠️ IMPORTANT — '}
                  {result.result.recommendations.urgence === 'moyenne'  && '⚡ ATTENTION — '}
                  {result.result.recommendations.urgence === 'faible'   && 'ℹ️ INFO — '}
                  {result.result.recommendations.urgence === 'aucune'   && '✅ '}
                  {result.result.recommendations.description}
                </div>

                <div className="reco-grid">
                  {result.result.recommendations.traitement.length > 0 && (
                    <div className="reco-card traitement-card">
                      <div className="reco-header">
                        <span className="reco-icon">💊</span>
                        <h3>Traitements recommandés</h3>
                      </div>
                      <ul className="reco-list">
                        {result.result.recommendations.traitement.map((item, i) => (
                          <li key={i}><span className="reco-bullet">→</span>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="reco-card prevention-card">
                    <div className="reco-header">
                      <span className="reco-icon">🛡️</span>
                      <h3>Mesures de prévention</h3>
                    </div>
                    <ul className="reco-list">
                      {result.result.recommendations.prevention.map((item, i) => (
                        <li key={i}><span className="reco-bullet">→</span>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <div className="history-icon">📊</div>
              <h2>Historique des Analyses</h2>
              <p>Vos analyses précédentes de maladies des plantes</p>
            </div>
            <div className="history-grid modern-history">
              {history.map((item) => (
                <div key={item.id} className="history-item modern-history-item">
                  <div className="history-image-container">
                    <img 
                      src={item.image_url} 
                      alt="Analysis" 
                      className="history-image"
                    />
                    <div className="history-overlay">
                      <div className="confidence-indicator" style={{ 
                        backgroundColor: getConfidenceColor(item.result.top_prediction?.confidence || 0)
                      }}>
                        {(item.result.top_prediction?.confidence || 0 * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="history-info">
                    <div className="history-result">
                      <span className="result-label">Diagnostic:</span>
                      <span className="result-value">{item.result.top_prediction?.class}</span>
                    </div>
                    <div className="history-meta">
                      <div className="confidence-item">
                        <span className="meta-mini-icon">🎯</span>
                        {(item.result.top_prediction?.confidence || 0 * 100).toFixed(1)}%
                      </div>
                      <div className="date-item">
                        <span className="meta-mini-icon">📅</span>
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
