import React, { useState, useRef } from 'react';
import { analysisService, AnalysisLog, Prediction } from '../services/analysisService';

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
      <div className="analysis-header">
        <h1>🔍 Analyse de maladie probable</h1>
        <p>Téléchargez une image pour l'analyser avec notre IA</p>
      </div>

      <div className="analysis-content">
        <div className="upload-section">
          <div className="upload-card">
            <h2>Télécharger une image</h2>
            
            <div className="upload-area">
              {previewUrl ? (
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                  <button onClick={handleReset} className="btn btn-secondary reset-btn">
                    Changer d'image
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">📷</div>
                  <p>Cliquez pour sélectionner une image</p>
                  <p className="upload-hint">PNG, JPG, GIF jusqu'à 10MB</p>
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

            {error && <div className="alert alert-error">{error}</div>}

            {selectedImage && (
              <div className="upload-actions">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="btn btn-primary analyze-btn"
                >
                  {isAnalyzing ? 'Analyse en cours...' : 'Analyser l\'image'}
                </button>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="results-section">
            <div className="results-card">
              <h2>Résultats de l'analyse</h2>
              
              <div className="result-summary">
                <div className="top-prediction">
                  <h3>Prediction principale</h3>
                  <div className="prediction-item main">
                    <span className="class-name">{result.result.top_prediction.class}</span>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ 
                          width: `${result.result.top_prediction.confidence * 100}%`,
                          backgroundColor: getConfidenceColor(result.result.top_prediction.confidence)
                        }}
                      ></div>
                    </div>
                    <span className="confidence-value">
                      {(result.result.top_prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="all-predictions">
                  <h3>Toutes les predictions</h3>
                  {result.result.predictions.map((prediction: Prediction, index: number) => (
                    <div key={index} className="prediction-item">
                      <span className="rank">#{prediction.rank}</span>
                      <span className="class-name">{prediction.class}</span>
                      <div className="confidence-bar">
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
                  ))}
                </div>
              </div>

              <div className="analysis-meta">
                <div className="meta-item">
                  <span className="label">Confiance globale:</span>
                  <span className="value">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="meta-item">
                  <span className="label">Temps de traitement:</span>
                  <span className="value">{formatTime(result.processing_time)}</span>
                </div>
                <div className="meta-item">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(result.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h2>Historique des analyses</h2>
            <div className="history-grid">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <img 
                    src={item.image_url} 
                    alt="Analysis" 
                    className="history-image"
                  />
                  <div className="history-info">
                    <div className="history-result">
                      {item.result.top_prediction?.class}
                    </div>
                    <div className="history-confidence">
                      {(item.result.top_prediction?.confidence || 0 * 100).toFixed(1)}%
                    </div>
                    <div className="history-date">
                      {new Date(item.created_at).toLocaleDateString('fr-FR')}
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
