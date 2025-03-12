"use client";
import type React from "react";

interface DateTimeInputProps {
  label?: string;
  value?: Date | string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  label,
  value,
  required,
  onChange,
}) => {
  const formatDateTimeValue = () => {
    if (!value) return "";

    try {
      const dateValue = value instanceof Date ? value : new Date(value);

      if (isNaN(dateValue.getTime())) {
        return "";
      }

      return dateValue.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg">
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
        </label>
      )}
      <input
        type="datetime-local"
        required={required}
        value={formatDateTimeValue()}
        onChange={onChange}
        className="p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default DateTimeInput;
