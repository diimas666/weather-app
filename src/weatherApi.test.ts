import axios from 'axios';
import { fetchWeatherData } from './api/weatherApi';
import { WeatherData } from './types/weather';
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeatherData', () => {
  const mockWeatherData: WeatherData = {
    name: 'Kyiv',
    main: { temp: 20 },
    weather: [{ description: 'ясно', icon: '01d' }],
    dt: 1696118400,
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    // Устанавливаем переменные окружения для тестов
    process.env.VITE_API_URL = 'https://api.openweathermap.org/data/2.5';
  });

  it('повинен повертати дані про погоду з API', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockWeatherData });
    const data = await fetchWeatherData('Kyiv');
    expect(data).toEqual(mockWeatherData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${process.env.VITE_API_URL}/weather`, // Заменили import.meta.env на process.env
      expect.objectContaining({
        params: expect.objectContaining({
          q: 'Kyiv',
          units: 'metric',
          lang: 'uk',
        }),
      })
    );
  });

  it('повинен повертати дані з кешу, якщо вони свіжі', async () => {
    const cacheKey = 'weather_kyiv';
    const cacheEntry = { data: mockWeatherData, timestamp: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

    const data = await fetchWeatherData('Kyiv');
    expect(data).toEqual(mockWeatherData);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('повинен робити новий запит, якщо кеш застарів', async () => {
    const cacheKey = 'weather_kyiv';
    const cacheEntry = {
      data: mockWeatherData,
      timestamp: Date.now() - 6 * 60 * 1000,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

    mockedAxios.get.mockResolvedValueOnce({ data: mockWeatherData });
    const data = await fetchWeatherData('Kyiv');
    expect(data).toEqual(mockWeatherData);
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it('повинен кидати помилку, якщо місто не знайдено', async () => {
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } });
    await expect(fetchWeatherData('InvalidCity')).rejects.toThrow(
      'Місто не знайдено'
    );
  });
});
