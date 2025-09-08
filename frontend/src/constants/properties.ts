export interface Property {
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  geohash5: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  weather: {
    temperature: number;
    windSpeed: number;
    humidity: number;
    weatherCode: number;
  };
}

export const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️';
    if (code === 1) return '⛅';
    if ([2, 3].includes(code)) return '☁️';
    if ([51, 52, 53, 54, 55, 56, 57].includes(code)) return '🌦️';
    if ([61, 62, 63, 64, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️';
    if ([71, 72, 73, 74, 75, 76, 77, 85, 86].includes(code)) return '❄️';
    return '🌤️';
  };
