import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest('.user-dropdown')) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <>
      <nav className={`navbar-dynamic ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container-dynamic">
          {/* Logo et marque */}
          <Link to="/" className="navbar-brand-dynamic">
            <div className="logo-container">
              <img 
                src="/smartfirma-logo.png" 
                alt="Smart Firma" 
                className="navbar-logo-dynamic"
              />
              <div className="logo-glow"></div>
            </div>
            <span className="brand-text-dynamic">Smart Firma</span>
          </Link>

          {/* Menu de navigation desktop */}
          <div className="navbar-menu-dynamic desktop-menu">
            <Link 
              to="/" 
              className={`nav-item-dynamic ${isActive('/') ? 'active' : ''}`}
            >
              <div className="nav-icon-container">
                <span className="nav-icon-dynamic">🏠</span>
                <div className="icon-ripple"></div>
              </div>
              <span className="nav-text">Accueil</span>
              <div className="nav-indicator"></div>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/weather" 
                  className={`nav-item-dynamic ${isActive('/weather') ? 'active' : ''}`}
                >
                  <div className="nav-icon-container">
                    <span className="nav-icon-dynamic">🌤️</span>
                    <div className="icon-ripple"></div>
                  </div>
                  <span className="nav-text">Météo</span>
                  <div className="nav-indicator"></div>
                </Link>
                
                <Link 
                  to="/chatbot" 
                  className={`nav-item-dynamic ${isActive('/chatbot') ? 'active' : ''}`}
                >
                  <div className="nav-icon-container">
                    <span className="nav-icon-dynamic">💬</span>
                    <div className="icon-ripple"></div>
                  </div>
                  <span className="nav-text">Chatbot</span>
                  <div className="nav-indicator"></div>
                </Link>
                
                <Link 
                  to="/analysis" 
                  className={`nav-item-dynamic ${isActive('/analysis') ? 'active' : ''}`}
                >
                  <div className="nav-icon-container">
                    <span className="nav-icon-dynamic">🔍</span>
                    <div className="icon-ripple"></div>
                  </div>
                  <span className="nav-text">Analyse de maladie probable</span>
                  <div className="nav-indicator"></div>
                </Link>
              </>
            )}
          </div>

          {/* Section utilisateur */}
          <div className="navbar-auth-dynamic">
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button 
                  className="user-trigger-dynamic"
                  onClick={toggleUserMenu}
                >
                  <div className="user-avatar-dynamic">
                    <span className="avatar-text">
                      {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                    </span>
                    {isAdmin && <div className="admin-pulse"></div>}
                    <div className="avatar-ring"></div>
                  </div>
                  <div className="user-info-dynamic">
                    <span className="user-name-dynamic">
                      {user?.first_name} {user?.last_name}
                    </span>
                    {isAdmin && <span className="admin-badge-dynamic">Admin</span>}
                  </div>
                  <div className="dropdown-arrow">
                    <span className={`arrow-icon ${isUserMenuOpen ? 'rotated' : ''}`}>▼</span>
                  </div>
                </button>

                <div className={`dropdown-menu-dynamic ${isUserMenuOpen ? 'open' : ''}`}>
                  <Link 
                    to={isAdmin ? "/admin-dashboard" : "/dashboard"} 
                    className="dropdown-item-dynamic"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <span className="item-icon">📊</span>
                    <span className="item-text">Tableau de bord</span>
                    <div className="item-hover"></div>
                  </Link>
                  
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item-dynamic logout-item"
                  >
                    <span className="item-icon">🚪</span>
                    <span className="item-text">Déconnexion</span>
                    <div className="item-hover"></div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-links-dynamic">
                <Link to="/login" className="auth-link-dynamic login-btn">
                  <span className="auth-icon">🔑</span>
                  <span>Connexion</span>
                  <div className="auth-glow"></div>
                </Link>
                <Link to="/register" className="auth-link-dynamic register-btn">
                  <span className="auth-icon">✨</span>
                  <span>Inscription</span>
                  <div className="auth-glow"></div>
                </Link>
              </div>
            )}

            {/* Menu mobile toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div className={`mobile-menu-dynamic ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <div className="mobile-user-info">
                {isAuthenticated && (
                  <>
                    <div className="mobile-avatar">
                      {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="mobile-user-details">
                      <span className="mobile-user-name">
                        {user?.first_name} {user?.last_name}
                      </span>
                      {isAdmin && <span className="mobile-admin-badge">Admin</span>}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mobile-nav-items">
              <Link 
                to="/" 
                className={`mobile-nav-item ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">🏠</span>
                <span>Accueil</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/weather" 
                    className={`mobile-nav-item ${isActive('/weather') ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">🌤️</span>
                    <span>Météo</span>
                  </Link>
                  
                  <Link 
                    to="/chatbot" 
                    className={`mobile-nav-item ${isActive('/chatbot') ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">💬</span>
                    <span>Chatbot</span>
                  </Link>
                  
                  <Link 
                    to="/analysis" 
                    className={`mobile-nav-item ${isActive('/analysis') ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">🔍</span>
                    <span>Analyse de maladie probable</span>
                  </Link>
                  
                  <Link 
                    to={isAdmin ? "/admin-dashboard" : "/dashboard"} 
                    className={`mobile-nav-item ${isActive('/dashboard') || isActive('/admin-dashboard') ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">📊</span>
                    <span>Tableau de bord</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="mobile-nav-item logout-mobile"
                  >
                    <span className="mobile-nav-icon">🚪</span>
                    <span>Déconnexion</span>
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <Link 
                    to="/login" 
                    className="mobile-nav-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">🔑</span>
                    <span>Connexion</span>
                  </Link>
                  
                  <Link 
                    to="/register" 
                    className="mobile-nav-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">✨</span>
                    <span>Inscription</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay pour le menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
