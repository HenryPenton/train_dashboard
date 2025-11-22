"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfigStore } from "../providers/config";
import PageLayout from "../components/layout/PageLayout";
import SectionCard from "../components/common/SectionCard";
import SectionHeading from "../components/common/SectionHeading";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import Checkbox from "../components/common/Checkbox";
import TflStopSidebar from "../components/tfl/TflStopSidebar";
import PlaceDetails from "../components/tfl/PlaceDetails";
import { SidebarItem } from "../components/tfl/lists/TfLStationSidebarListItem";

export default function Settings() {
  const {
    config,
    addDeparture,
    addRoute,
    addTubeDeparture,
    setRefreshTimer,
    removeDeparture,
    removeRoute,
    removeTubeDeparture,
    saveConfig,
    updateRouteImportance,
    updateDepartureImportance,
    updateTubeDepartureImportance,
    updateTflLineStatusImportance,
    setTflLineStatusEnabled,
  } = useConfigStore((state) => state);

  const router = useRouter();

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

            {config?.tfl_best_routes && config.tfl_best_routes.length > 0 && (
              <div className="space-y-2">
                {config.tfl_best_routes.map((route, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#2a2d35] rounded"
                  >
                    <div>
                      <span className="font-semibold">
                        {route.origin} → {route.destination}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <InputField
                        label=""
                        value={route.importance?.toString() || "1"}
                        onChange={(e) =>
                          updateRouteImportance(
                            index,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-20"
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeRoute(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            {config?.rail_departures && config.rail_departures.length > 0 && (
              <div className="space-y-2">
                {config.rail_departures.map((departure, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#2a2d35] rounded"
                  >
                    <div>
                      <span className="font-semibold">
                        {departure.origin} → {departure.destination}
                      </span>
                      <span className="text-gray-400 ml-2">
                        ({departure.originCode} → {departure.destinationCode})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <InputField
                        label=""
                        value={departure.importance?.toString() || "1"}
                        onChange={(e) =>
                          updateDepartureImportance(
                            index,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-20"
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeDeparture(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

            {config?.tube_departures && config.tube_departures.length > 0 && (
              <div className="space-y-2">
                {config.tube_departures.map((departure, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[#2a2d35] rounded"
                  >
                    <div>
                      <span className="font-semibold">
                        {departure.stationName}
                      </span>
                      <span className="text-gray-400 ml-2">
                        ({departure.stationId})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <InputField
                        label=""
                        value={departure.importance?.toString() || "1"}
                        onChange={(e) =>
                          updateTubeDepartureImportance(
                            index,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-20"
                      />
                      <Button
                        variant="danger"
                        onClick={() => removeTubeDeparture(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <InputField
                  label="Importance (1 = highest priority)"
                  value={config.tfl_line_status.importance?.toString() || "1"}
                  onChange={(e) =>
                    updateTflLineStatusImportance(parseInt(e.target.value) || 1)
                  }
                  placeholder="1"
                />
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
                onClick={() => {
                  saveConfig();
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
