import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate(formData.username === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-modern">
      <div className="auth-background">
        <div className="auth-particles"></div>
        <div className="auth-gradient"></div>
      </div>
      
      <div className="auth-container-modern">
        <div className="auth-card-modern">
          <div className="auth-header-modern">
            <div className="auth-logo">
              <img src="/smartfirma-logo.png" alt="Smart Firma" className="auth-logo-img" />
            </div>
            <h2 className="auth-title">Connexion</h2>
            <p className="auth-subtitle">
              Accédez à votre espace personnel Smart Firma
            </p>
          </div>
          
          {error && (
            <div className="alert-modern alert-error-modern">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form-modern">
            <div className="form-group-modern">
              <label htmlFor="username" className="form-label-modern">
                <span className="label-icon">👤</span>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input-modern"
                placeholder="Entrez votre nom d'utilisateur"
              />
            </div>
            
            <div className="form-group-modern">
              <label htmlFor="password" className="form-label-modern">
                <span className="label-icon">🔒</span>
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input-modern"
                placeholder="Entrez votre mot de passe"
              />
            </div>
            
            <button 
              type="submit" 
              className="btn-auth btn-primary-auth" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>
          
          <div className="auth-footer-modern">
            <p className="auth-question">
              Pas encore de compte?{' '}
              <Link to="/register" className="auth-link-modern">
                Créer un compte gratuitement
              </Link>
            </p>
            <div className="auth-divider">
              <span>ou</span>
            </div>
            <div className="auth-social">
              <p className="social-text">Continuer avec</p>
              <div className="social-buttons">
                <button className="social-btn google-btn">
                  <span className="social-icon">🌐</span>
                  Google
                </button>
                <button className="social-btn github-btn">
                  <span className="social-icon">🐙</span>
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="auth-side-info">
          <div className="side-content">
            <h3 className="side-title">Rejoignez l'avenir de la gestion d'entreprise</h3>
            <ul className="side-features">
              <li className="side-feature">
                <span className="feature-icon">🌤️</span>
                <span>Météo en temps réel</span>
              </li>
              <li className="side-feature">
                <span className="feature-icon">💬</span>
                <span>Chatbot intelligent</span>
              </li>
              <li className="side-feature">
                <span className="feature-icon">🔍</span>
                <span>Analyse d'images IA</span>
              </li>
              <li className="side-feature">
                <span className="feature-icon">📧</span>
                <span>Messagerie sécurisée</span>
              </li>
            </ul>
            <div className="side-stats">
              <div className="side-stat">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Utilisateurs</div>
              </div>
              <div className="side-stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
