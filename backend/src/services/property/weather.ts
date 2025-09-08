import { Property } from "@prisma/client";
import { OpenMetroService } from "../../resource/openmetro";
import { PropertyWithWeather, WeatherDataPopulator } from "./types";
import { CacheService } from "../cache";

let weatherCache = CacheService.createCache<PropertyWithWeather['weather']>();

const getPropertyWeather = async (
  property: Property
): Promise<PropertyWithWeather['weather'] | undefined> => {
  if (!property.lat || !property.lng) {
    return undefined;
  }

  const cacheKey = `weather-${property.id}-${property.lat}-${property.lng}`;
  const cachedWeather = CacheService.get(weatherCache, cacheKey);
  
  if (cachedWeather !== undefined) {
    return cachedWeather;
  }

  try {
    const coordinates = {
      latitude: property.lat,
      longitude: property.lng
    };

    const weatherData = await OpenMetroService.getCurrentWeather(coordinates);
    const weather = {
      temperature: weatherData.temperature_2m,
      windSpeed: weatherData.wind_speed_10m,
      humidity: weatherData.relative_humidity_2m,
      weatherCode: weatherData.weathercode
    };

    // (1 hour TTL)
    weatherCache = CacheService.set(weatherCache, cacheKey, weather, 3600000);
    return weather;
  } catch (error) {
    console.warn(`Failed to fetch weather for property ${property.id}:`, error);
    return undefined;
  }
};

const cleanupWeatherCache = (): void => {
  weatherCache = CacheService.cleanup(weatherCache);
};

setInterval(cleanupWeatherCache, 3600000);

export const populatePropertiesWeatherData: WeatherDataPopulator = async (
  properties: Property[]
): Promise<PropertyWithWeather[]> => {
  const results = await Promise.allSettled(
    properties.map(async (property): Promise<PropertyWithWeather> => {
      const weatherData = await getPropertyWeather(property);
      
      return {
        ...property,
        weather: weatherData
      };
    })
  );

  return results.map((result, index) => 
    result.status === 'fulfilled' ? result.value : properties[index]
  );
};

export { getPropertyWeather };
