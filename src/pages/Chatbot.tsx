import React, { useState, useEffect, useRef } from 'react';
import { newsService, Article } from '../services/newsService';
import { messagingService, SendMessageData } from '../services/messagingService';
import { chatbotService, ChatMessage as ChatHistoryMessage } from '../services/chatbotService';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ModernChatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'news' | 'message';
}

const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [currentNews, setCurrentNews] = useState<Article[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Message de bienvenue spécialisé agriculture
    setMessages([
      {
        id: 1,
        text: '🌱 Bonjour ! Je suis votre assistant agricole Smart Firma, spécialisé pour l\'agriculture tunisienne. Je peux vous aider avec les cultures, l\'irrigation, les prévisions météo, et bien plus encore. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      // Utiliser l'API OpenAI pour une réponse intelligente
      const response = await chatbotService.sendMessage(userMessage);
      return response.response;
    } catch (error) {
      console.error('Error calling AI service:', error);
      
      // Fallback vers les réponses prédéfinies en cas d'erreur
      const message = userMessage.toLowerCase();
      
      if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
        return 'Bonjour ! Je suis votre assistant agricole Smart Firma. Comment puis-je vous aider aujourd\'hui ?';
      }
      
      if (message.includes('actualité') || message.includes('news') || message.includes('nouvelles')) {
        return 'Je peux vous montrer les dernières actualités. Voulez-vous voir les actualités générales ou une catégorie spécifique ?';
      }
      
      if (message.includes('météo') || message.includes('temps')) {
        return 'Pour la météo, veuillez utiliser la page Météo dans le menu. Vous y trouverez les prévisions détaillées pour votre région.';
      }
      
      if (message.includes('aide') || message.includes('help')) {
        return 'Je suis votre assistant agricole spécialisé pour la Tunisie. Je peux vous aider avec :\n- Conseils sur les cultures (oliviers, céréales, agrumes)\n- Gestion de l\'irrigation\n- Prévisions météo et impact agricole\n- Maladies des plantes et traitements\n- Calendriers de plantation et récolte\n\nDemandez-moi ce que vous souhaitez savoir !';
      }
      
      return 'Désolé, je rencontre des difficultés techniques. Je suis votre assistant agricole spécialisé pour la Tunisie. Posez-moi vos questions sur l\'agriculture, les cultures, l\'irrigation ou les prévisions météo !';
    }
  };

  const fetchNews = async (category: string = 'general') => {
    try {
      const newsData = await newsService.getNews(category, 'fr', 5);
      setCurrentNews(newsData.articles);
      setShowNews(true);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const sendMessageToAdmin = async (subject: string, content: string) => {
    try {
      // Simuler l'envoi à un admin (ID 1)
      await messagingService.sendMessage({
        recipient_id: 1,
        subject,
        content
      });
      return 'Votre message a été envoyé à l\'administrateur avec succès.';
    } catch (error) {
      return 'Désolé, une erreur est survenue lors de l\'envoi du message.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await generateBotResponse(inputText);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // Si le bot a fetché des actualités, les afficher
      if (currentNews.length > 0 && showNews) {
        currentNews.forEach((article, index) => {
          const newsMessage: Message = {
            id: Date.now() + 2 + index,
            text: `📰 ${article.title}\n${article.description || ''}\n${article.url}`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'news'
          };
          setMessages(prev => [...prev, newsMessage]);
        });
        setShowNews(false);
        setCurrentNews([]);
      }

    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-page">
      {/* Hero Section */}
      <div className="chatbot-hero">
        <div className="hero-content">
          <div className="hero-avatar">
            <div className="avatar-icon">🌾</div>
            <div className="avatar-status online"></div>
          </div>
          <h1>Assistant Agricole IA</h1>
          <p className="hero-description">
            Votre expert personnel pour l'agriculture tunisienne. 
            Obtenez des conseils sur les cultures, l'irrigation, les maladies des plantes, et bien plus.
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">🌿</span>
              <span className="feature-text">Cultures tunisiennes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💧</span>
              <span className="feature-text">Gestion eau</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌤️</span>
              <span className="feature-text">Prévisions météo</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🦠</span>
              <span className="feature-text">Maladies plantes</span>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="floating-leaves">🍃</div>
          <div className="floating-seeds">🌰</div>
        </div>
      </div>

      <div className="chatbot-container modern-chat">
        <div className="chatbot-header modern-header">
          <div className="header-left">
            <div className="bot-avatar">
              <div className="avatar-circle">
                <span className="avatar-emoji">🌾</span>
                <div className="status-indicator online"></div>
              </div>
            </div>
            <div className="header-info">
              <h2>Dr. GreenThumb</h2>
              <p>Expert en agriculture tunisienne</p>
            </div>
          </div>
          <div className="header-right">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span className="status-text">En ligne</span>
            </div>
            <div className="response-time">
              <span className="time-icon">⚡</span>
              <span>Réponse IA instantanée</span>
            </div>
          </div>
        </div>

        <div className="chatbot-messages modern-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message modern-user-message' : 'bot-message modern-bot-message'}`}
            >
              {message.sender === 'user' ? (
                <div className="user-avatar">
                  <div className="avatar-circle user-avatar-circle">
                    <span className="avatar-emoji">👨‍🌾</span>
                  </div>
                </div>
              ) : (
                <div className="bot-avatar">
                  <div className="avatar-circle bot-avatar-circle">
                    <span className="avatar-emoji">🌾</span>
                    <div className="status-indicator online"></div>
                  </div>
                </div>
              )}
              
              <div className="message-content modern-message-content">
                {message.type === 'news' ? (
                  <div className="news-message modern-news">
                    {message.text.split('\n').map((line, index) => (
                      <div key={index}>
                        {line.startsWith('📰') ? (
                          <div className="news-header">
                            <span className="news-icon">📰</span>
                            <strong>{line.substring(2)}</strong>
                          </div>
                        ) : line.startsWith('http') ? (
                          <a href={line} target="_blank" rel="noopener noreferrer" className="news-link">
                            <span className="link-icon">🔗</span>
                            Lire la suite
                          </a>
                        ) : (
                          <p className="news-text">{line}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="message-text modern-message-text">
                    {message.text}
                  </div>
                )}
                <div className="message-meta modern-message-meta">
                  <span className="message-time">
                    <span className="time-icon">🕐</span>
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {message.sender === 'bot' && (
                    <div className="ai-indicator">
                      <span className="ai-icon">🤖</span>
                      <span className="ai-text">IA</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot-message modern-bot-message">
              <div className="message-content modern-message-content">
                <div className="typing-indicator modern-typing">
                  <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                  <div className="typing-text">
                    <span className="typing-icon">💭</span>
                    <span>L'IA réfléchit...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input modern-input">
          <div className="input-container modern-input-container">
            <div className="input-wrapper">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur l'agriculture tunisienne..."
                className="message-input modern-message-input"
                rows={1}
                disabled={isLoading}
              />
              <div className="input-suggestions">
                <span className="suggestion-tag">🌿 cultures</span>
                <span className="suggestion-tag">💧 irrigation</span>
                <span className="suggestion-tag">🦠 maladies</span>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="send-button modern-send-button"
            >
              <span className="send-icon">🚀</span>
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
