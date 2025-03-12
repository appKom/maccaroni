"use client";

import type React from "react";

interface Props {
  updateInputValues: (value: string) => void;
  label: string;
  options: { label: string; value: string }[];
  required?: boolean;
  value?: string | number;
  defaultValue?: string | number;
}

const SelectInput = (props: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    props.updateInputValues(newValue);
  };

  return (
    <div className="max-w-lg py-4">
      <div className="relative">
        <label
          htmlFor="selectComponent"
          className="px-1 text-xs transition text-gray-200 bg-gray-900"
        >
          {props.label}
        </label>
        <select
          className="appearance-none block w-full px-3 py-1.5 text-base border border-solid rounded transition cursor-pointer focus:border-blue-600 focus:outline-none bg-gray-700 border-gray-900"
          aria-label={props.label}
          required={props.required}
          id="selectComponent"
          value={
            props.value !== undefined ? props.value : props.defaultValue || ""
          }
          onChange={handleChange}
        >
          <option value="" disabled>
            Velg
          </option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectInput;
