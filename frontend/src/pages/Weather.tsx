import React, { useState, useEffect } from 'react';
import { weatherService, WeatherData, WeatherForecast } from '../services/weatherService';
import { MapPin, Droplets, Wind, Thermometer, Sun, CloudRain } from 'lucide-react';

// Villes agricoles majeures de Tunisie
const TUNISIAN_CITIES = [
  'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Gabès', 'Tozeur', 
  'Gafsa', 'Médenine', 'Nabeul', 'Béja', 'Jendouba', 'Le Kef',
  'Siliana', 'Kasserine', 'Sidi Bouzid', 'Kebili', 'Tataouine'
];

const Weather: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [city, setCity] = useState('Tunis');
  const [inputCity, setInputCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError('');
    
    try {
      const [current, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName)
      ]);
      
      setCurrentWeather(current);
      setForecast(forecastData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la récupération des données météo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity);
      fetchWeather(inputCity);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Déterminer la zone agricole
  const getAgroZone = (cityName: string): { zone: string; color: string; cultures: string } => {
    const nord = ['tunis', 'nabeul', 'bizerte', 'béja', 'jendouba', 'le kef', 'siliana', 'ariana', 'ben arous', 'manouba', 'zaghouan'];
    const centre = ['kairouan', 'gafsa', 'kasserine', 'sidi bouzid'];
    const sud = ['sfax', 'gabès', 'tozeur', 'médenine', 'tataouine', 'kebili'];
    
    const lower = cityName.toLowerCase();
    if (nord.some(c => lower.includes(c))) return { 
      zone: 'Nord (Humide)', 
      color: '#3b82f6', 
      cultures: 'Blé tendre, Olives, Agrumes' 
    };
    if (centre.some(c => lower.includes(c))) return { 
      zone: 'Centre (Semi-aride)', 
      color: '#f59e0b', 
      cultures: 'Blé dur, Orge, Olives' 
    };
    if (sud.some(c => lower.includes(c))) return { 
      zone: 'Sud (Aride)', 
      color: '#dc2626', 
      cultures: 'Dattes, Amandiers, Figuier de Barbarie' 
    };
    return { zone: 'Tunisie', color: '#6b7280', cultures: 'Diverses cultures' };
  };

  const agroZone = getAgroZone(city);

  return (
    <div className="weather-page">
      <div className="weather-header">
        <div className="header-content">
          <h1>🌤️ Météo Agricole Tunisie</h1>
          <p className="subtitle">Prévisions pour vos cultures</p>
        </div>
        
        <form onSubmit={handleSubmit} className="city-search">
          <div className="search-wrapper">
            <MapPin size={20} className="search-icon" />
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Choisir une ville..."
              list="tunisian-cities"
              className="city-input"
            />
            <datalist id="tunisian-cities">
              {TUNISIAN_CITIES.map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
          <button type="submit" className="btn btn-primary">
            Rechercher
          </button>
        </form>
      </div>

      {/* Zone agricole indicator */}
      <div className="agro-zone-banner" style={{ backgroundColor: agroZone.color + '20', borderColor: agroZone.color }}>
        <div className="zone-info">
          <span className="zone-label">Zone agro-écologique:</span>
          <strong style={{ color: agroZone.color }}>{agroZone.zone}</strong>
        </div>
        <div className="zone-cultures">
          <span>Cultures principales: {agroZone.cultures}</span>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des données météo...</p>
        </div>
      )}
      
      {error && <div className="alert alert-error">{error}</div>}

      {currentWeather && (
        <div className="current-weather">
          <div className="weather-card main-card">
            <div className="weather-main">
              <div className="weather-info">
                <div className="location-header">
                  <h2>{currentWeather.city}</h2>
                  <span className="country-badge">Tunisie 🇹🇳</span>
                </div>
                <div className="temperature-display">
                  <img 
                    src={getWeatherIcon(currentWeather.icon)} 
                    alt={currentWeather.description}
                    className="weather-icon-large"
                  />
                  <div className="temp-value-container">
                    <span className="temp-value">{Math.round(currentWeather.temperature)}°</span>
                    <span className="temp-feels">Ressenti {Math.round(currentWeather.feels_like)}°</span>
                  </div>
                </div>
                <p className="description">{currentWeather.description}</p>
              </div>
              
              <div className="weather-details-grid">
                <div className="detail-card">
                  <Droplets size={24} color="#3b82f6" />
                  <div>
                    <span className="label">Humidité</span>
                    <span className="value">{currentWeather.humidity}%</span>
                  </div>
                </div>
                <div className="detail-card">
                  <Wind size={24} color="#6b7280" />
                  <div>
                    <span className="label">Vent</span>
                    <span className="value">{currentWeather.wind_speed} m/s</span>
                  </div>
                </div>
                <div className="detail-card">
                  <Thermometer size={24} color="#f59e0b" />
                  <div>
                    <span className="label">Pression</span>
                    <span className="value">{currentWeather.pressure} hPa</span>
                  </div>
                </div>
                <div className="detail-card">
                  <Sun size={24} color="#fbbf24" />
                  <div>
                    <span className="label">Visibilité</span>
                    <span className="value">{currentWeather.visibility} km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alertes agricoles */}
          <div className="agro-alerts">
  <h3>🌾 Alertes pour les cultures</h3>

  {currentWeather.temperature > 35 && (
    <div className="alert-item heat-warning">
      <Sun size={20} />
      <div>
        <strong>Canicule</strong>
        <p>Températures élevées - Surveiller l'irrigation</p>
      </div>
    </div>
  )}

  {currentWeather.humidity > 75 && (
    <div className="alert-item humidity-warning">
      <CloudRain size={20} />
      <div>
        <strong>Humidité élevée</strong>
        <p>Risque de maladies fongiques</p>
      </div>
    </div>
  )}

  {/* Message par défaut */}
  {currentWeather.temperature <= 35 &&
   currentWeather.humidity <= 75 && (
    <div className="alert-item" style={{background:"#f0fdf4", color:"#166534"}}>
      <div>
        <strong>Conditions normales</strong>
        <p>Aucune alerte particulière pour les cultures.</p>
      </div>
    </div>
  )}
</div>

        </div>
      )}

      {forecast && (
        <div className="forecast-section">
          <h2>📅 Prévisions 5 jours</h2>
          <div className="forecast-grid">
            {forecast.forecasts.map((day, index) => (
              <div key={index} className="forecast-card">
                <h3>{formatDate(day.date)}</h3>
                <img 
                  src={getWeatherIcon(day.icon)} 
                  alt={day.description}
                  className="forecast-icon"
                />
                <p className="forecast-desc">{day.description}</p>
                <div className="forecast-temp">
                  <span className="temp-max">{Math.round(day.max_temp)}°</span>
                  <span className="temp-min">{Math.round(day.min_temp)}°</span>
                </div>
                <div className="forecast-details">
                  <div className="detail">
                    <Droplets size={14} />
                    <span>{day.humidity}%</span>
                  </div>
                  <div className="detail">
                    <Wind size={14} />
                    <span>{day.wind_speed} m/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
.weather-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content h1 {
  margin: 0;
  color: #0f172a;
  font-size: 2rem;
}

.subtitle {
  color: #64748b;
  margin: 0.25rem 0 0;
}

.city-search {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
}

.city-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  min-width: 250px;
  outline: none;
}

.city-input:focus {
  border-color: #0f766e;
}

.btn-primary {
  background: #0f766e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: #115e59;
}

.agro-zone-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 2px solid;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.zone-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-right: 0.5rem;
}

.zone-cultures {
  font-size: 0.875rem;
}

.loading-container {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #0f766e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.weather-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.weather-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.location-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.location-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #0f172a;
}

.country-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.temperature-display {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.weather-icon-large {
  width: 100px;
  height: 100px;
}

.temp-value-container {
  display: flex;
  flex-direction: column;
}

.temp-value {
  font-size: 4rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.temp-feels {
  color: #64748b;
  font-size: 1rem;
}

.description {
  font-size: 1.25rem;
  color: #475569;
  margin: 0.5rem 0 0;
  text-transform: capitalize;
}

.weather-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.detail-card .label {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
}

.detail-card .value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.agro-alerts {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.agro-alerts h3 {
  margin: 0 0 1rem;
  color: #0f172a;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
}

.alert-item.heat-warning {
  background: #fff7ed;
  color: #9a3412;
}

.alert-item.humidity-warning {
  background: #eff6ff;
  color: #1e40af;
}

.alert-item strong {
  display: block;
  margin-bottom: 0.25rem;
}

.alert-item p {
  margin: 0;
  font-size: 0.875rem;
}

.forecast-section h2 {
  color: #0f172a;
  margin-bottom: 1rem;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.forecast-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.forecast-card:hover {
  transform: translateY(-4px);
}

.forecast-card h3 {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem;
}

.forecast-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto;
}

.forecast-desc {
  font-size: 0.875rem;
  color: #475569;
  margin: 0.5rem 0;
}

.forecast-temp {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 0.5rem 0;
}

.temp-max {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.temp-min {
  font-size: 1.5rem;
  font-weight: 700;
  color: #64748b;
}

.forecast-details {
  display: flex;
  justify-content: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.forecast-details .detail {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

@media (max-width: 768px) {
  .weather-main {
    grid-template-columns: 1fr;
  }

  .weather-header {
    flex-direction: column;
    align-items: stretch;
  }

  .city-search {
    width: 100%;
  }

  .city-input {
    width: 100%;
  }
}
`}</style>

    </div>
  );
};

export default Weather;