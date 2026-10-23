import React from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  name,
}: InputFieldProps) {
  const inputId = name || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={inputId} className="text-accent font-semibold">
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        aria-label={label}
        aria-required={required}
        className="bg-surface-2 border border-line rounded px-3 py-2 text-fg-strong focus:border-accent-border focus:outline-none"
      />
    </div>
  );
}
