import Button from "../common/Button";
import Select from "../common/Select";

interface ItemListProps<T> {
  items: T[];
  renderItemContent: (item: T, index: number) => React.ReactNode;
  onUpdateColumnPositions: (index: number, col2: number, col3: number) => void;
  onRemoveItem: (index: number) => void;
  getColumnPositions: (item: T) => { col_2_position: number; col_3_position: number };
}

export default function ItemList<T>({
  items,
  renderItemContent,
  onUpdateColumnPositions,
  onRemoveItem,
  getColumnPositions,
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

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const positions = getColumnPositions(item);
        return (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-[#2a2d35] rounded"
          >
            <div className="flex-1 min-w-0">{renderItemContent(item, index)}</div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-full sm:w-auto">
                  <Select
                    label="Col 2 Position"
                    value={positions.col_2_position.toString()}
                    onChange={(e) => {
                      const col2 = parseInt(e.target.value) || 1;
                      onUpdateColumnPositions(index, col2, positions.col_3_position);
                    }}
                    options={col2Options}
                    className="w-full sm:w-24"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Select
                    label="Col 3 Position"
                    value={positions.col_3_position.toString()}
                    onChange={(e) => {
                      const col3 = parseInt(e.target.value) || 1;
                      onUpdateColumnPositions(index, positions.col_2_position, col3);
                    }}
                    options={col3Options}
                    className="w-full sm:w-24"
                  />
                </div>
              </div>
              <div className="w-full sm:w-auto flex justify-end">
                <Button variant="danger" onClick={() => onRemoveItem(index)}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
