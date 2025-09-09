'use client';

import PropertyCard from './PropertyCard';
import { useProperties } from '../hooks/getProperties';
import Image from 'next/image';

interface PropertyListProps {
  searchQuery: string;
  temperatureMin?: number;
  temperatureMax?: number;
  weatherCondition?: number[];
  humidityMin?: number;
  humidityMax?: number;
}

export default function PropertyList({ 
  searchQuery, 
  temperatureMin, 
  temperatureMax, 
  weatherCondition, 
  humidityMin, 
  humidityMax 
}: PropertyListProps) {
  
  const { 
    properties, 
    isLoading, 
    error, 
    hasMore, 
    loadMore 
  } = useProperties({
    searchText: searchQuery,
    temperatureMin,
    temperatureMax,
    weatherCondition,
    humidityMin,
    humidityMax
  });

  if (error) {
    return (
      <div className="flex justify-center items-center py-12 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  if (isLoading && properties.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center py-12">
        <div className="text-gray-500 text-lg mb-2">
          <Image src='/weather-icon.svg' width={100} height={100} alt="Weather to Stay" />            
        </div>
        <div className="text-gray-500 text-lg mb-2">No properties found</div>
        {searchQuery && (
          <p className="text-gray-400">
            Try adjusting your search or filters
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <PropertyCard key={property.id+"-"+index} property={property} />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}