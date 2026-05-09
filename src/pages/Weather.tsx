import React, { useState, useEffect } from 'react';
import { weatherService, WeatherData, WeatherForecast } from '../services/weatherService';
import { MapPin, Droplets, Wind, Thermometer, Sun, CloudRain } from 'lucide-react';
import '../styles/Weather.css';

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

  useEffect(() => { fetchWeather(city); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity);
      fetchWeather(inputCity);
    }
  };

  const getWeatherIcon = (iconCode: string) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });

  const getAgroZone = (cityName: string) => {
    const nord   = ['tunis','nabeul','bizerte','béja','jendouba','le kef','siliana','ariana','ben arous','manouba','zaghouan'];
    const centre = ['kairouan','gafsa','kasserine','sidi bouzid'];
    const sud    = ['sfax','gabès','tozeur','médenine','tataouine','kebili'];
    const lower  = cityName.toLowerCase();
    if (nord.some(c => lower.includes(c)))   return { zone: 'Nord (Humide)',       cls: 'nord',   cultures: 'Blé tendre · Olives · Agrumes' };
    if (centre.some(c => lower.includes(c))) return { zone: 'Centre (Semi-aride)', cls: 'centre', cultures: 'Blé dur · Orge · Olives' };
    if (sud.some(c => lower.includes(c)))    return { zone: 'Sud (Aride)',          cls: 'sud',    cultures: 'Dattes · Amandiers · Figuier' };
    return { zone: 'Tunisie', cls: 'default', cultures: 'Diverses cultures' };
  };

  const agroZone = getAgroZone(city);

  return (
    <div className="weather-page">

      {/* ── Hero header ── */}
      <div className="weather-hero">
        <div className="weather-hero-content">
          <span className="weather-hero-icon">🌤️</span>
          <h1>Météo Agricole Tunisie</h1>
          <p>Prévisions météo adaptées à vos cultures</p>
        </div>

        <form onSubmit={handleSubmit} className="city-search">
          <div className="search-wrapper">
            <MapPin size={18} className="search-icon" />
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Choisir une ville…"
              list="tunisian-cities"
              className="city-input"
            />
            <datalist id="tunisian-cities">
              {TUNISIAN_CITIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
          <button type="submit" className="btn btn-primary">Rechercher</button>
        </form>
      </div>

      <div className="weather-content">

        {/* ── Agro zone banner ── */}
        <div className={`agro-zone-banner agro-${agroZone.cls}`}>
          <div className="zone-left">
            <span className="zone-label">Zone agro-écologique</span>
            <strong className="zone-name">{agroZone.zone}</strong>
          </div>
          <div className="zone-right">
            <span className="zone-cultures-label">Cultures principales</span>
            <span className="zone-cultures-value">{agroZone.cultures}</span>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des données météo…</p>
          </div>
        )}

        {error && <div className="w-alert w-alert-error">{error}</div>}

        {/* ── Current weather ── */}
        {currentWeather && (
          <>
            <div className="weather-card main-card">
              <div className="weather-main">

                {/* left */}
                <div className="weather-info">
                  <div className="location-header">
                    <h2>{currentWeather.city}</h2>
                    <span className="country-badge">🇹🇳 Tunisie</span>
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

                {/* right */}
                <div className="weather-details-grid">
                  <div className="detail-card">
                    <Droplets size={22} className="detail-icon icon-blue" />
                    <div><span className="label">Humidité</span><span className="value">{currentWeather.humidity}%</span></div>
                  </div>
                  <div className="detail-card">
                    <Wind size={22} className="detail-icon icon-gray" />
                    <div><span className="label">Vent</span><span className="value">{currentWeather.wind_speed} m/s</span></div>
                  </div>
                  <div className="detail-card">
                    <Thermometer size={22} className="detail-icon icon-gold" />
                    <div><span className="label">Pression</span><span className="value">{currentWeather.pressure} hPa</span></div>
                  </div>
                  <div className="detail-card">
                    <Sun size={22} className="detail-icon icon-sun" />
                    <div><span className="label">Visibilité</span><span className="value">{currentWeather.visibility} km</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Agro alerts ── */}
            <div className="agro-alerts">
              <h3>🌾 Alertes pour les cultures</h3>

              {currentWeather.temperature > 35 && (
                <div className="alert-item heat-warning">
                  <Sun size={20} />
                  <div>
                    <strong>Canicule</strong>
                    <p>Températures élevées — Surveiller l'irrigation</p>
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

              {currentWeather.temperature <= 35 && currentWeather.humidity <= 75 && (
                <div className="alert-item ok-alert">
                  <div>
                    <strong>✅ Conditions normales</strong>
                    <p>Aucune alerte particulière pour les cultures.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Forecast ── */}
        {forecast && (
          <div className="forecast-section">
            <h2 className="section-title">📅 Prévisions 5 jours</h2>
            <div className="forecast-grid">
              {forecast.forecasts.map((day, index) => (
                <div key={index} className="forecast-card">
                  <h3>{formatDate(day.date)}</h3>
                  <img src={getWeatherIcon(day.icon)} alt={day.description} className="forecast-icon" />
                  <p className="forecast-desc">{day.description}</p>
                  <div className="forecast-temp">
                    <span className="temp-max">{Math.round(day.max_temp)}°</span>
                    <span className="temp-min">{Math.round(day.min_temp)}°</span>
                  </div>
                  <div className="forecast-details">
                    <div className="detail"><Droplets size={13} /><span>{day.humidity}%</span></div>
                    <div className="detail"><Wind size={13} /><span>{day.wind_speed} m/s</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Weather;