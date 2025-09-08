import { Property } from "@prisma/client";
import { Prisma } from "@prisma/client";

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
}

export interface WeatherFilters {
  temperature?: {
    min: number;
    max: number;
  };
  humidity?: {
    min: number;
    max: number;
  };
  weatherCondition?: {
    codes: number[];
  };
}

export interface PropertyWithWeather extends Property {
  weather?: WeatherData;
}

export interface GetPropertiesParams {
  searchText?: string;
  limit?: number;
  page?: number;
  weatherFilters?: WeatherFilters;
}

export interface GetPropertiesResult {
  properties: PropertyWithWeather[];
  error?: string;
}

export type PropertyQueryBuilder = (params: GetPropertiesParams) => Prisma.PropertyWhereInput | undefined;

export type WeatherDataPopulator = (properties: Property[]) => Promise<PropertyWithWeather[]>;

export type GetPropertiesService = (params: GetPropertiesParams) => Promise<GetPropertiesResult>;
