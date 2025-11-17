import { useEffect, useMemo } from "react";
import { useFetch } from "../../hooks/useFetch";
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
  onTubeStationsChange?: (tubeStationIds: Set<string>) => void;
}

export default function TflStopSidebar({
  searchTerm,
  setSearchTerm,
  selectedSidebarItem,
  setSelectedSidebarItem,
  onTubeStationsChange,
}: TflStopSidebarProps) {
  const { data: sidebarItems } = useFetch<SidebarItem[]>("/api/tfl/station-codes");
  const { data: tubeStations } = useFetch<SidebarItem[]>("/api/tfl/station-codes?station_type=tube");

  useEffect(() => {
    if (tubeStations && onTubeStationsChange) {
      const tubeStationIds = new Set(tubeStations.map((station) => station.naptanID));
      onTubeStationsChange(tubeStationIds);
    }
  }, [tubeStations, onTubeStationsChange]);

  const filteredSidebarItems = useMemo(
    () =>
      sidebarItems?.filter((item) =>
        item.CommonName.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || [],
    [sidebarItems, searchTerm],
  );

  return (
    <Sidebar<SidebarItem>
      items={filteredSidebarItems}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedId={selectedSidebarItem?.naptanID ?? null}
      setSelectedId={(id) => {
        const found = sidebarItems?.find((item) => item.naptanID === id) || null;
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
