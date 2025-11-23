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
    <aside className="bg-[#1a1d24] border border-gray-600 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-4 text-lg">{title}</h3>
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-600 bg-[#2a2d35] text-white w-full rounded-md placeholder-gray-400 focus:border-blue-500 focus:outline-none"
      />
      <div
        className="h-[500px] overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#4b5563 #2a2d35",
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
            background: #2a2d35;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `}</style>
      </div>
    </aside>
  );
}
