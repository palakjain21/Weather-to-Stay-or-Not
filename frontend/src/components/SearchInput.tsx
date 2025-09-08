'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (inputValue.length >= 3) {
      const timer = setTimeout(() => onSearch?.(inputValue), 500);
      return () => clearTimeout(timer);
    }
  }, [inputValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
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
          className="w-full pl-12 pr-12 py-4 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-xl focus:outline-none bg-gray-50"
      />

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        {inputValue && !disabled && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600"
            title="Clear"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
