import React from "react";

export interface SidebarProps<T> {
  items: T[];
  title: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  renderItem: (
    item: T,
    selectedId: string | null,
    onClick: (id: string) => void,
  ) => React.ReactNode;
}

export default function Sidebar<T>({
  items,
  title,

  searchTerm,
  setSearchTerm,
  selectedId,
  setSelectedId,
  renderItem,
}: SidebarProps<T>) {
  return (
    <aside>
      <h3 className="font-semibold mb-4">{title}</h3>
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-2 py-1 border w-full rounded"
      />
      <div className="h-[500px] overflow-y-auto">
        <ul>
          {items.map((item) => renderItem(item, selectedId, setSelectedId))}
        </ul>
      </div>
    </aside>
  );
}
