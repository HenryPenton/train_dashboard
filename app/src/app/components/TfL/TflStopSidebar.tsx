import { useEffect, useMemo, useState } from "react";
import Sidebar from "../generic/lists/Sidebar";
import TfLStationSidebarListItem from "./lists/TfLStationSidebarListItem";

export type SidebarItem = {
  CommonName: string;
  naptanID: string;
};

interface TflStopSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSidebarItem: SidebarItem | null;
  setSelectedSidebarItem: (item: SidebarItem | null) => void;
}

export default function TflStopSidebar({
  searchTerm,
  setSearchTerm,
  selectedSidebarItem,
  setSelectedSidebarItem,
}: TflStopSidebarProps) {
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    async function fetchSidebarItems() {
      try {
        const res = await fetch("/api/naptan");
        if (res.ok) {
          const data = await res.json();
          setSidebarItems(data);
        }
      } catch {
        // ignore errors for now
      }
    }
    fetchSidebarItems();
  }, []);

  const filteredSidebarItems = useMemo(
    () =>
      sidebarItems.filter((item) =>
        item.CommonName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [sidebarItems, searchTerm],
  );

  return (
    <Sidebar<SidebarItem>
      items={filteredSidebarItems}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedId={selectedSidebarItem?.naptanID ?? null}
      setSelectedId={(id) => {
        const found = sidebarItems.find((item) => item.naptanID === id) || null;
        setSelectedSidebarItem(found);
      }}
      renderItem={(item, selectedId, onClick) => (
        <TfLStationSidebarListItem
          key={item.naptanID}
          item={item}
          matchingId={selectedId}
          onClick={onClick}
        />
      )}
      title="Stations"
    />
  );
}
