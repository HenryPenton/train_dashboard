"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AddItemForm from "../components/generic/forms/AddItemForm";
import SectionHeading from "../components/text/SectionHeading";
import ItemList from "../components/generic/lists/ItemList";
import Sidebar from "../components/generic/lists/Sidebar";
import TfLStationSidebarListItem, {
  SidebarItem,
} from "../components/TfL/lists/TfLStationSidebarListItem";
import Button from "../components/generic/Button";
import { ConfigSchema } from "../validators/frontend-validators/ConfigSchema";

export default function Settings() {
  // Example data for sidebar
  const [sidebarItems, setSidebarItems] = useState<Array<SidebarItem>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] =
    useState<SidebarItem | null>(null);
  const router = useRouter();
  const [showTflLine, setShowTflLine] = useState(false);
  const [route, setRoute] = useState({
    origin: "",
    originNaPTANOrATCO: "",
    destination: "",
    destinationNaPTANOrATCO: "",
  });
  const [routes, setRoutes] = useState<Array<typeof route>>([]);

  const [refreshTimer, setRefreshTimer] = useState(300);
  const [departure, setDeparture] = useState({
    origin: "",
    originCode: "",
    destination: "",
    destinationCode: "",
  });
  const [departures, setDepartures] = useState<Array<typeof departure>>([]);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          const config = ConfigSchema.parse(data);
          setShowTflLine(config.show_tfl_lines);
          setRoutes(config.tfl_best_routes);
          setDepartures(config.rail_departures);
          setRefreshTimer(config.refresh_timer);
        }
      } catch {
        // ignore errors for now
      }
    }
    fetchConfig();

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

  const filtered = useMemo(
    () =>
      sidebarItems.filter((item) =>
        item.CommonName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [sidebarItems, searchTerm],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowTflLine(e.target.checked);
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      route.origin &&
      route.originNaPTANOrATCO &&
      route.destination &&
      route.destinationNaPTANOrATCO
    ) {
      setRoutes([...routes, route]);
      setRoute({
        origin: "",
        originNaPTANOrATCO: "",
        destination: "",
        destinationNaPTANOrATCO: "",
      });
    }
  };

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeparture({ ...departure, [e.target.name]: e.target.value });
  };

  const handleAddDeparture = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      departure.origin &&
      departure.originCode &&
      departure.destination &&
      departure.destinationCode
    ) {
      setDepartures([...departures, departure]);
      setDeparture({
        origin: "",
        originCode: "",
        destination: "",
        destinationCode: "",
      });
      // Here you would send the new departure to your backend API
    }
  };

  const handleSave = async () => {
    const payload = {
      show_tfl_lines: showTflLine,
      tfl_best_routes: routes,
      rail_departures: departures,
      refresh_timer: refreshTimer,
    };
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to save settings.");
      }
    } catch {
      alert("Failed to save settings.");
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto flex flex-col md:flex-row">
      <div className="w-full md:w-64 md:mr-8 md:mb-0 mb-8 p-0 border-0 md:border-r md:pr-4">
        <Sidebar<SidebarItem>
          items={filtered}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedId={selectedSidebarItem?.naptanID ?? null}
          setSelectedId={(id) => {
            const found =
              sidebarItems.find((item) => item.naptanID === id) || null;
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
      </div>
      {/* Main content */}
      <section className="flex-1">
        <SectionHeading className="text-2xl font-bold mb-6 text-gray-900">
          Settings
        </SectionHeading>

        {selectedSidebarItem !== null && (
          <div className="mb-8 p-4 border rounded bg-gray-50">
            <h4 className="font-semibold mb-2">Place Details</h4>
            <div className="text-lg">
              <span className="font-medium">Name:</span>{" "}
              {selectedSidebarItem.CommonName}
            </div>
            <div className="text-lg">
              <span className="font-medium">NaPTAN ID:</span>{" "}
              {selectedSidebarItem.naptanID}
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                variant="primary"
                className="px-4 py-2"
                onClick={() =>
                  setRoute((r) => ({
                    ...r,
                    origin: selectedSidebarItem.CommonName,
                    originNaPTANOrATCO: selectedSidebarItem.naptanID,
                  }))
                }
              >
                Set as Origin
              </Button>
              <Button
                variant="success"
                className="px-4 py-2"
                onClick={() =>
                  setRoute((r) => ({
                    ...r,
                    destination: selectedSidebarItem.CommonName,
                    destinationNaPTANOrATCO: selectedSidebarItem.naptanID,
                  }))
                }
              >
                Set as Destination
              </Button>
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 text-lg mb-8">
          <input
            type="checkbox"
            checked={showTflLine}
            onChange={handleChange}
          />
          Show Tube Line Status
        </label>

        <AddItemForm
          fields={[
            {
              name: "origin",
              value: route.origin,
              placeholder: "Origin Station",
            },
            {
              name: "originNaPTANOrATCO",
              value: route.originNaPTANOrATCO,
              placeholder: "Origin NaPTAN or ATCO Code",
            },
            {
              name: "destination",
              value: route.destination,
              placeholder: "Destination Station",
            },
            {
              name: "destinationNaPTANOrATCO",
              value: route.destinationNaPTANOrATCO,
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
          items={routes}
          getLabel={(r) =>
            `${r.origin} (${r.originNaPTANOrATCO}) → ${r.destination} (${r.destinationNaPTANOrATCO})`
          }
          onRemove={(idx) => setRoutes(routes.filter((_, i) => i !== idx))}
          heading="Tube Routes"
        />

        <AddItemForm
          fields={[
            {
              name: "origin",
              value: departure.origin,
              placeholder: "Origin Station",
            },
            {
              name: "originCode",
              value: departure.originCode,
              placeholder: "Origin CRS or TIPLOC",
            },
            {
              name: "destination",
              value: departure.destination,
              placeholder: "Destination Station",
            },
            {
              name: "destinationCode",
              value: departure.destinationCode,
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
          items={departures}
          getLabel={(d) =>
            `${d.origin} (${d.originCode}) → ${d.destination} (${d.destinationCode})`
          }
          onRemove={(idx) =>
            setDepartures(departures.filter((_, i) => i !== idx))
          }
          heading="Train Departures"
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
            value={refreshTimer}
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
          onClick={handleSave}
          icon={<span className="mr-2">💾</span>}
        >
          Save Settings
        </Button>
      </section>
    </main>
  );
}
