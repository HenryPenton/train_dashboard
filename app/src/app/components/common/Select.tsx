import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string; // applied to the <select>
  name?: string;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  className = "",
  name,
}: SelectProps) {
  const id = name || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={`flex flex-col gap-1`}>
      {label && (
        <label htmlFor={id} className="text-accent font-semibold">
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${className} bg-surface-2 border border-line rounded px-3 py-2 text-fg-strong focus:border-accent-border focus:outline-none`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
