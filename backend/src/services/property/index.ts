import { prisma } from "../../database/prisma";
import { GetPropertiesParams, GetPropertiesResult, GetPropertiesService } from "./types";
import { buildPropertyWhere } from "./query";
import { populatePropertiesWeatherData } from "./weather";
import { applyWeatherFilters } from "./weatherFilters";

export const getProperties: GetPropertiesService = async (params: GetPropertiesParams): Promise<GetPropertiesResult> => {
  try {
    const fetchLimit = params.limit ? params.limit * 10 : 200;
    
    const properties = await prisma.property.findMany({
      take: fetchLimit,
      where: buildPropertyWhere(params),
      skip: params.page ? params.page * (params.limit ?? 20) : 0,
    });

    const propertiesWithWeather = await populatePropertiesWeatherData(properties);
    
    const filteredProperties = applyWeatherFilters(propertiesWithWeather, params.weatherFilters);
    
    const limitedProperties = params.limit 
      ? filteredProperties.slice(0, params.limit)
      : filteredProperties;
    let hasMore = false;
    if (limitedProperties.length === params.limit) {
      hasMore = true;
    }
    return {
      properties: limitedProperties,
      hasMore
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      properties: [],
      error: "Internal Server Error"
    };
  }
};
