"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../components/generic/Button";
import Checkbox from "../components/generic/Checkbox";
import AddItemForm from "../components/generic/forms/AddItemForm";
import ImportanceSelector from "../components/generic/ImportanceSelector";
import ItemList from "../components/generic/lists/ItemList";
import SectionHeading from "../components/text/SectionHeading";
import { SidebarItem } from "../components/TfL/lists/TfLStationSidebarListItem";
import PlaceDetails from "../components/TfL/PlaceDetails";
import TflStopSidebar from "../components/TfL/TflStopSidebar";
import { useConfigStore } from "../providers/config";

export default function Settings() {
  const {
    config,
    addDeparture,
    addRoute,
    addTubeDeparture,
    setRefreshTimer,
    fetchConfig,
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

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItem | null>(null);
  const [tubeStationIds, setTubeStationIds] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartialRoute({ ...partialRoute, [e.target.name]: e.target.value });
  };

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartialDeparture({
      ...partialDeparture,
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

  const handleAddTubeDepartureFromSidebar = (
    stationName: string,
    stationId: string,
  ) => {
    addTubeDeparture({ stationName, stationId });
  };

  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col md:flex-row">
      <div className="w-full md:w-64 md:mr-8 md:mb-0 mb-8 p-0 border-0 md:border-r md:pr-4">
        <TflStopSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSidebarItem={selectedSidebarItem}
          setSelectedSidebarItem={setSelectedSidebarItem}
          onTubeStationsChange={setTubeStationIds}
        />
      </div>
      {/* Main content */}
      <section className="flex-1">
        <SectionHeading className="text-2xl font-bold mb-6 text-gray-900">
          Settings
        </SectionHeading>

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

        <div className="mb-8">
          <h4 className="font-semibold mb-2">TFL Line Status</h4>
          <div className="p-4 border rounded bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <Checkbox
                checked={config.tfl_line_status.enabled}
                onChange={(e) => setTflLineStatusEnabled(e.target.checked)}
                label="Show Tube Line Status"
              />
            </div>
            {config.tfl_line_status.enabled && (
              <ImportanceSelector
                id="tfl-importance"
                value={config.tfl_line_status.importance}
                onChange={updateTflLineStatusImportance}
                maxImportance={
                  config.tfl_best_routes.length +
                  config.rail_departures.length +
                  config.tube_departures.length +
                  1
                }
              />
            )}
          </div>
        </div>

        <AddItemForm
          fields={[
            {
              name: "origin",
              value: partialRoute.origin,
              placeholder: "Origin Station",
            },
            {
              name: "originNaPTANOrATCO",
              value: partialRoute.originNaPTANOrATCO,
              placeholder: "Origin NaPTAN or ATCO Code",
            },
            {
              name: "destination",
              value: partialRoute.destination,
              placeholder: "Destination Station",
            },
            {
              name: "destinationNaPTANOrATCO",
              value: partialRoute.destinationNaPTANOrATCO,
              placeholder: "Destination NaPTAN or ATCO Code",
            },
          ]}
          onChange={handleRouteChange}
          onAdd={handleAddRoute}
          title="Add Tube Route"
          buttonText="Add Route"
          buttonColorClass="bg-blue-600 hover:bg-blue-700"
        />

        <ItemList
          items={config.tfl_best_routes}
          getLabel={(r) =>
            `${r.origin} (${r.originNaPTANOrATCO}) → ${r.destination} (${r.destinationNaPTANOrATCO})`
          }
          onRemove={(idx) => removeRoute(idx)}
          heading="Tube Routes"
          onImportanceChange={(idx, importance) =>
            updateRouteImportance(idx, importance)
          }
          maxImportance={
            config.tfl_best_routes.length +
            config.rail_departures.length +
            config.tube_departures.length +
            (config.tfl_line_status.enabled ? 1 : 0)
          }
        />

        <AddItemForm
          fields={[
            {
              name: "origin",
              value: partialDeparture.origin,
              placeholder: "Origin Station",
            },
            {
              name: "originCode",
              value: partialDeparture.originCode,
              placeholder: "Origin CRS or TIPLOC",
            },
            {
              name: "destination",
              value: partialDeparture.destination,
              placeholder: "Destination Station",
            },
            {
              name: "destinationCode",
              value: partialDeparture.destinationCode,
              placeholder: "Destination CRS or TIPLOC",
            },
          ]}
          onChange={handleDepartureChange}
          onAdd={handleAddDeparture}
          title="Add Train Departure"
          buttonText="Add Departure"
          buttonColorClass="bg-green-600 hover:bg-green-700"
        />

        <ItemList
          items={config.rail_departures}
          getLabel={(d) =>
            `${d.origin} (${d.originCode}) → ${d.destination} (${d.destinationCode})`
          }
          onRemove={(idx) => removeDeparture(idx)}
          heading="Train Departures"
          onImportanceChange={(idx, importance) =>
            updateDepartureImportance(idx, importance)
          }
          maxImportance={
            config.tfl_best_routes.length +
            config.rail_departures.length +
            config.tube_departures.length +
            (config.tfl_line_status.enabled ? 1 : 0)
          }
        />

        <ItemList
          items={config.tube_departures}
          getLabel={(t) => `${t.stationName} (${t.stationId})`}
          onRemove={(idx) => removeTubeDeparture(idx)}
          heading="Tube Departures"
          onImportanceChange={(idx, importance) =>
            updateTubeDepartureImportance(idx, importance)
          }
          maxImportance={
            config.tfl_best_routes.length +
            config.rail_departures.length +
            config.tube_departures.length +
            (config.tfl_line_status.enabled ? 1 : 0)
          }
        />

        {/* Refresh Timer Section */}
        <div className="mb-8 p-4 border rounded bg-gray-50">
          <label className="block font-semibold mb-2" htmlFor="refresh-timer">
            Auto-Refresh Timer (s)
          </label>
          <input
            id="refresh-timer"
            type="number"
            min={10000}
            step={1000}
            className="w-full p-2 border rounded"
            value={config.refresh_timer}
            onChange={(e) => setRefreshTimer(Number(e.target.value))}
          />
          <div className="text-sm text-gray-600 mt-1">
            How often the dashboard auto-refreshes.
          </div>
        </div>

        <Button
          type="submit"
          variant="info"
          className="mt-2 w-full justify-center"
          onClick={() => {
            saveConfig().then(() => {
              router.push("/");
            });
          }}
          icon={<span className="mr-2">💾</span>}
        >
          Save Settings
        </Button>
      </section>
    </main>
  );
}
