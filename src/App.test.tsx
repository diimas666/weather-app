import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchWeatherData } from './api/weatherApi';
import { WeatherData } from './types/weather';
jest.mock('./api/weatherApi');

const mockFetchWeatherData = fetchWeatherData as jest.MockedFunction<
  typeof fetchWeatherData
>;

describe('App', () => {
  const mockWeatherData: WeatherData = {
    name: 'Kyiv',
    main: { temp: 20 },
    weather: [{ description: 'ясно', icon: '01d' }],
    dt: 1696118400,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('повинен відображати форму для введення міста', () => {
    render(<App />);
    expect(screen.getByLabelText(/введіть місто/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /дізнатися погоду/i })
    ).toBeInTheDocument();
  });

  it('повинен відображати дані про погоду після успішного запиту', async () => {
    mockFetchWeatherData.mockResolvedValueOnce(mockWeatherData);
    render(<App />);

    const input = screen.getByLabelText(/введіть місто/i);
    const button = screen.getByRole('button', { name: /дізнатися погоду/i });

    await userEvent.type(input, 'Kyiv');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Kyiv')).toBeInTheDocument();
      expect(screen.getByText('20°C')).toBeInTheDocument();
      expect(screen.getByText('ясно')).toBeInTheDocument();
    });
  });

  it('повинен відображати помилку, якщо місто не знайдено', async () => {
    mockFetchWeatherData.mockRejectedValueOnce(new Error('Місто не знайдено'));
    render(<App />);

    const input = screen.getByLabelText(/введіть місто/i);
    const button = screen.getByRole('button', { name: /дізнатися погоду/i });

    await userEvent.type(input, 'InvalidCity');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Місто не знайдено')).toBeInTheDocument();
    });
  });
});
