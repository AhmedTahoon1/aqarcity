import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "501234567",
  className = "",
  error
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    // Extract number part from +971xxxxxxxx
    if (value && value.startsWith('+971')) {
      setDisplayValue(value.substring(4));
    } else {
      setDisplayValue(value || '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ''); // Only numbers
    setDisplayValue(inputValue);
    
    // Send full number with +971 to parent
    if (inputValue) {
      onChange(`+971${inputValue}`);
    } else {
      onChange('');
    }
  };

  return (
    <div className="relative">
      <div className="flex">
        <div className="flex items-center px-3 py-3 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
          <Phone className="w-4 h-4 mr-2" />
          +971
        </div>
        <input
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`flex-1 px-3 py-3 border-2 border-gray-200 rounded-r-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
            error ? 'border-red-500' : ''
          } ${className}`}
          maxLength={9}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};