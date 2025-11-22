import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
  id?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  className = "",
  id,
}: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-2 text-lg ${className}`}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-cyan-600 w-4 h-4"
      />
      <span className="text-cyan-200">{label}</span>
    </label>
  );
}