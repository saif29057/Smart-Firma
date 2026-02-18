import React from 'react';
import RecommendationForm from '../components/RecommendationForm';
import { useSearchParams } from 'react-router-dom';

const RecommendationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location') || '';

  return (
    <div className="recommendation-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🌾 Smart-Farm Tunisia</h1>
          <p className="subtitle">Système de recommandation agricole adapté aux cultures tunisiennes</p>
          <span className="tunisia-badge">🇹🇳 Spécialisé Nord/Centre/Sud</span>
        </div>
      </div>

      <div className="location-context">
        {location && (
          <div className="selected-location">
            <span className="location-label">📍 Zone sélectionnée :</span>
            <strong>{location}</strong>
            <span className="location-hint">
              {getLocationHint(location)}
            </span>
          </div>
        )}
      </div>

      <RecommendationForm  />

      <style>{`
        .recommendation-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%);
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #1e3a5f 0%, #0f766e 100%);
          border-radius: 24px;
          color: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .header-content h1 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .subtitle {
          margin: 0.75rem 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .tunisia-badge {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.3);
          margin-top: 0.5rem;
        }

        .location-context {
          max-width: 900px;
          margin: 0 auto 1.5rem;
        }

        .selected-location {
          background: white;
          padding: 1.25rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          border-left: 4px solid #0f766e;
        }

        .location-label {
          color: #64748b;
          font-size: 0.9rem;
        }

        .selected-location strong {
          color: #0f172a;
          font-size: 1.25rem;
        }

        .location-hint {
          color: #059669;
          font-size: 0.85rem;
          background: #ecfdf5;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          margin-left: auto;
        }

        @media (max-width: 768px) {
          .recommendation-page {
            padding: 1rem;
          }
          
          .page-header {
            padding: 1.5rem;
          }
          
          .header-content h1 {
            font-size: 1.75rem;
          }
          
          .selected-location {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .location-hint {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Helper pour les hints par localité
function getLocationHint(location: string): string {
  const hints: {[key: string]: string} = {
    'tunis': 'Zone Nord - Olives & Agrumes',
    'sfax': 'Zone Centre-Est - Olives & Céréales',
    'sousse': 'Zone Est - Olives & Agrumes',
    'kairouan': 'Zone Centre - Blé dur & Orge',
    'gabès': 'Zone Sud-Est - Dattes',
    'tozeur': 'Zone Sud-Ouest - Dattes & Pêches',
    'gafsa': 'Zone Sud-Ouest - Dattes',
    'médenine': 'Zone Sud - Dattes & Amandiers',
    'nabeul': 'Cap Bon - Agrumes',
    'béja': 'Zone Nord-Ouest - Blé tendre & Olives',
    'jendouba': 'Zone Nord-Ouest - Olives',
    'le kef': 'Zone Nord-Ouest - Céréales',
    'siliana': 'Zone Nord-Ouest - Céréales',
    'kasserine': 'Zone Centre-Ouest - Blé dur',
    'sidi bouzid': 'Zone Centre - Blé dur',
    'kebili': 'Zone Sud - Dattes',
    'tataouine': 'Zone Sud - Dattes',
    'zaghouan': 'Zone Nord-Est - Olives',
    'ben arous': 'Zone Nord - Olives',
    'ariana': 'Zone Nord - Maraîchage',
    'manouba': 'Zone Nord - Olives'
  };
  
  return hints[location.toLowerCase()] || 'Zone agricole tunisienne';
}

export default RecommendationPage;