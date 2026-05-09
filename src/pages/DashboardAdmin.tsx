import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/messagingService';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

const DashboardAdmin: React.FC = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unread, users] = await Promise.all([
          messagingService.getUnreadCount(),
          // Simuler l'appel API pour obtenir les utilisateurs
          fetch('http://localhost:8000/api/auth/users/').then(res => res.json())
        ]);
        setUnreadCount(unread);
        setTotalUsers(users.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord Administrateur</h1>
        <p>Bienvenue, {user?.first_name} {user?.last_name}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalUsers}</div>
          <div className="stat-label">Utilisateurs totaux</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{unreadCount}</div>
          <div className="stat-label">Messages non lus</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">5</div>
          <div className="stat-label">Services actifs</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">Uptime</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>👥 Gestion des utilisateurs</h3>
          <div className="card-content">
            <p>Gérez tous les utilisateurs de la plateforme</p>
            <button className="btn btn-primary">Gérer les utilisateurs</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>📧 Messagerie</h3>
          <div className="card-content">
            <p>Vous avez {unreadCount} message{unreadCount > 1 ? 's' : ''} non lu{unreadCount > 1 ? 's' : ''}</p>
            <button className="btn btn-secondary">Voir la messagerie</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>📊 Statistiques</h3>
          <div className="card-content">
            <p>Consultez les statistiques d'utilisation</p>
            <button className="btn btn-secondary">Voir les stats</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>⚙️ Paramètres</h3>
          <div className="card-content">
            <p>Configurez les paramètres système</p>
            <button className="btn btn-secondary">Paramètres</button>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Actions rapides</h2>
        <div className="quick-actions">
          <button className="btn btn-primary">Créer un utilisateur</button>
          <button className="btn btn-secondary">Envoyer une notification</button>
          <button className="btn btn-secondary">Vérifier les logs</button>
          <button className="btn btn-secondary">Sauvegarder la base</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
