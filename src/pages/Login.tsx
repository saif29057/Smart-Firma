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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5ede0 0%, #e8d5b7 40%, #6b4c2a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'inherit',
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '900px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(107, 76, 42, 0.3)',
      }}>

        {/* Panneau gauche - Formulaire */}
        <div style={{
          flex: 1,
          backgroundColor: '#fffdf9',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <img src="/smartfirma-logo.png" alt="Smart Firma" style={{ width: '80px', marginBottom: '1rem' }} />
          <h2 style={{ color: '#3d2b1a', fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.3rem' }}>
            Connexion
          </h2>
          <p style={{ color: '#8a6a4a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Accédez à votre espace personnel Smart Firma
          </p>

          {error && (
            <div style={{
              width: '100%',
              background: '#fff0f0',
              border: '1px solid #ffcccc',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              color: '#c0392b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
            }}>
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ color: '#6b4c2a', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>👤</span> Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Entrez votre nom d'utilisateur"
                style={{
                  padding: '0.75rem 1rem',
                  border: '1.5px solid #d4b896',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: '#fdf8f3',
                  color: '#3d2b1a',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ color: '#6b4c2a', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🔒</span> Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Entrez votre mot de passe"
                style={{
                  padding: '0.75rem 1rem',
                  border: '1.5px solid #d4b896',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: '#fdf8f3',
                  color: '#3d2b1a',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '0.85rem',
                background: isLoading ? '#c4a882' : 'linear-gradient(135deg, #8B5E3C, #6b4c2a)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'opacity 0.2s',
              }}
            >
              {isLoading ? (
                <><span>⏳</span><span>Connexion en cours...</span></>
              ) : (
                <><span>🚀</span><span>Se connecter</span></>
              )}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', color: '#8a6a4a', fontSize: '0.9rem' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: '#8B5E3C', fontWeight: 600, textDecoration: 'none' }}>
              Créer un compte gratuitement
            </Link>
          </p>

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0', color: '#c4a882' }}>
            <div style={{ flex: 1, height: '1px', background: '#e8d5b7' }} />
            <span style={{ fontSize: '0.85rem' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#e8d5b7' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <button style={{
              flex: 1, padding: '0.6rem', border: '1.5px solid #d4b896', borderRadius: '10px',
              background: '#fdf8f3', color: '#6b4c2a', cursor: 'pointer', fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}>
              <span>🌐</span> Google
            </button>
            <button style={{
              flex: 1, padding: '0.6rem', border: '1.5px solid #d4b896', borderRadius: '10px',
              background: '#fdf8f3', color: '#6b4c2a', cursor: 'pointer', fontWeight: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            }}>
              <span>🐙</span> GitHub
            </button>
          </div>
        </div>

        {/* Panneau droit - Info */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(160deg, #6b4c2a 0%, #3d2b1a 100%)',
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#f5ede0',
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f5ede0' }}>
            Rejoignez l'avenir de la gestion agricole
          </h3>
          <p style={{ color: '#d4b896', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Smart Firma vous accompagne au quotidien
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
            {[
              { icon: '🌤️', label: 'Météo en temps réel' },
              { icon: '💬', label: 'Agro Assistant' },
              { icon: '🔍', label: 'Analyse d\'images IA' },
              { icon: '📧', label: 'PlantCare AI' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '10px',
                borderLeft: '3px solid #d4a853',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{f.icon}</span>
                <span style={{ color: '#f5ede0', fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d4a853' }}>1000+</div>
              <div style={{ fontSize: '0.8rem', color: '#d4b896' }}>Utilisateurs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d4a853' }}>99.9%</div>
              <div style={{ fontSize: '0.8rem', color: '#d4b896' }}>Uptime</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;