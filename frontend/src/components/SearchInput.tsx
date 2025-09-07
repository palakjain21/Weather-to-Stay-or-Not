'use client';

import { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function SearchInput({
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  onClear,
  disabled = false,
  className = "",
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    onSearch?.(newValue);
  };

  const handleClear = () => {
    setInputValue("");
    onChange?.("");
    onClear?.();
  };


  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
      />

      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
        {inputValue && !disabled && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600"
            title="Clear"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
      </div>
    </div>
  );
}
