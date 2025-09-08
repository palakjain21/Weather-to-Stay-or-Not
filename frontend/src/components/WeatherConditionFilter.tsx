'use client';

import { useState } from 'react';
import { WeatherCondition, weatherConditions } from '../constants/weatherConditions';

interface WeatherConditionFilterProps {
  value?: WeatherCondition | null;
  onChange?: (condition: WeatherCondition | null) => void;
  className?: string;
}

export default function WeatherConditionFilter({
  value,
  onChange,
  className = ""
}: WeatherConditionFilterProps) {
  const [selectedCondition, setSelectedCondition] = useState<WeatherCondition | null>(value || null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === '') {
      setSelectedCondition(null);
      onChange?.(null);
      return;
    }

    const condition = weatherConditions.find(c => 
      c.value.includes(parseInt(selectedValue))
    );
    
    if (condition) {
      setSelectedCondition(condition);
      onChange?.(condition);
    }
  };

  const groupedConditions = weatherConditions.reduce((acc, condition) => {
    if (!acc[condition.group]) {
      acc[condition.group] = [];
    }
    acc[condition.group].push(condition);
    return acc;
  }, {} as Record<string, WeatherCondition[]>);

  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <label className="text-lg font-medium text-gray-900">
        Weather Condition
      </label>
      <div className="relative">
        <select
          value={selectedCondition ? selectedCondition.value[0] : ''}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 appearance-none cursor-pointer"
        >
          <option value="">All</option>
          {Object.entries(groupedConditions).map(([group, conditions]) => (
            <optgroup key={group} label={group}>
              {conditions.map((condition) => (
                <option key={condition.value[0]} value={condition.value[0]}>
                  {condition.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
