import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ModernHome.css';

const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="home-page-agricole">
      {/* Hero Section Agricole */}
      <div className="hero-agricole">
        <div className="hero-background-agricole">
          <div className="floating-elements">
            <div className="floating-leaf">🍃</div>
            <div className="floating-seed">🌰</div>
            <div className="floating-sun">☀️</div>
            <div className="floating-tractor">🚜</div>
          </div>
          <div className="hero-gradient-agricole"></div>
        </div>
        
        <div className="hero-content-agricole">
          <div className="hero-text-agricole">
            <div className="brand-logo">
              <span className="logo-icon">🌾</span>
              <h1 className="hero-title-agricole">
                Smart <span className="brand-highlight-agricole">Firma</span>
              </h1>
            </div>
            <p className="hero-subtitle-agricole">
              La plateforme agricole intelligente qui révolutionne votre exploitation en Tunisie
            </p>
            
            <div className="hero-stats-agricole">
              <div className="stat-item-agricole">
                <div className="stat-icon">🌿</div>
                <div className="stat-content">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Cultures supportées</div>
                </div>
              </div>
              <div className="stat-item-agricole">
                <div className="stat-icon">🌍</div>
                <div className="stat-content">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Précision IA</div>
                </div>
              </div>
              <div className="stat-item-agricole">
                <div className="stat-icon">💧</div>
                <div className="stat-content">
                  <div className="stat-number">40%</div>
                  <div className="stat-label">Économie d'eau</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-actions-agricole">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn-agricole btn-primary-agricole">
                  <span className="btn-icon">🌱</span>
                  <span>Démarrer mon exploitation</span>
                </Link>
                <Link to="/login" className="btn-agricole btn-secondary-agricole">
                  <span className="btn-icon">🔑</span>
                  <span>Accéder à mon compte</span>
                </Link>
              </>
            ) : (
              <Link 
                to={isAdmin ? "/admin-dashboard" : "/dashboard"} 
                className="btn-agricole btn-primary-agricole"
              >
                <span className="btn-icon">📊</span>
                <span>Tableau de bord agricole</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section Agricole */}
      <div className="features-section-agricole">
        <div className="section-header-agricole">
          <h2 className="section-title-agricole">Outils Agricoles Intelligents</h2>
          <p className="section-subtitle-agricole">
            Découvrez notre suite d'outils spécialisés pour l'agriculture tunisienne moderne
          </p>
        </div>
        
        <div className="features-grid-agricole">
          <div className="feature-card-agricole">
            <div className="feature-icon-wrapper-agricole">
              <span className="feature-icon-agricole">🌤️</span>
              <div className="feature-bg-agricole"></div>
            </div>
            <h3 className="feature-title-agricole">Météo Agricole</h3>
            <p className="feature-description-agricole">
              Prévisions météo spécialisées pour optimiser vos semis, irrigations et récoltes en Tunisie
            </p>
            <Link to="/weather" className="feature-link-agricole">
              <span>Voir météo</span>
              <span className="link-arrow-agricole">→</span>
            </Link>
          </div>
          
          <div className="feature-card-agricole">
            <div className="feature-icon-wrapper-agricole">
              <span className="feature-icon-agricole">🌾</span>
              <div className="feature-bg-agricole"></div>
            </div>
            <h3 className="feature-title-agricole">Assistant Agricole IA</h3>
            <p className="feature-description-agricole">
              Expert IA spécialisé dans les cultures tunisiennes, maladies des plantes et bonnes pratiques agricoles
            </p>
            <Link to="/chatbot" className="feature-link-agricole">
              <span>Conseiller</span>
              <span className="link-arrow-agricole">→</span>
            </Link>
          </div>
          
          <div className="feature-card-agricole">
            <div className="feature-icon-wrapper-agricole">
              <span className="feature-icon-agricole">🦠</span>
              <div className="feature-bg-agricole"></div>
            </div>
            <h3 className="feature-title-agricole">Diagnostic Plantes</h3>
            <p className="feature-description-agricole">
              Détection instantanée des maladies et carences pour protéger vos cultures et optimiser les rendements
            </p>
            <Link to="/analysis" className="feature-link-agricole">
              <span>Diagnostic</span>
              <span className="link-arrow-agricole">→</span>
            </Link>
          </div>
          
          <div className="feature-card-agricole">
            <div className="feature-icon-wrapper-agricole">
              <span className="feature-icon-agricole">�</span>
              <div className="feature-bg-agricole"></div>
            </div>
            <h3 className="feature-title-agricole">Gestion Eau</h3>
            <p className="feature-description-agricole">
              Optimisation intelligente de l'irrigation pour économiser jusqu'à 40% d'eau et augmenter les rendements
            </p>
            <Link to="/dashboard" className="feature-link-agricole">
              <span>Gérer l'eau</span>
              <span className="link-arrow-agricole">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* About Section Agricole */}
      <div className="about-section-agricole">
        <div className="about-container-agricole">
          <div className="about-content-agricole">
            <div className="about-text-agricole">
              <h2 className="about-title-agricole">
                L'innovation agricole au service de l'exploitation tunisienne
              </h2>
              <p className="about-description-agricole">
                Smart Firma révolutionne l'agriculture moderne en Tunisie avec des technologies IA avancées.
                Nous aidons les agriculteurs à optimiser leurs rendements, économiser l'eau et protéger leurs cultures
                pour une exploitation plus durable et profitable.
              </p>
              <div className="about-highlights-agricole">
                <div className="highlight-item-agricole">
                  <span className="highlight-icon-agricole">🌿</span>
                  <div>
                    <strong>Cultures Tunisiennes</strong>
                    <p>Oliviers, céréales, agrumes adaptés au climat local</p>
                  </div>
                </div>
                <div className="highlight-item-agricole">
                  <span className="highlight-icon-agricole">�</span>
                  <div>
                    <strong>Économie d'Eau</strong>
                    <p>Irrigation intelligente pour réduire la consommation de 40%</p>
                  </div>
                </div>
                <div className="highlight-item-agricole">
                  <span className="highlight-icon-agricole">🦠</span>
                  <div>
                    <strong>Protection Cultures</strong>
                    <p>Détection précoce des maladies et traitements biologiques</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-visual-agricole">
              <div className="visual-card-agricole">
                <div className="agricole-logo">
                  <span className="logo-large">🌾</span>
                  <span className="logo-text">Smart Firma</span>
                </div>
                <div className="visual-stats-agricole">
                  <div className="visual-stat-agricole">
                    <div className="stat-circle-agricole">
                      <span className="stat-value-agricole">+30%</span>
                    </div>
                    <span className="stat-name-agricole">Rendement</span>
                  </div>
                  <div className="visual-stat-agricole">
                    <div className="stat-circle-agricole">
                      <span className="stat-value-agricole">-40%</span>
                    </div>
                    <span className="stat-name-agricole">Eau économisée</span>
                  </div>
                  <div className="visual-stat-agricole">
                    <div className="stat-circle-agricole">
                      <span className="stat-value-agricole">500+</span>
                    </div>
                    <span className="stat-name-agricole">Exploitations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section Agricole */}
      <div className="cta-section-agricole">
        <div className="cta-content-agricole">
          <h2 className="cta-title-agricole">Prêt à transformer votre exploitation agricole ?</h2>
          <p className="cta-subtitle-agricole">
            Rejoignez des centaines d'agriculteurs tunisiens qui optimisent déjà leur production avec Smart Firma
          </p>
          <div className="cta-actions-agricole">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn-cta-agricole btn-primary-cta-agricole">
                  <span className="btn-icon-agricole">🌱</span>
                  <span>Démarrer mon exploitation</span>
                  <span className="btn-arrow-agricole">→</span>
                </Link>
                <Link to="/login" className="btn-cta-agricole btn-secondary-cta-agricole">
                  <span className="btn-icon-agricole">🔑</span>
                  <span>Accéder à mon compte</span>
                </Link>
              </>
            ) : (
              <Link 
                to={isAdmin ? "/admin-dashboard" : "/dashboard"} 
                className="btn-cta-agricole btn-primary-cta-agricole"
              >
                <span className="btn-icon-agricole">📊</span>
                <span>Tableau de bord agricole</span>
                <span className="btn-arrow-agricole">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
