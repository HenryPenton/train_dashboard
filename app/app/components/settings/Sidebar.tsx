import SidebarListItem from "./SidebarListItem";

type SidebarItem = {
  CommonName: string;
  naptanID: string;
};

interface SidebarProps {
  items: SidebarItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}

export default function Sidebar({
  items,
  searchTerm,
  setSearchTerm,
  selectedId,
  setSelectedId,
}: SidebarProps) {
  return (
    <aside>
      <h3 className="font-semibold mb-4">Stations</h3>
      <input
        type="text"
        placeholder="Search stations..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-2 py-1 border w-full rounded"
      />
      <div className="h-[500px] overflow-y-auto">
        <ul>
          {items.map((item, idx) => (
            <SidebarListItem
              key={idx}
              item={item}
              selected={selectedId === item.naptanID}
              onClick={setSelectedId}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}
