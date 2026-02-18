import api from './api';

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  wind_speed: number;
  wind_direction: number;
  visibility: number;
}

export interface ForecastDay {
  date: string;
  temperature: number;
  min_temp: number;
  max_temp: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
}

export interface WeatherForecast {
  city: string;
  country: string;
  forecasts: ForecastDay[];
}

export const weatherService = {
  async getCurrentWeather(city?: string): Promise<WeatherData> {
    const params = city ? { city } : {};
    const response = await api.get('/weather/current/', { params });
    return response.data;
  },

  async getForecast(city?: string, days: number = 5): Promise<WeatherForecast> {
    const params = { city, days };
    const response = await api.get('/weather/forecast/', { params });
    return response.data;
  }
};
