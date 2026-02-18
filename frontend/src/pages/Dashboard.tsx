import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/messagingService';
import { Link , useNavigate } from 'react-router-dom';

// Données cultures tunisiennes pour le dashboard
const TUNISIA_STATS = [
  { culture: 'Blé Dur', production: '1.2M tonnes', rank: '#1 Mondial', icon: '🌾', color: '#f59e0b' },
  { culture: 'Olives', production: '350K tonnes', rank: '#4 Mondial', icon: '🫒', color: '#16a34a' },
  { culture: 'Dattes', production: '280K tonnes', rank: '#1 Export', icon: '🌴', color: '#dc2626' },
  { culture: 'Agrumes', production: '450K tonnes', rank: 'Cap Bon', icon: '🍊', color: '#ea580c' }
];

const QUICK_LOCATIONS = [
  { name: 'Tunis', region: 'Nord', icon: '🏛️' },
  { name: 'Sfax', region: 'Centre-Est', icon: '🏭' },
  { name: 'Sousse', region: 'Est', icon: '🏖️' },
  { name: 'Kairouan', region: 'Centre', icon: '🕌' },
  { name: 'Gabès', region: 'Sud-Est', icon: '🌴' },
  { name: 'Tozeur', region: 'Sud-Ouest', icon: '🏜️' },
  { name: 'Nabeul', region: 'Cap Bon', icon: '🍊' },
  { name: 'Gafsa', region: 'Sud-Ouest', icon: '⛏️' }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await messagingService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnreadCount();
  }, []);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord Agriculteur</h1>
        <p>Bienvenue, {user?.first_name} {user?.last_name}! 👨‍🌾</p>
        <span className="location-badge">🇹🇳 Tunisie</span>
      </div>

      {/* Stats cultures tunisiennes */}
      <div className="tunisia-stats-section">
        <h2>🌾 Agriculture Tunisienne en chiffres</h2>
        <div className="stats-grid">
          {TUNISIA_STATS.map((stat, idx) => (
            <div key={idx} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
              <span className="stat-icon">{stat.icon}</span>
              <div className="stat-info">
                <h4>{stat.culture}</h4>
                <p className="stat-value">{stat.production}</p>
                <span className="stat-rank">{stat.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card featured">
          <div className="card-badge">Nouveau</div>
          <h3>🌾 Recommandation Culture</h3>
          <div className="card-content">
            <p>IA spécialisée pour les cultures tunisiennes (Blé dur, Olives, Dattes...)</p>
            <div className="crop-preview">
              <span>🌾</span>
              <span>🫒</span>
              <span>🌴</span>
              <span>🍊</span>
            </div>
            <Link to="/recommendation">
              <button className="btn btn-primary">Obtenir une recommandation</button>
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>📧 Messagerie</h3>
          <div className="card-content">
            <p>Vous avez {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</p>
            <Link to="/messages">
              <button className="btn btn-primary">Voir la messagerie</button>
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>🌤️ Météo Tunisie</h3>
          <div className="card-content">
            <p>Prévisions pour votre région agricole</p>
            <div className="weather-mini">
              <span>☀️</span>
              <span>🌧️</span>
              <span>💨</span>
            </div>
            <Link to="/weather">
              <button className="btn btn-secondary">Consulter la météo</button>
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>💬 Assistant Agricole</h3>
          <div className="card-content">
            <p>Conseils pour vos cultures tunisiennes</p>
            <Link to="/chatbot">
              <button className="btn btn-secondary">Discuter avec l'IA</button>
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>🔍 Diagnostic Maladies</h3>
          <div className="card-content">
            <p>Identification des maladies des cultures locales</p>
            <Link to="/analysis">
              <button className="btn btn-secondary">Analyser une photo</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-section zones-section">
        <h2>🗺️ Zones Agro-écologiques de Tunisie</h2>
        <div className="zones-grid">
          <div className="zone-card nord">
            <h4>🌲 Nord</h4>
            <p>+400mm/an</p>
            <span>Blé tendre, Olives, Agrumes</span>
          </div>
          <div className="zone-card centre">
            <h4>🌾 Centre</h4>
            <p>250-400mm/an</p>
            <span>Blé dur, Orge, Olives</span>
          </div>
          <div className="zone-card sud">
            <h4>🌴 Sud</h4>
            <p>&lt;250mm/an</p>
            <span>Dattes, Amandiers, Figuier de Barbarie</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Informations du compte</h2>
        <div className="profile-info">
          <div className="info-row">
            <strong>Nom d'utilisateur:</strong> {user?.username}
          </div>
          <div className="info-row">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="info-row">
            <strong>Téléphone:</strong> {user?.phone || 'Non renseigné'}
          </div>
          <div className="info-row">
            <strong>Rôle:</strong> {user?.role}
          </div>
          <div className="info-row">
            <strong>Date d'inscription:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;