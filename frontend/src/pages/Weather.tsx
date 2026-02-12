import React, { useState, useEffect } from 'react';
import { weatherService, WeatherData, WeatherForecast } from '../services/weatherService';

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

  return (
    <div className="weather-page">
      <div className="weather-header">
        <h1>Météo</h1>
        <form onSubmit={handleSubmit} className="city-search">
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Entrez une ville..."
            className="city-input"
          />
          <button type="submit" className="btn btn-primary">
            Rechercher
          </button>
        </form>
      </div>

      {loading && <div className="loading">Chargement...</div>}
      
      {error && <div className="alert alert-error">{error}</div>}

      {currentWeather && (
        <div className="current-weather">
          <div className="weather-card">
            <div className="weather-main">
              <div className="weather-info">
                <h2>{currentWeather.city}, {currentWeather.country}</h2>
                <div className="temperature">
                  <span className="temp-value">{Math.round(currentWeather.temperature)}°C</span>
                  <img 
                    src={getWeatherIcon(currentWeather.icon)} 
                    alt={currentWeather.description}
                    className="weather-icon"
                  />
                </div>
                <p className="description">{currentWeather.description}</p>
              </div>
              
              <div className="weather-details">
                <div className="detail-item">
                  <span className="label">Ressenti:</span>
                  <span className="value">{Math.round(currentWeather.feels_like)}°C</span>
                </div>
                <div className="detail-item">
                  <span className="label">Humidité:</span>
                  <span className="value">{currentWeather.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pression:</span>
                  <span className="value">{currentWeather.pressure} hPa</span>
                </div>
                <div className="detail-item">
                  <span className="label">Vent:</span>
                  <span className="value">{currentWeather.wind_speed} m/s</span>
                </div>
                <div className="detail-item">
                  <span className="label">Visibilité:</span>
                  <span className="value">{currentWeather.visibility} km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {forecast && (
        <div className="forecast-section">
          <h2>Prévisions sur 5 jours</h2>
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
                    <span className="label">Humidité:</span>
                    <span className="value">{day.humidity}%</span>
                  </div>
                  <div className="detail">
                    <span className="label">Vent:</span>
                    <span className="value">{day.wind_speed} m/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
