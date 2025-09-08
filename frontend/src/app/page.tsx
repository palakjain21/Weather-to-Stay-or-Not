'use client';

import { useState, useEffect } from "react";
import FilterBar, { FilterState } from "../components/FilterBar";
import PropertyList from "../components/PropertyList";
import { Property } from "../types/allTypes";
import Image from "next/image";

export default function Home() {
  const [filteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    temperatureRange: { min: null, max: null },
    humidityRange: { min: null, max: null },
    weatherCondition: null
  });

  const fetchProperties = async () => {
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    fetchProperties();
  };

  const handleClear = () => {
    setFilters({
      searchQuery: '',
      temperatureRange: { min: null, max: null },
      humidityRange: { min: null, max: null },
      weatherCondition: null
    });
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-4">
          <div className="flex items-center items-center gap-2 mb-2">
        <Image src='/weather-icon.svg' width={40} height={40} alt="Weather to Stay" />  
          <span className="text-4xl font-bold text-gray-900">Weather to Stay</span>
          </div>
          <p className="text-gray-600">
            Discover and explore properties across various locations
          </p>
        </div>

        <FilterBar
          searchPlaceholder="Search properties by name, city, or state..."
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          onClear={handleClear}
          className="mb-8"
          initialFilters={filters}
        />

        <PropertyList 
          properties={filteredProperties}
          isLoading={isLoading}
          searchQuery={filters.searchQuery}
        />
      </div>
    </div>
  );
}