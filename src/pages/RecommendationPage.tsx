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
          <h1>🌾 Smart-Firma Tunisie</h1>
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

      <RecommendationForm />

      <style>{`
        .recommendation-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5ede0 0%, #e8d5b7 50%, #d4b896 100%);
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #6b4c2a 0%, #3d2b1a 100%);
          border-radius: 24px;
          color: #f5ede0;
          box-shadow: 0 20px 40px rgba(107, 76, 42, 0.35);
        }

        .header-content h1 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          color: #f5ede0;
        }

        .subtitle {
          margin: 0.75rem 0;
          font-size: 1.1rem;
          opacity: 0.9;
          color: #d4b896;
        }

        .tunisia-badge {
          display: inline-block;
          background: rgba(212, 168, 83, 0.25);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid rgba(212, 168, 83, 0.5);
          margin-top: 0.5rem;
          color: #d4a853;
        }

        .location-context {
          max-width: 900px;
          margin: 0 auto 1.5rem;
        }

        .selected-location {
          background: #fffdf9;
          padding: 1.25rem 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(107, 76, 42, 0.15);
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          border-left: 4px solid #8B5E3C;
        }

        .location-label {
          color: #8a6a4a;
          font-size: 0.9rem;
        }

        .selected-location strong {
          color: #3d2b1a;
          font-size: 1.25rem;
        }

        .location-hint {
          color: #6b4c2a;
          font-size: 0.85rem;
          background: #f5ede0;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          margin-left: auto;
          border: 1px solid #d4b896;
          font-weight: 500;
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