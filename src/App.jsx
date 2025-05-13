import { useState } from 'react';
import './App.css';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [unit, setUnit] = useState('c'); // 'c' for Celsius, 'f' for Fahrenheit
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=3d8d9e9253064f9091441627251305&q=${city}`
      );
      setWeatherData(response.data);
    } catch (err) {
      setError('City not found or API error.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'c' ? 'f' : 'c');
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🌤️ Weather App</h2>
      <Row className="justify-content-center col-12">
        <Col xs={12} >
          <Form.Group className="mb-3 d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Button variant="primary" onClick={fetchWeather} disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Get Weather'}
            </Button>
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          {weatherData && (
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <Card.Title>{weatherData.location.name}, {weatherData.location.country}</Card.Title>
                <Card.Img
                  variant="top"
                  src={`https:${weatherData.current.condition.icon}`}
                  alt="weather icon"
                  style={{ width: '64px' }}
                />
                <Card.Text className="mt-2">
                  <strong>{weatherData.current.condition.text}</strong><br />
                  Temperature: {unit === 'c' ? weatherData.current.temp_c : weatherData.current.temp_f}°{unit.toUpperCase()}<br />
                  Humidity: {weatherData.current.humidity}%<br />
                  Wind Speed: {weatherData.current.wind_kph} kph
                </Card.Text>
                <Button variant="secondary" onClick={toggleUnit}>
                  Switch to °{unit === 'c' ? 'F' : 'C'}
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
