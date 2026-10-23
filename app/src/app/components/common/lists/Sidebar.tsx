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
    <aside className="bg-surface-0 border border-line rounded-lg p-4">
      <h3 className="text-fg-strong font-semibold mb-4 text-lg">{title}</h3>
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-3 py-2 border border-line bg-surface-2 text-fg-strong w-full rounded-md placeholder-muted focus:border-blue-500 focus:outline-none"
      />
      <div
        className="h-[500px] overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--scroll-thumb) var(--scroll-track)",
        }}
      >
        <ul className="space-y-1">
          {items.map((item) => renderItem(item, selectedId, setSelectedId))}
        </ul>
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: var(--scroll-track);
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: var(--scroll-thumb);
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: var(--scroll-thumb-hover);
          }
        `}</style>
      </div>
    </aside>
  );
}
