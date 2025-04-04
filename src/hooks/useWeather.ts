import { useState } from 'react';
import { fetchWeatherData } from '../api/weatherApi';
import { WeatherData } from '../types/weather';

export const useWeather = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    setLoading(true);
    setError(null);
    setWeather(null); 
    try {
      const data = await fetchWeatherData(city);
      setWeather(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { city, setCity, weather, error, loading, getWeather };
};