interface ImportanceSelectorProps {
  id: string;
  value: number;
  onChange: (importance: number) => void;
  maxImportance: number;
  className?: string;
}

export default function ImportanceSelector({
  id,
  value,
  onChange,
  maxImportance,
  className = "",
}: ImportanceSelectorProps) {
  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <label htmlFor={id} className="text-gray-600">
        Priority:
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="border rounded px-2 py-1 text-sm"
      >
        {Array.from({ length: maxImportance }, (_, index) => (
          <option key={index + 1} value={index + 1}>
            {index + 1}{" "}
            {index === 0
              ? "(Highest)"
              : index === maxImportance - 1
                ? "(Lowest)"
                : ""}
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500">(1 = highest priority)</span>
    </div>
  );
}
