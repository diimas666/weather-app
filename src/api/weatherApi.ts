import axios, { AxiosError } from 'axios';
import { WeatherData } from '../types/weather';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

interface CacheEntry {
  data: WeatherData;
  timestamp: number;
}

const getCacheKey = (city: string) => `weather_${city.toLowerCase()}`;

// Функция для получения данных о погоде
export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  if (!city.trim()) {
    throw new Error('Название города не может быть пустым');
  }

  // Проверяем кеш
  const cacheKey = getCacheKey(city);
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { data, timestamp }: CacheEntry = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data; // Возвращаем данные из кеша
    }
  }

  try {
    const response = await axios.get(`${API_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'uk',
      },
    });

    const weatherData: WeatherData = response.data;

    // Сохраняем в кеш
    const cacheEntry: CacheEntry = {
      data: weatherData,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

    return weatherData;
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.status === 404) {
      throw new Error('Місто не знайдено');
    } else if (axiosError.response?.status === 401) {
      throw new Error('Невірний API-ключ');
    } else if (axiosError.response?.status === 429) {
      throw new Error('Перевищено ліміт запитів до API');
    } else {
      throw new Error('Помилка при отриманні даних про погоду');
    }
  }
};
