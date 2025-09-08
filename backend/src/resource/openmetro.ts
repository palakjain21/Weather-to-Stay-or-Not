
interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  interface CurrentWeather {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
    weathercode: number;
  }
  
  interface HourlyWeather {
    time: string[];
    wind_speed_10m: number[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
  }
  
  interface WeatherResponse {
    current: CurrentWeather;
    hourly: HourlyWeather;
  }
  
  
  const OPENMETRO_BASE_URL = 'https://api.open-meteo.com/v1';
  
  
  const buildWeatherUrl = (
    coordinates: Coordinates,
    includeHourly: boolean = false
  ): string => {
    const { latitude, longitude } = coordinates;
    const currentParams = 'temperature_2m,wind_speed_10m,relative_humidity_2m,weathercode';
    const hourlyParams = includeHourly ? '&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m' : '';
    
    return `${OPENMETRO_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentParams}${hourlyParams}`;
  };
  
  export const getCurrentWeather = async (
    coordinates: Coordinates
  ): Promise<CurrentWeather> => {
    try {
      const response = await fetch(buildWeatherUrl(coordinates));
      if (!response.ok) {
        throw new Error(`OpenMetro API error: ${response.statusText}`);
      }
      
      const data = await response.json() as WeatherResponse;
      return data.current;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch current weather: ${error.message}`);
      }
      throw error;
    }
  };
  export const OpenMetroService = {
    getCurrentWeather,
  } as const;
  
