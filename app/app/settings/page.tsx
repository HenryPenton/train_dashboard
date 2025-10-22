"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  // Example data for sidebar
  const [sidebarItems, setSidebarItems] = useState<Array<{ CommonName: string; ATCOCode: string }>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSidebarIndex, setSelectedSidebarIndex] = useState<
    number | null
  >(null);
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
            Array.isArray(data.tfl_best_routes) ? data.tfl_best_routes : []
          );
          setDepartures(
            Array.isArray(data.rail_departures) ? data.rail_departures : []
          );
        }
      } catch {
        // ignore errors for now
      }
    }
    fetchConfig();

    async function fetchSidebarItems() {
      try {
        const res = await fetch("/api/atco-code");
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
      // Here you would send the new route to your backend API
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
      <aside className="w-64 h-[500px] overflow-y-auto border-r pr-4 mr-8">
        <h3 className="font-semibold mb-4">Stations</h3>
        <input
          type="text"
          placeholder="Search stations..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-4 px-2 py-1 border w-full rounded"
        />
        <ul>
          {sidebarItems
            .filter(item =>
              item.CommonName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item, idx) => (
              <li
                key={idx}
                className={`mb-2 cursor-pointer px-2 py-1 rounded ${
                  selectedSidebarIndex === idx
                    ? "bg-purple-100 font-bold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedSidebarIndex(idx)}
              >
                {item.CommonName}
              </li>
            ))}
        </ul>
      </aside>
      {/* Main content */}
      <section className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
        {/* ATCO code detail panel */}
        {selectedSidebarIndex !== null && (
          <div className="mb-8 p-4 border rounded bg-gray-50">
            <h4 className="font-semibold mb-2">ATCO Code</h4>
            <div className="text-lg">
              {sidebarItems[selectedSidebarIndex].ATCOCode}
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

        <form
          onSubmit={handleAddRoute}
          className="mb-8 p-4 border rounded bg-gray-50"
        >
          <h3 className="font-semibold mb-4">Add Tube Route</h3>
          <div className="mb-2">
            <input
              type="text"
              name="origin"
              value={route.origin}
              onChange={handleRouteChange}
              placeholder="Origin Station"
              className="border px-2 py-1 w-full mb-2"
              required
            />
            <input
              type="text"
              name="originNaPTANOrATCO"
              value={route.originNaPTANOrATCO}
              onChange={handleRouteChange}
              placeholder="Origin NaPTAN or ATCO Code"
              className="border px-2 py-1 w-full mb-2"
              required
            />
            <input
              type="text"
              name="destination"
              value={route.destination}
              onChange={handleRouteChange}
              placeholder="Destination Station"
              className="border px-2 py-1 w-full mb-2"
              required
            />
            <input
              type="text"
              name="destinationNaPTANOrATCO"
              value={route.destinationNaPTANOrATCO}
              onChange={handleRouteChange}
              placeholder="Destination NaPTAN or ATCO Code"
              className="border px-2 py-1 w-full mb-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Route
          </button>
        </form>

        <div className="mb-10">
          <h4 className="font-semibold mb-2">Tube Routes</h4>
          <ul>
            {routes.map((r, i) => (
              <li key={i} className="mb-1 flex items-center justify-between">
                <span>
                  {r.origin} ({r.originNaPTANOrATCO}) → {r.destination} (
                  {r.destinationNaPTANOrATCO})
                </span>
                <button
                  type="button"
                  aria-label="Remove route"
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  onClick={() => {
                    setRoutes(routes.filter((_, idx) => idx !== i));
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleAddDeparture}
          className="mb-8 p-4 border rounded bg-gray-50"
        >
          <h3 className="font-semibold mb-4">Add Train Departure</h3>
          <div className="mb-2">
            <input
              type="text"
              name="origin"
              value={departure.origin}
              onChange={handleDepartureChange}
              placeholder="Origin Station"
              className="border px-2 py-1 w-full mb-2"
              required
            />
            <input
              type="text"
              name="originCode"
              value={departure.originCode}
              onChange={handleDepartureChange}
              placeholder="Origin Code"
              className="border px-2 py-1 w-full mb-2"
              required
            />
            <input
              type="text"
              name="destination"
              value={departure.destination}
              onChange={handleDepartureChange}
              placeholder="Destination Station"
              className="border px-2 py-1 w-full mb-2"
              required
            />
            <input
              type="text"
              name="destinationCode"
              value={departure.destinationCode}
              onChange={handleDepartureChange}
              placeholder="Destination Code"
              className="border px-2 py-1 w-full mb-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Departure
          </button>
        </form>

        <div>
          <h4 className="font-semibold mb-2">Train Departures</h4>
          <ul>
            {departures.map((d, i) => (
              <li key={i} className="mb-1 flex items-center justify-between">
                <span>
                  {d.origin} ({d.originCode}) → {d.destination} (
                  {d.destinationCode})
                </span>
                <button
                  type="button"
                  aria-label="Remove departure"
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  onClick={() => {
                    setDepartures(departures.filter((_, idx) => idx !== i));
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

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
