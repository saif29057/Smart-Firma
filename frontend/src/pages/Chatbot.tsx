import React, { useState, useEffect, useRef } from 'react';
import { newsService, Article } from '../services/newsService';
import { messagingService, SendMessageData } from '../services/messagingService';
import { useAuth } from '../contexts/AuthContext';

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
    // Message de bienvenue
    setMessages([
      {
        id: 1,
        text: 'Bonjour ! Je suis votre assistant Smart Firma. Comment puis-je vous aider ?',
        sender: 'bot',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Réponses prédéfinies
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
    }
    
    if (message.includes('actualité') || message.includes('news') || message.includes('nouvelles')) {
      return 'Je peux vous montrer les dernières actualités. Voulez-vous voir les actualités générales ou une catégorie spécifique (sport, technologie, santé, etc.) ?';
    }
    
    if (message.includes('météo') || message.includes('temps')) {
      return 'Pour la météo, veuillez utiliser la page Météo dans le menu. Vous y trouverez les prévisions détaillées.';
    }
    
    if (message.includes('aide') || message.includes('help')) {
      return 'Je peux vous aider avec :\n- Consulter les actualités\n- Envoyer un message à l\'administrateur\n- Répondre à vos questions sur Smart Firma\n\nDites-moi ce que vous souhaitez faire !';
    }
    
    if (message.includes('message') || message.includes('contact') || message.includes('admin')) {
      return 'Je peux vous aider à envoyer un message à l\'administrateur. Quel est le sujet de votre message ?';
    }
    
    if (message.includes('sport')) {
      await fetchNews('sports');
      return 'Voici les dernières actualités sportives :';
    }
    
    if (message.includes('technologie') || message.includes('tech')) {
      await fetchNews('technology');
      return 'Voici les dernières actualités technologiques :';
    }
    
    if (message.includes('santé') || message.includes('health')) {
      await fetchNews('health');
      return 'Voici les dernières actualités santé :';
    }
    
    return 'Je ne suis pas sûr de comprendre. Pouvez-vous reformuler votre question ou demander de l\'aide ?';
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
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h2>💬 Assistant Smart Firma</h2>
          <div className="status-indicator">
            <span className="status-dot"></span>
            En ligne
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-content">
                {message.type === 'news' ? (
                  <div className="news-message">
                    {message.text.split('\n').map((line, index) => (
                      <div key={index}>
                        {line.startsWith('📰') ? (
                          <strong>{line}</strong>
                        ) : line.startsWith('http') ? (
                          <a href={line} target="_blank" rel="noopener noreferrer">
                            Lire la suite
                          </a>
                        ) : (
                          <p>{line}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{message.text}</p>
                )}
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="message-input"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className="send-button"
            >
              {isLoading ? '...' : 'Envoyer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
