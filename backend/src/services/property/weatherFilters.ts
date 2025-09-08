import { PropertyWithWeather, WeatherFilters } from "./types";

const isWeatherInRange = (value: number | undefined, min: number, max: number): boolean => {
  if (value === undefined) return false;
  return value >= min && value <= max;
};

const isWeatherCodeInGroup = (weatherCode: number | undefined, codes: number[]): boolean => {
  if (weatherCode === undefined) return false;
  return codes.includes(weatherCode);
};

export const applyWeatherFilters = (
  properties: PropertyWithWeather[],
  filters: WeatherFilters | undefined
): PropertyWithWeather[] => {
  if (!filters) return properties;

  return properties.filter(property => {
    if (!property.weather) return false;

    if (filters.temperature) {
      if (!isWeatherInRange(
        property.weather.temperature,
        filters.temperature.min,
        filters.temperature.max
      )) {
        return false;
      }
    }

    if (filters.humidity) {
      if (!isWeatherInRange(
        property.weather.humidity,
        filters.humidity.min,
        filters.humidity.max
      )) {
        return false;
      }
    }

    if (filters.weatherCondition) {
      if (!isWeatherCodeInGroup(
        property.weather.weatherCode,
        filters.weatherCondition.codes
      )) {
        return false;
      }
    }

    return true;
  });
};
