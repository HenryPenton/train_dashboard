import React from "react";

interface ItemListProps<T> {
  items: T[];
  getLabel: (item: T) => string;
  onRemove: (idx: number) => void;
  heading: string;
}

export default function ItemList<T>({ items, getLabel, onRemove, heading }: ItemListProps<T>) {
  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2">{heading}</h4>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="mb-1 flex items-center justify-between">
            <span>{getLabel(item)}</span>
            <button
              type="button"
              aria-label={`Remove ${heading.toLowerCase()}`}
              className="ml-2 text-red-500 hover:text-red-700 font-bold"
              onClick={() => onRemove(i)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
