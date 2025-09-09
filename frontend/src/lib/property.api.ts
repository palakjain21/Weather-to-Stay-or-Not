import { fetchApi, buildQueryString } from './api';

export interface Weather {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
}

export interface Property {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  tags: string[];
  weather: Weather;
}

export interface GetPropertiesParams {
  searchText?: string;
  limit?: number;
  cursor?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  humidityMin?: number;
  humidityMax?: number;
  weatherCondition?: number[];
}

export interface GetPropertiesResponse {
  properties: Property[];
  hasMore: boolean;
  nextCursor?: number;
}

/**
 * Fetches properties with optional weather-based filtering and pagination
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with the properties data and hasMore flag
 */
export const getProperties = async (
  params: GetPropertiesParams = {}
): Promise<GetPropertiesResponse> => {
  const endpoint = `/get-properties${buildQueryString(params as Record<string, string | number | boolean | (string | number)[]>)}`;
  return fetchApi<GetPropertiesResponse>(endpoint);
};
