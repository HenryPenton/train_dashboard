import React from "react";

interface AddTubeRouteFormProps {
  route: {
    origin: string;
    originNaPTANOrATCO: string;
    destination: string;
    destinationNaPTANOrATCO: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (e: React.FormEvent) => void;
}

export default function AddTubeRouteForm({ route, onChange, onAdd }: AddTubeRouteFormProps) {
  return (
    <form
      onSubmit={onAdd}
      className="mb-8 p-4 border rounded bg-gray-50"
    >
      <h3 className="font-semibold mb-4">Add Tube Route</h3>
      <div className="mb-2">
        <input
          type="text"
          name="origin"
          value={route.origin}
          onChange={onChange}
          placeholder="Origin Station"
          className="border px-2 py-1 w-full mb-2"
          required
        />
        <input
          type="text"
          name="originNaPTANOrATCO"
          value={route.originNaPTANOrATCO}
          onChange={onChange}
          placeholder="Origin NaPTAN or ATCO Code"
          className="border px-2 py-1 w-full mb-2"
          required
        />
        <input
          type="text"
          name="destination"
          value={route.destination}
          onChange={onChange}
          placeholder="Destination Station"
          className="border px-2 py-1 w-full mb-2"
          required
        />
        <input
          type="text"
          name="destinationNaPTANOrATCO"
          value={route.destinationNaPTANOrATCO}
          onChange={onChange}
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
  );
}
