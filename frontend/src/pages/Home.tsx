import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="home-page-modern">
      <div className="hero-section-modern">
        <div className="hero-background">
          <div className="hero-particles"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content-modern">
          <div className="hero-text">
            <h1 className="hero-title">
              Bienvenue sur <span className="brand-highlight">Smart Firma</span>
            </h1>
            <p className="hero-subtitle">
              La plateforme intelligente qui transforme votre gestion d'entreprise
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Utilisateurs actifs</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime garanti</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support disponible</div>
              </div>
            </div>
          </div>
          
          <div className="hero-actions-modern">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn-hero btn-primary-modern">
                  <span className="btn-icon">✨</span>
                  <span>Commencer gratuitement</span>
                </Link>
                <Link to="/login" className="btn-hero btn-secondary-modern">
                  <span className="btn-icon">🔑</span>
                  <span>Se connecter</span>
                </Link>
              </>
            ) : (
              <Link 
                to={isAdmin ? "/admin-dashboard" : "/dashboard"} 
                className="btn-hero btn-primary-modern"
              >
                <span className="btn-icon">📊</span>
                <span>Tableau de bord</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="features-section-modern">
        <div className="section-header">
          <h2 className="section-title">Fonctionnalités révolutionnaires</h2>
          <p className="section-subtitle">
            Découvrez notre suite d'outils intelligents conçus pour booster votre productivité
          </p>
        </div>
        
        <div className="features-grid-modern">
          <div className="feature-card-modern">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🌤️</span>
              <div className="feature-bg"></div>
            </div>
            <h3 className="feature-title">Météo Précise</h3>
            <p className="feature-description">
              Accédez à des prévisions météorologiques en temps réel avec une précision exceptionnelle pour optimiser votre planning
            </p>
            <Link to="/weather" className="feature-link">
              <span>Explorer</span>
              <span className="link-arrow">→</span>
            </Link>
          </div>
          
          <div className="feature-card-modern">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">💬</span>
              <div className="feature-bg"></div>
            </div>
            <h3 className="feature-title">Chatbot IA</h3>
            <p className="feature-description">
              Assistant intelligent powered by AI pour répondre à vos questions et vous tenir informé des dernières actualités
            </p>
            <Link to="/chatbot" className="feature-link">
              <span>Discuter</span>
              <span className="link-arrow">→</span>
            </Link>
          </div>
          
          <div className="feature-card-modern">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🔍</span>
              <div className="feature-bg"></div>
            </div>
            <h3 className="feature-title">Analyse de maladie probable</h3>
            <p className="feature-description">
              Classification avancée d'images avec Deep Learning pour des analyses rapides et précises
            </p>
            <Link to="/analysis" className="feature-link">
              <span>Analyser</span>
              <span className="link-arrow">→</span>
            </Link>
          </div>
          
          <div className="feature-card-modern">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📧</span>
              <div className="feature-bg"></div>
            </div>
            <h3 className="feature-title">Messagerie Secure</h3>
            <p className="feature-description">
              Communication interne cryptée et efficace pour une collaboration sans faille
            </p>
            <Link to="/dashboard" className="feature-link">
              <span>Communiquer</span>
              <span className="link-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="about-section-modern">
        <div className="about-container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title">
                L'innovation au service de votre entreprise
              </h2>
              <p className="about-description">
                Smart Firma représente la nouvelle génération de plateformes de gestion d'entreprise. 
                En intégrant les technologies les plus avancées de l'intelligence artificielle, 
                nous offrons une expérience utilisateur sans précédent qui transforme radicalement 
                votre façon de travailler.
              </p>
              <div className="about-highlights">
                <div className="highlight-item">
                  <span className="highlight-icon">⚡</span>
                  <div>
                    <strong>Ultra-rapide</strong>
                    <p>Performances optimisées pour une utilisation fluide</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">🔒</span>
                  <div>
                    <strong>Sécurité maximale</strong>
                    <p>Vos données protégées par un chiffrement de bout en bout</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">🌍</span>
                  <div>
                    <strong>Accessible partout</strong>
                    <p>Interface responsive pour tous vos appareils</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="visual-card">
                <img src="/smartfirma-logo.png" alt="Smart Firma" className="about-logo" />
                <div className="visual-stats">
                  <div className="visual-stat">
                    <div className="stat-circle">
                      <span className="stat-value">100%</span>
                    </div>
                    <span className="stat-name">Satisfaction</span>
                  </div>
                  <div className="visual-stat">
                    <div className="stat-circle">
                      <span className="stat-value">5★</span>
                    </div>
                    <span className="stat-name">Qualité</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section-modern">
        <div className="cta-content">
          <h2 className="cta-title">Prêt à révolutionner votre entreprise ?</h2>
          <p className="cta-subtitle">
            Rejoignez des milliers d'entreprises qui font déjà confiance à Smart Firma
          </p>
          <div className="cta-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn-cta btn-primary-cta">
                  <span>Essayer gratuitement</span>
                  <span className="btn-arrow">→</span>
                </Link>
                <Link to="/login" className="btn-cta btn-secondary-cta">
                  Se connecter
                </Link>
              </>
            ) : (
              <Link 
                to={isAdmin ? "/admin-dashboard" : "/dashboard"} 
                className="btn-cta btn-primary-cta"
              >
                <span>Accéder au tableau de bord</span>
                <span className="btn-arrow">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
