'use client';

import { useState } from "react";
import FilterBar, { FilterState } from "../components/FilterBar";

export default function Home() {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    temperatureRange: { min: null, max: null },
    humidityRange: { min: null, max: null },
       weatherCondition: null
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleClear = () => {
    setSearchResults([]);
    setFilters({
      searchQuery: '',
      temperatureRange: { min: null, max: null },
      humidityRange: { min: null, max: null },
      weatherCondition: null
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        
        <FilterBar
          searchPlaceholder="Search properties..."
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          onClear={handleClear}
          className="mb-8"
          initialFilters={filters}
        />

          {searchResults.length > 0 && (
            <div className="mt-6">
              <div className="grid gap-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
  );
}