import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { messagingService } from '../services/messagingService';
import { Link } from 'react-router-dom';
import './Dashboard.css';


/* ─── Data ─────────────────────────────────────────────── */

const TUNISIA_STATS = [
  { label: 'Blé dur',  value: '1,2M t',  rank: '#1 Mondial', icon: '🌾', accent: '#d97706' },
  { label: 'Olives',   value: '350K t',  rank: '#4 Mondial', icon: '🫒', accent: '#16a34a' },
  { label: 'Dattes',   value: '280K t',  rank: '#1 Export',  icon: '🌴', accent: '#dc2626' },
  { label: 'Agrumes',  value: '450K t',  rank: 'Cap Bon',    icon: '🍊', accent: '#2563eb' },
];

const CROP_PILLS = ['🌾 Blé dur', '🫒 Olives', '🌴 Dattes', '🍊 Agrumes'];

const ZONES = [
  { label: 'Nord',   rain: '+400 mm/an',    crops: 'Blé tendre · Olives · Agrumes', cls: 'nord'   },
  { label: 'Centre', rain: '250–400 mm/an', crops: 'Blé dur · Orge · Olives',       cls: 'centre' },
  { label: 'Sud',    rain: '<250 mm/an',    crops: 'Dattes · Amandiers · Figuier',  cls: 'sud'    },
];

/* ─── Component ─────────────────────────────────────────── */

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading]     = useState(true);

  useEffect(() => {
    messagingService.getUnreadCount()
      .then(setUnreadCount)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="dash-loading">Chargement…</div>;

  return (
    <div className="dash">

      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Tableau de bord</h1>
          <p className="dash-subtitle">
            Bienvenue, <strong>{user?.first_name} {user?.last_name}</strong> — bonne journée !
          </p>
          <span className="badge-tn">🇹🇳 Tunisie</span>
        </div>
        <Link to="/messages" className="btn btn-outline header-msg-btn">
          ✉&nbsp; {unreadCount} message{unreadCount !== 1 ? 's' : ''}
        </Link>
      </div>

      {/* ── Stats ── */}
      <h2 className="section-title">Agriculture tunisienne en chiffres</h2>
      <div className="stats-row">
        {TUNISIA_STATS.map((s) => (
          <div key={s.label} className="stat-card" style={{ borderTopColor: s.accent }}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-rank">{s.rank}</span>
          </div>
        ))}
      </div>

      {/* ── Feature cards ── */}
      <h2 className="section-title">Fonctionnalités</h2>
      <div className="main-grid">

        <div className="card card-featured">
          <div className="card-header">
            <h3 className="card-title">Recommandation de culture</h3>
            <span className="badge-new">Nouveau</span>
          </div>
          <p className="card-body">
            IA spécialisée pour les cultures tunisiennes — blé dur, olives, dattes et plus.
          </p>
          <div className="crop-pills">
            {CROP_PILLS.map((c) => (
              <span key={c} className="crop-pill">{c}</span>
            ))}
          </div>
          <Link to="/recommendation" className="btn btn-primary">
            Obtenir une recommandation
          </Link>
        </div>

        <div className="card">
          <h3 className="card-title">Messagerie</h3>
          <div className="msg-count">{unreadCount}</div>
          <p className="msg-sub">message{unreadCount !== 1 ? 's' : ''} non lu{unreadCount !== 1 ? 's' : ''}</p>
          <Link to="/messages" className="btn btn-outline">Voir la messagerie</Link>
        </div>

        <div className="card">
          <h3 className="card-title">Météo Tunisie</h3>
          <p className="card-body">Prévisions pour votre région agricole.</p>
          <Link to="/weather" className="btn btn-outline">Consulter</Link>
        </div>

        <div className="card">
          <h3 className="card-title">Assistant agricole</h3>
          <p className="card-body">Conseils personnalisés pour vos cultures locales.</p>
          <Link to="/chatbot" className="btn btn-outline">Discuter avec l'IA</Link>
        </div>

        <div className="card">
          <h3 className="card-title">Diagnostic maladies</h3>
          <p className="card-body">Identification des maladies par photo.</p>
          <Link to="/analysis" className="btn btn-outline">Analyser une photo</Link>
        </div>

      </div>

      {/* ── Zones ── */}
      <h2 className="section-title">Zones agro-écologiques</h2>
      <div className="zones-grid">
        {ZONES.map((z) => (
          <div key={z.label} className={`zone-card zone-${z.cls}`}>
            <h4 className="zone-title">{z.label}</h4>
            <div className="zone-rain">{z.rain}</div>
            <p className="zone-crops">{z.crops}</p>
          </div>
        ))}
      </div>

      {/* ── Profile ── */}
      <h2 className="section-title">Mon compte</h2>
      <div className="profile-card">
        {([
          ["Nom d'utilisateur", user?.username],
          ['Email',             user?.email],
          ['Téléphone',         user?.phone || 'Non renseigné'],
          ['Rôle',              user?.role],
          ['Membre depuis',     user?.created_at
            ? new Date(user.created_at).toLocaleDateString('fr-FR')
            : 'N/A'],
        ] as [string, string | undefined][]).map(([label, val]) => (
          <div key={label} className="profile-row">
            <span className="profile-label">{label}</span>
            <span className="profile-value">{val}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;


