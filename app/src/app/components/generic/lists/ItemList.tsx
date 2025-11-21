import ImportanceSelector from "../ImportanceSelector";

interface ItemListProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  onRemove: (idx: number) => void;
  heading: string;
  onImportanceChange?: (idx: number, importance: number) => void;
  maxImportance?: number;
}

export default function ItemList<T extends { importance?: number }>({
  items,
  getLabel,
  onRemove,
  heading,
  onImportanceChange,
  maxImportance = 10,
}: ItemListProps<T>) {
  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2">{heading}</h4>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="mb-2 p-3 border rounded bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="flex-1">{getLabel(item)}</span>
              <button
                type="button"
                aria-label={`Remove ${heading.toLowerCase()}`}
                className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl"
                onClick={() => onRemove(i)}
              >
                ×
              </button>
            </div>
            {onImportanceChange && (
              <ImportanceSelector
                id={`importance-${heading}-${i}`}
                value={item.importance ?? 1}
                onChange={(importance) => onImportanceChange(i, importance)}
                maxImportance={maxImportance}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
