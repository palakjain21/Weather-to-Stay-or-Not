'use client';

import PropertyCard from './PropertyCard';
import { Property } from '../types/allTypes';
import Image from 'next/image';

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  searchQuery: string;
}

export default function PropertyList({ properties, isLoading, searchQuery }: PropertyListProps) {
  const displayProperties = properties;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  if (displayProperties.length === 0) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProperties?.map((property) => (
        <PropertyCard key={property?.id} property={property} />
      ))}
    </div>
  );
}
