"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function Settings() {
  const [showTflLine, setShowTflLine] = useState(false);
  const [route, setRoute] = useState({
    origin: "",
    originNaptan: "",
    destination: "",
    destinationNaptan: "",
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
      route.originNaptan &&
      route.destination &&
      route.destinationNaptan
    ) {
      setRoutes([...routes, route]);
      setRoute({
        origin: "",
        originNaptan: "",
        destination: "",
        destinationNaptan: "",
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
        alert("Settings saved!");
      } else {
        alert("Failed to save settings.");
      }
    } catch {
      alert("Failed to save settings.");
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <label className="flex items-center gap-2 text-lg mb-8">
        <input type="checkbox" checked={showTflLine} onChange={handleChange} />
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
            name="originNaptan"
            value={route.originNaptan}
            onChange={handleRouteChange}
            placeholder="Origin Naptan Code"
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
            name="destinationNaptan"
            value={route.destinationNaptan}
            onChange={handleRouteChange}
            placeholder="Destination Naptan Code"
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
            <li key={i} className="mb-1">
              {r.origin} ({r.originNaptan}) → {r.destination} (
              {r.destinationNaptan})
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
            <li key={i} className="mb-1">
              {d.origin} ({d.originCode}) → {d.destination} ({d.destinationCode}
              )
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
    </main>
  );
}
