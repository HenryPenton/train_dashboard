import React from "react";

interface FieldConfig {
  name: string;
  value: string;
  placeholder: string;
  label?: string;
}

interface AddItemFormProps {
  fields: FieldConfig[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (e: React.FormEvent) => void;
  title: string;
  buttonText: string;
  buttonColorClass: string;
}

export default function AddItemForm({
  fields,
  onChange,
  onAdd,
  title,
  buttonText,
  buttonColorClass,
}: AddItemFormProps) {
  return (
    <form onSubmit={onAdd} className="mb-4 p-4 border rounded bg-gray-50">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="mb-2">
        {fields.map((field) => (
          <input
            key={field.name}
            type="text"
            name={field.name}
            value={field.value}
            onChange={onChange}
            placeholder={field.placeholder}
            className="border px-2 py-1 w-full mb-2"
            required
          />
        ))}
      </div>
      <button
        type="submit"
        className={`${buttonColorClass} text-white px-4 py-2 rounded hover:opacity-90`}
      >
        {buttonText}
      </button>
    </form>
  );
}
