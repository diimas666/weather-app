import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  CssBaseline,
} from '@mui/material';
import { useWeather } from './hooks/useWeather';
import { Fade } from '@mui/material';

function App() {
  const { city, setCity, weather, error, loading, getWeather } = useWeather();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCity = city.trim();
    if (trimmedCity) {
      setCity(trimmedCity); 
      getWeather(); 
    }
  };

  return (
    <>
      <CssBaseline />
      <Card
        sx={{
          maxWidth: 400,
          margin: 'auto',
          mt: 5,
          textAlign: 'center',
          borderRadius: 5,
          boxShadow: 3,
          paddingInline: '20px',
        }}
      >
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Погодний додаток
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Введіть місто"
              variant="outlined"
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{ mb: 2 }}
              disabled={loading}
            >
              Дізнатися погоду
            </Button>
          </form>
          {loading && <CircularProgress sx={{ mb: 2 }} />}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {weather && (
            <Fade in={true} timeout={500}>
              <Box>
                <Typography variant="h4">{weather.name}</Typography>
                <Typography variant="h4">
                  {Math.round(weather.main.temp)}°C
                </Typography>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="weather icon"
                  style={{ width: 50, height: 50 }}
                />
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {weather.weather[0].description}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Оновлено:{' '}
                  {new Date(weather.dt * 1000).toLocaleString('uk-UA')}
                </Typography>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default App;