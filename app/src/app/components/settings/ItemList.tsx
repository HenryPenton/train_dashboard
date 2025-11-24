import Button from "../common/Button";
import Select from "../common/Select";

interface ItemListProps<T> {
  items: T[];
  renderItemContent: (item: T, index: number) => React.ReactNode;
  onUpdateColumnPositions: (index: number, col2: number, col3: number) => void;
  onUpdateImportance: (index: number, importance: number) => void;
  onRemoveItem: (index: number) => void;
  getColumnPositions: (item: T) => { col_2_position: number; col_3_position: number };
  getImportance: (item: T) => number | undefined;
  totalItems: number;
}

export default function ItemList<T>({
  items,
  renderItemContent,
  onUpdateColumnPositions,
  onUpdateImportance,
  onRemoveItem,
  getColumnPositions,
  getImportance,
  totalItems,
}: ItemListProps<T>) {
  if (!items || items.length === 0) {
    return null;
  }

  const col2Options = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
  ];

  const col3Options = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];

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
      {items.map((item, index) => {
        const positions = getColumnPositions(item);
        return (
          <div
            key={index}
            className="p-3 bg-[#2a2d35] rounded space-y-3"
          >
            {/* Title and Remove Button */}
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">{renderItemContent(item, index)}</div>
              <Button variant="danger" onClick={() => onRemoveItem(index)}>
                Remove
              </Button>
            </div>
            
            {/* Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Select
                  label="Col 2 Position"
                  value={positions.col_2_position.toString()}
                  onChange={(e) => {
                    const col2 = parseInt(e.target.value) || 1;
                    onUpdateColumnPositions(index, col2, positions.col_3_position);
                  }}
                  options={col2Options}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Col 3 Position"
                  value={positions.col_3_position.toString()}
                  onChange={(e) => {
                    const col3 = parseInt(e.target.value) || 1;
                    onUpdateColumnPositions(index, positions.col_2_position, col3);
                  }}
                  options={col3Options}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Importance"
                  value={getImportance(item)?.toString() || "1"}
                  onChange={(e) =>
                    onUpdateImportance(index, parseInt(e.target.value) || 1)
                  }
                  options={importanceOptions}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
