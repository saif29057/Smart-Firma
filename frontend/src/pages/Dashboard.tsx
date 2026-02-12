import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/messagingService';

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
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {user?.first_name} {user?.last_name}!</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📧 Messagerie</h3>
          <div className="card-content">
            <p>Vous avez {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</p>
            <button className="btn btn-primary">Voir la messagerie</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>🌤️ Météo</h3>
          <div className="card-content">
            <p>Consultez la météo actuelle et les prévisions</p>
            <button className="btn btn-secondary">Voir la météo</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>💬 Chatbot</h3>
          <div className="card-content">
            <p>Discutez avec notre assistant intelligent</p>
            <button className="btn btn-secondary">Ouvrir le chatbot</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>🔍 Analyse de maladie probable</h3>
          <div className="card-content">
            <p>Analysez des images avec l'IA</p>
            <button className="btn btn-secondary">Commencer l'analyse</button>
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
