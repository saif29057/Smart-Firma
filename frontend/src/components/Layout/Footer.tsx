import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-container-modern">
        <div className="footer-section-modern">
          <div className="footer-brand">
            <img 
              src="/smartfirma-logo.png" 
              alt="Smart Firma" 
              className="footer-logo"
            />
            <h3>Smart Firma</h3>
          </div>
          <p className="footer-description">
            Plateforme intelligente pour la gestion d'entreprise moderne
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <span className="social-icon">📘</span>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="social-icon">🐦</span>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <span className="social-icon">💼</span>
            </a>
            <a href="#" className="social-link" aria-label="GitHub">
              <span className="social-icon">🐙</span>
            </a>
          </div>
        </div>
        
        <div className="footer-section-modern">
          <h4 className="footer-title">🚀 Services</h4>
          <ul className="footer-links">
            <li><a href="/weather">Météo en temps réel</a></li>
            <li><a href="/chatbot">Chatbot intelligent</a></li>
            <li><a href="/analysis">Analyse de maladie probable</a></li>
            <li><a href="/dashboard">Messagerie interne</a></li>
          </ul>
        </div>
        
        <div className="footer-section-modern">
          <h4 className="footer-title">💡 Support</h4>
          <ul className="footer-links">
            <li><a href="#">Centre d'aide</a></li>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">Tutoriels</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section-modern">
          <h4 className="footer-title">⚖️ Légal</h4>
          <ul className="footer-links">
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">Confidentialité</a></li>
            <li><a href="#">CGU</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom-modern">
        <div className="footer-bottom-content">
          <p>&copy; 2024 Smart Firma. Tous droits réservés.</p>
          <div className="footer-bottom-links">
            <a href="#">Politique de confidentialité</a>
            <span className="separator">•</span>
            <a href="#">Conditions d'utilisation</a>
            <span className="separator">•</span>
            <a href="#">Accessibilité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
