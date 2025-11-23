import Button from "../common/Button";
import Select from "../common/Select";

interface ItemListProps<T> {
  items: T[];
  renderItemContent: (item: T, index: number) => React.ReactNode;
  onUpdateImportance: (index: number, importance: number) => void;
  onRemoveItem: (index: number) => void;
  getImportance: (item: T) => number | undefined;
  totalItems: number;
}

export default function ItemList<T>({
  items,
  renderItemContent,
  onUpdateImportance,
  onRemoveItem,
  getImportance,
  totalItems,
}: ItemListProps<T>) {
  if (!items || items.length === 0) {
    return null;
  }

  // Generate importance options based on total items (minimum of 1)
  const maxItems = Math.max(totalItems || 1, 1);
  const importanceOptions = Array.from({ length: maxItems }, (_, i) => {
    const value = (i + 1).toString();
    const label =
      i === 0
        ? `${i + 1} (Highest)`
        : i === maxItems - 1
          ? `${i + 1} (Lowest)`
          : `${i + 1}`;
    return { value, label };
  });

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-[#2a2d35] rounded"
        >
          <div className="flex-1 min-w-0">{renderItemContent(item, index)}</div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <Select
                label="Importance"
                value={getImportance(item)?.toString() || "1"}
                onChange={(e) =>
                  onUpdateImportance(index, parseInt(e.target.value) || 1)
                }
                options={importanceOptions}
                className="w-full sm:w-32"
              />
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <Button variant="danger" onClick={() => onRemoveItem(index)}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
