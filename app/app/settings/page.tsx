"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/settings/Sidebar";
import SectionHeading from "../components/SectionHeading";
import AddTubeRouteForm from "../components/settings/AddTubeRouteForm";
import AddTrainDepartureForm from "../components/settings/AddTrainDepartureForm";
import TubeRoutesList from "../components/settings/TubeRoutesList";
import TrainDeparturesList from "../components/settings/TrainDeparturesList";

type SidebarItem = {
  CommonName: string;
  naptanID: string;
};

export default function Settings() {
  // Example data for sidebar
  const [sidebarItems, setSidebarItems] = useState<Array<SidebarItem>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<SidebarItem | null>(null);
  const router = useRouter();
  const [showTflLine, setShowTflLine] = useState(false);
  const [route, setRoute] = useState({
    origin: "",
    originNaPTANOrATCO: "",
    destination: "",
    destinationNaPTANOrATCO: "",
  });
  const [routes, setRoutes] = useState<Array<typeof route>>([]);
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
          setShowTflLine(!!data.show_tfl_lines);
          setRoutes(
            Array.isArray(data.tfl_best_routes) ? data.tfl_best_routes : [],
          );
          setDepartures(
            Array.isArray(data.rail_departures) ? data.rail_departures : [],
          );
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
    };
    try {
      const res = await fetch("/api/save-settings", {
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
    <main className="p-8 max-w-4xl mx-auto flex">
      {/* Sidebar */}
      <Sidebar
        items={filtered}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedId={selectedSidebarItem?.naptanID ?? null}
        setSelectedId={(id) => {
          const found = sidebarItems.find((item) => item.naptanID === id) || null;
          setSelectedSidebarItem(found);
        }}
      />
      {/* Main content */}
      <section className="flex-1">
        <SectionHeading className="text-2xl font-bold mb-6 text-gray-900">
          Settings
        </SectionHeading>

        {selectedSidebarItem !== null && (
          <div className="mb-8 p-4 border rounded bg-gray-50">
            <h4 className="font-semibold mb-2">Place Details</h4>
            <div className="text-lg">
              <span className="font-medium">Name:</span> {selectedSidebarItem.CommonName}
            </div>
            <div className="text-lg">
              <span className="font-medium">NaPTAN ID:</span> {selectedSidebarItem.naptanID}
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setRoute(r => ({
                  ...r,
                  origin: selectedSidebarItem.CommonName,
                  originNaPTANOrATCO: selectedSidebarItem.naptanID
                }))}
              >
                Set as Origin
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setRoute(r => ({
                  ...r,
                  destination: selectedSidebarItem.CommonName,
                  destinationNaPTANOrATCO: selectedSidebarItem.naptanID
                }))}
              >
                Set as Destination
              </button>
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

        <AddTubeRouteForm
          route={route}
          onChange={handleRouteChange}
          onAdd={handleAddRoute}
        />

        <TubeRoutesList
          routes={routes}
          onRemove={(idx) => setRoutes(routes.filter((_, i) => i !== idx))}
        />

        <AddTrainDepartureForm
          departure={departure}
          onChange={handleDepartureChange}
          onAdd={handleAddDeparture}
        />

        <TrainDeparturesList
          departures={departures}
          onRemove={(idx) =>
            setDepartures(departures.filter((_, i) => i !== idx))
          }
        />

        <button
          onClick={handleSave}
          className="mt-8 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 w-full"
        >
          Save Settings
        </button>
      </section>
    </main>
  );
}
