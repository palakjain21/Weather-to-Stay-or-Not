'use client';

import { useState } from 'react';

interface RangeFilterProps {
  label: string;
  unit?: string;
  minValue?: number | null;
  maxValue?: number | null;
  onChange?: (min: number | null, max: number | null) => void;
  className?: string;
  minConstraint?: number;
  maxConstraint?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export default function RangeFilter({
  label,
  unit = "",
  minValue,
  maxValue,
  onChange,
  className = "",
  minConstraint = 0,
  maxConstraint = 100,
  minPlaceholder = "Min",
  maxPlaceholder = "Max"
}: RangeFilterProps) {
  const [min, setMin] = useState<string>(minValue?.toString() || '');
  const [max, setMax] = useState<string>(maxValue?.toString() || '');
  const [errors, setErrors] = useState<{ min?: string; max?: string }>({});

  const checkValues = (minVal: number | null, maxVal: number | null) => {
    const errs: { min?: string; max?: string } = {};
    
    if (minVal !== null && (minVal < minConstraint || minVal > maxConstraint)) {
      errs.min = `Must be ${minConstraint}-${maxConstraint}${unit}`;
    }
    if (maxVal !== null && (maxVal < minConstraint || maxVal > maxConstraint)) {
      errs.max = `Must be ${minConstraint}-${maxConstraint}${unit}`;
    }
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      errs.max = 'Max must be > min';
    }
    
    setErrors(errs);
    if (Object.keys(errs).length === 0) onChange?.(minVal, maxVal);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMin(e.target.value);
    const minNum = e.target.value === '' ? null : parseFloat(e.target.value);
    const maxNum = max === '' ? null : parseFloat(max);
    checkValues(minNum, maxNum);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMax(e.target.value);
    const minNum = min === '' ? null : parseFloat(min);
    const maxNum = e.target.value === '' ? null : parseFloat(e.target.value);
    checkValues(minNum, maxNum);
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-lg font-medium text-gray-900">
        {label} {unit && `(${unit})`}
      </label>
      <div className="text-sm text-gray-500">
        {minConstraint}{unit} - {maxConstraint}{unit}
      </div>
      <div>
        <div className="flex">
          <input
            type="number"
            value={min}
            onChange={handleMinChange}
            placeholder={minPlaceholder}
            className={`w-20 px-3 py-3 mr-3 text-gray-700 placeholder-gray-500 border rounded-xl focus:outline-none bg-gray-50 ${
              errors.min ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <input
            type="number"
            value={max}
            onChange={handleMaxChange}
            placeholder={maxPlaceholder}
            className={`w-20 px-3 py-3 text-gray-700 placeholder-gray-500 border rounded-xl focus:outline-none bg-gray-50 ${
              errors.max ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {(errors.min || errors.max) && (
          <div className="text-xs text-red-600 mt-1">
            {errors.min || errors.max}
          </div>
        )}
      </div>
    </div>
  );
}
