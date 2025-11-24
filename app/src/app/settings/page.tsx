"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "../components/common/Button";
import Checkbox from "../components/common/Checkbox";
import InputField from "../components/common/InputField";
import Select from "../components/common/Select";
import SectionCard from "../components/common/SectionCard";
import SectionHeading from "../components/common/SectionHeading";
import PageLayout from "../components/layout/PageLayout";
import PlaceDetails from "../components/TfL/PlaceDetails";
import TflStopSidebar, { SidebarItem } from "../components/TfL/TflStopSidebar";
import ItemList from "../components/settings/ItemList";
import { useConfigStore } from "../providers/config";

export default function Settings() {
  const {
    config,
    fetchConfig,
    addDeparture,
    addRoute,
    addTubeDeparture,
    setRefreshTimer,
    removeDeparture,
    removeRoute,
    removeTubeDeparture,
    saveConfig,
    updateRouteColumnPositions,
    updateDepartureColumnPositions,
    updateTubeDepartureColumnPositions,
    updateTflLineStatusColumnPositions,
    setTflLineStatusEnabled,
  } = useConfigStore((state) => state);

  const router = useRouter();

  // Fetch config on page load
  useEffect(() => {
    fetchConfig().catch(() => {
      /* errors are handled in store */
    });
  }, [fetchConfig]);



  const [partialRoute, setPartialRoute] = useState({
    origin: "",
    originNaPTANOrATCO: "",
    destination: "",
    destinationNaPTANOrATCO: "",
  });

  const [partialDeparture, setPartialDeparture] = useState({
    origin: "",
    originCode: "",
    destination: "",
    destinationCode: "",
  });

  const [partialTubeDeparture, setPartialTubeDeparture] = useState({
    stationName: "",
    stationId: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItem | null>(null);
  const [tubeStationIds, setTubeStationIds] = useState<Set<string>>(new Set());

  const handleRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartialRoute({ ...partialRoute, [e.target.name]: e.target.value });
  };

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartialDeparture({
      ...partialDeparture,
      [e.target.name]: e.target.value,
    });
  };

  const handleTubeDepartureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPartialTubeDeparture({
      ...partialTubeDeparture,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      partialRoute.origin &&
      partialRoute.originNaPTANOrATCO &&
      partialRoute.destination &&
      partialRoute.destinationNaPTANOrATCO
    ) {
      addRoute(partialRoute);
      setPartialRoute({
        origin: "",
        originNaPTANOrATCO: "",
        destination: "",
        destinationNaPTANOrATCO: "",
      });
    }
  };

  const handleAddDeparture = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      partialDeparture.origin &&
      partialDeparture.originCode &&
      partialDeparture.destination &&
      partialDeparture.destinationCode
    ) {
      addDeparture(partialDeparture);
      setPartialDeparture({
        origin: "",
        originCode: "",
        destination: "",
        destinationCode: "",
      });
    }
  };

  const handleAddTubeDeparture = (e: React.FormEvent) => {
    e.preventDefault();
    if (partialTubeDeparture.stationName && partialTubeDeparture.stationId) {
      addTubeDeparture(partialTubeDeparture);
      setPartialTubeDeparture({
        stationName: "",
        stationId: "",
      });
    }
  };

  const handleAddTubeDepartureFromSidebar = (
    stationName: string,
    stationId: string,
  ) => {
    addTubeDeparture({ stationName, stationId });
  };

  return (
    <PageLayout title="SETTINGS" showNavigation={true}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <TflStopSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSidebarItem={selectedSidebarItem}
            setSelectedSidebarItem={setSelectedSidebarItem}
            onTubeStationsChange={setTubeStationIds}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Place Details */}
          {selectedSidebarItem !== null && (
            <PlaceDetails
              selectedSidebarItem={selectedSidebarItem}
              setPartialRoute={setPartialRoute}
              onAddTubeDeparture={handleAddTubeDepartureFromSidebar}
              isInTubeStations={
                tubeStationIds.size > 0 &&
                tubeStationIds.has(selectedSidebarItem.naptanID)
              }
            />
          )}
          {/* TfL Best Routes */}
          <SectionCard>
            <SectionHeading>⭐ TfL Best Routes</SectionHeading>
            <form onSubmit={handleAddRoute} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Origin"
                  name="origin"
                  value={partialRoute.origin}
                  onChange={handleRouteChange}
                  placeholder="e.g., King's Cross"
                  required
                />
                <InputField
                  label="Origin NaPTAN/ATCO"
                  name="originNaPTANOrATCO"
                  value={partialRoute.originNaPTANOrATCO}
                  onChange={handleRouteChange}
                  placeholder="e.g., 490G00000570"
                  required
                />
                <InputField
                  label="Destination"
                  name="destination"
                  value={partialRoute.destination}
                  onChange={handleRouteChange}
                  placeholder="e.g., London Bridge"
                  required
                />
                <InputField
                  label="Destination NaPTAN/ATCO"
                  name="destinationNaPTANOrATCO"
                  value={partialRoute.destinationNaPTANOrATCO}
                  onChange={handleRouteChange}
                  placeholder="e.g., 490G00000558"
                  required
                />
              </div>
              <Button type="submit" variant="success">
                Add TfL Route
              </Button>
            </form>

            <ItemList
              items={config?.tfl_best_routes || []}
              renderItemContent={(route) => (
                <span className="font-semibold">
                  {route.origin} → {route.destination}
                </span>
              )}
              onUpdateColumnPositions={(index, col2, col3) => updateRouteColumnPositions(index, col2, col3)}
              onRemoveItem={removeRoute}
              getColumnPositions={(route) => ({ col_2_position: route.col_2_position, col_3_position: route.col_3_position })}
            />
          </SectionCard>

          {/* Rail Departures */}
          <SectionCard>
            <SectionHeading>🚂 Rail Departures</SectionHeading>
            <form onSubmit={handleAddDeparture} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Origin Station"
                  name="origin"
                  value={partialDeparture.origin}
                  onChange={handleDepartureChange}
                  placeholder="e.g., London Paddington"
                  required
                />
                <InputField
                  label="Origin Code"
                  name="originCode"
                  value={partialDeparture.originCode}
                  onChange={handleDepartureChange}
                  placeholder="e.g., PAD"
                  required
                />
                <InputField
                  label="Destination Station"
                  name="destination"
                  value={partialDeparture.destination}
                  onChange={handleDepartureChange}
                  placeholder="e.g., Reading"
                  required
                />
                <InputField
                  label="Destination Code"
                  name="destinationCode"
                  value={partialDeparture.destinationCode}
                  onChange={handleDepartureChange}
                  placeholder="e.g., RDG"
                  required
                />
              </div>
              <Button type="submit" variant="success">
                Add Rail Departure
              </Button>
            </form>

            <ItemList
              items={config?.rail_departures || []}
              renderItemContent={(departure) => (
                <div>
                  <span className="font-semibold">
                    {departure.origin} → {departure.destination}
                  </span>
                  <span className="text-gray-400 ml-2">
                    ({departure.originCode} → {departure.destinationCode})
                  </span>
                </div>
              )}
              onUpdateColumnPositions={(index, col2, col3) => updateDepartureColumnPositions(index, col2, col3)}
              onRemoveItem={removeDeparture}
              getColumnPositions={(departure) => ({ col_2_position: departure.col_2_position, col_3_position: departure.col_3_position })}
            />
          </SectionCard>

          {/* Tube Departures */}
          <SectionCard>
            <SectionHeading>🚇 Tube Departures</SectionHeading>
            <form onSubmit={handleAddTubeDeparture} className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Station Name"
                  name="stationName"
                  value={partialTubeDeparture.stationName}
                  onChange={handleTubeDepartureChange}
                  placeholder="e.g., King's Cross St. Pancras"
                  required
                />
                <InputField
                  label="Station ID"
                  name="stationId"
                  value={partialTubeDeparture.stationId}
                  onChange={handleTubeDepartureChange}
                  placeholder="e.g., 940GZZLUKSX"
                  required
                />
              </div>
              <Button type="submit" variant="success">
                Add Tube Station
              </Button>
            </form>

            <ItemList
              items={config?.tube_departures || []}
              renderItemContent={(departure) => (
                <div>
                  <span className="font-semibold">{departure.stationName}</span>
                </div>
              )}
              onUpdateColumnPositions={(index, col2, col3) => updateTubeDepartureColumnPositions(index, col2, col3)}
              onRemoveItem={removeTubeDeparture}
              getColumnPositions={(departure) => ({ col_2_position: departure.col_2_position, col_3_position: departure.col_3_position })}
            />
          </SectionCard>

          {/* TfL Line Status */}
          <SectionCard>
            <SectionHeading>🚇 TfL Line Status</SectionHeading>
            <div className="space-y-4">
              <Checkbox
                checked={config?.tfl_line_status?.enabled || false}
                onChange={(e) => setTflLineStatusEnabled(e.target.checked)}
                label="Enable TfL Line Status"
              />
              {config?.tfl_line_status?.enabled && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    label="Col 2 Position"
                    value={config.tfl_line_status.col_2_position?.toString() || "1"}
                    onChange={(e) => {
                      const col2 = parseInt(e.target.value) || 1;
                      updateTflLineStatusColumnPositions(col2, config.tfl_line_status.col_3_position);
                    }}
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                    ]}
                  />
                  <Select
                    label="Col 3 Position"
                    value={config.tfl_line_status.col_3_position?.toString() || "1"}
                    onChange={(e) => {
                      const col3 = parseInt(e.target.value) || 1;
                      updateTflLineStatusColumnPositions(config.tfl_line_status.col_2_position, col3);
                    }}
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                    ]}
                  />
                </div>
              )}
            </div>
          </SectionCard>
          {/* Refresh Timer */}
          <SectionCard>
            <SectionHeading>🔄 Refresh Timer</SectionHeading>
            <div className="flex items-center gap-4">
              <InputField
                label="Refresh every (seconds)"
                value={config?.refresh_timer?.toString() || "60"}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    setRefreshTimer(value);
                  }
                }}
                placeholder="60"
              />
            </div>
          </SectionCard>
          {/* Actions */}
          <SectionCard>
            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                onClick={async () => {
                  await saveConfig();
                  router.push("/");
                }}
              >
                Save & Return Home
              </Button>
              <Button variant="secondary" onClick={() => router.push("/")}>
                Cancel
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageLayout>
  );
}
