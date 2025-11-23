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
        <label htmlFor={id} className="text-cyan-300 font-semibold">
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`${className} bg-[#2a2d35] border border-gray-600 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none`}
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
