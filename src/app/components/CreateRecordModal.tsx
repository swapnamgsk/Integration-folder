"use client";

import { useState } from "react";

export default function CreateRecordModal({ floorId, onClose }: { floorId: string; onClose: () => void }) {
  const [plumberName, setPlumberName] = useState("");
  const [recordType, setRecordType] = useState("Start");
  const [pressureReading, setPressureReading] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("plumberName", plumberName);
    formData.append("recordType", recordType);
    formData.append("pressureReading", pressureReading);
    if (image) formData.append("image", image);

    await fetch(`/api/projects/locations/floors/records`, {
      method: "POST",
      body: formData,
    });

    onClose();
    window.location.reload(); // Refresh to show the new record
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create Record</h2>

        <label className="block font-medium mb-1">Plumber Name</label>
        <input
          type="text"
          value={plumberName}
          onChange={(e) => setPlumberName(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block font-medium mb-1">Record Type</label>
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        >
          <option value="Start">Start</option>
          <option value="End">End</option>
        </select>

        <label className="block font-medium mb-1">Pressure Reading</label>
        <input
          type="number"
          value={pressureReading}
          onChange={(e) => setPressureReading(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        />

        <label className="block font-medium mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full border rounded-md p-2 mb-3"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
