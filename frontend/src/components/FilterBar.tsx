'use client';

import { useState } from 'react';
import SearchInput from './SearchInput';
import RangeFilter from './RangeFilter';
import WeatherConditionFilter from './WeatherConditionFilter';
import { WeatherCondition } from '../constants/weatherConditions';

export interface FilterState {
  searchQuery: string;
  temperatureRange: {
    min: number | null;
    max: number | null;
  };
  humidityRange: {
    min: number | null;
    max: number | null;
  };
  weatherCondition: WeatherCondition | null;
}

interface FilterBarProps {
  onFiltersChange?: (filters: FilterState) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  className?: string;
  searchPlaceholder?: string;
  initialFilters?: Partial<FilterState>;
}

export default function FilterBar({
  onFiltersChange,
  onSearch,
  onClear,
  className = "",
  searchPlaceholder = "Search...",
  initialFilters = {}
}: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialFilters.searchQuery || '',
    temperatureRange: {
      min: initialFilters.temperatureRange?.min || null,
      max: initialFilters.temperatureRange?.max || null
    },
    humidityRange: {
      min: initialFilters.humidityRange?.min || null,
      max: initialFilters.humidityRange?.max || null
    },
    weatherCondition: initialFilters.weatherCondition || null,
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const handleSearchChange = (value: string) => {
    updateFilters({ searchQuery: value });
    onSearch?.(value);
  };

  const handleSearchClear = () => {
    updateFilters({ searchQuery: '' });
    onClear?.();
  };

  const handleTemperatureChange = (min: number | null, max: number | null) => {
    updateFilters({ temperatureRange: { min, max } });
  };

  const handleHumidityChange = (min: number | null, max: number | null) => {
    updateFilters({ humidityRange: { min, max } });
  };

  const handleWeatherConditionChange = (condition: WeatherCondition | null) => {
    updateFilters({ weatherCondition: condition });
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 ${className}`}>
      <div className="mb-6">
        <SearchInput
          placeholder={searchPlaceholder}
          value={filters.searchQuery}
          onChange={handleSearchChange}
          onSearch={handleSearchChange}
          onClear={handleSearchClear}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <RangeFilter
            label="Temperature Range"
            unit="°C"
            minValue={filters.temperatureRange.min}
            maxValue={filters.temperatureRange.max}
            onChange={handleTemperatureChange}
            minConstraint={-20}
            maxConstraint={50}
          />
        </div>

        <div>
          <RangeFilter
            label="Humidity Range"
            unit="%"
            minValue={filters.humidityRange.min}
            maxValue={filters.humidityRange.max}
            onChange={handleHumidityChange}
            minConstraint={0}
            maxConstraint={100}
          />
        </div>

        <div>
          <WeatherConditionFilter
            value={filters.weatherCondition}
            onChange={handleWeatherConditionChange}
          />
        </div>
      </div>
    </div>
  );
}
