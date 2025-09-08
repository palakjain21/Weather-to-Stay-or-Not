'use client';

import { weatherConditions } from '../constants/weatherConditions';
import { getWeatherIcon, Property } from '../constants/properties';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const locationText = [property?.city, property?.state, property?.country]
    .filter(Boolean)
    .join(', ');

  const getWeatherCondition = (code: number) => {
    for (const condition of weatherConditions) {
     if (condition?.value?.includes(code)) {
        return condition.label;
      }
    }
    return 'Information not available';
  };



  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {property?.name}
        </h3>
        <p className="text-gray-600 text-sm">
         {locationText}
        </p>
      </div>

      {property?.tags && property?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {property?.tags?.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getWeatherIcon(property?.weather?.weatherCode)}</span>
            <span className="text-sm font-medium text-gray-700">
                 {getWeatherCondition(property?.weather?.weatherCode)}
            </span>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {property?.weather?.temperature}°C
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>💨</span>
            <span className="text-gray-600">Wind: {property?.weather?.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💧</span>
            <span className="text-gray-600">Humidity: {property?.weather?.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
