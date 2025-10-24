import React from "react";

interface AddTrainDepartureFormProps {
  departure: {
    origin: string;
    originCode: string;
    destination: string;
    destinationCode: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (e: React.FormEvent) => void;
}

export default function AddTrainDepartureForm({ departure, onChange, onAdd }: AddTrainDepartureFormProps) {
  return (
    <form
      onSubmit={onAdd}
      className="mb-8 p-4 border rounded bg-gray-50"
    >
      <h3 className="font-semibold mb-4">Add Train Departure</h3>
      <div className="mb-2">
        <input
          type="text"
          name="origin"
          value={departure.origin}
          onChange={onChange}
          placeholder="Origin Station"
          className="border px-2 py-1 w-full mb-2"
          required
        />
        <input
          type="text"
          name="originCode"
          value={departure.originCode}
          onChange={onChange}
          placeholder="Origin Code"
          className="border px-2 py-1 w-full mb-2"
          required
        />
        <input
          type="text"
          name="destination"
          value={departure.destination}
          onChange={onChange}
          placeholder="Destination Station"
          className="border px-2 py-1 w-full mb-2"
          required
        />
        <input
          type="text"
          name="destinationCode"
          value={departure.destinationCode}
          onChange={onChange}
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
  );
}
