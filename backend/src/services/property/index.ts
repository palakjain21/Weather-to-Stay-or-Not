import { prisma } from "../../database/prisma";
import { GetPropertiesParams, GetPropertiesResult, GetPropertiesService, PropertyWithWeather } from "./types";
import { buildPropertyWhere } from "./query";
import { populatePropertiesWeatherData } from "./weather";
import { applyWeatherFilters } from "./weatherFilters";

export const getProperties: GetPropertiesService = async (params: GetPropertiesParams): Promise<GetPropertiesResult> => {
  try {
    const targetLimit = params.limit ?? 20;
    const batchSize = 100; // Fetch in batches to avoid loading too much data
    let allFilteredProperties: PropertyWithWeather[] = [];
    let lastId = params.cursor || 0;
    let hasMore = false;
    
    // Keep fetching until we have enough filtered results or run out of data
    while (allFilteredProperties.length < targetLimit) {
      // Build where clause with cursor
      const whereClause = {
        ...buildPropertyWhere(params),
        id: { gt: lastId } // Only fetch properties with ID greater than cursor
      };
      
      // Fetch next batch from database
      const properties = await prisma.property.findMany({
        take: batchSize,
        where: whereClause,
        orderBy: { id: 'asc' } // Consistent ordering by ID
      });
      
      // If no more properties, we're done
      if (properties.length === 0) {
        break;
      }
      
      // Update lastId for next iteration
      lastId = properties[properties.length - 1].id;
      
      // Add weather data
      const propertiesWithWeather = await populatePropertiesWeatherData(properties);
      
      // Apply weather filters
      const filteredBatch = applyWeatherFilters(propertiesWithWeather, params.weatherFilters);
      
      // Add filtered results to our collection
      allFilteredProperties = [...allFilteredProperties, ...filteredBatch];
      
      // If we fetched less than batchSize, we've reached the end of data
      if (properties.length < batchSize) {
        break;
      }
    }
    
    // Limit results to requested amount
    const limitedProperties = allFilteredProperties.slice(0, targetLimit);
    
    // Check if there are more results
    hasMore = allFilteredProperties.length > targetLimit;
    
    // Get the cursor for the next page (ID of the last returned property)
    const nextCursor = limitedProperties.length > 0 
      ? limitedProperties[limitedProperties.length - 1].id 
      : undefined;
    
    return {
      properties: limitedProperties,
      hasMore,
      nextCursor
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      properties: [],
      error: "Internal Server Error"
    };
  }
};
