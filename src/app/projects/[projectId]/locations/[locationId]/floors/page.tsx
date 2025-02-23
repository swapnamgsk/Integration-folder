"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Floor {
  _id: string;
  name: string;
}

export default function FloorsPage() {
  const params = useParams(); // ✅ Unwrap params
  const { projectId, locationId } = params as { projectId: string; locationId: string };

  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorName, setFloorName] = useState("");

  // ✅ Fetch Floors for the selected location
  useEffect(() => {
    async function fetchFloors() {
      if (!projectId || !locationId) return;

      const res = await fetch(`/api/projects/${projectId}/locations/${locationId}/floors`);
      if (res.ok) {
        const data = await res.json();
        setFloors(data);
      } else {
        console.error("Failed to fetch floors");
      }
    }
    fetchFloors();
  }, [projectId, locationId]);

  // ✅ Create a New Floor
  async function createFloor() {
    if (!floorName) return alert("Enter a floor name!");
    if (!projectId || !locationId) return alert("Invalid project/location");

    const res = await fetch(`/api/projects/${projectId}/locations/${locationId}/floors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ floorName }),
    });

    if (res.ok) {
      const newFloor = await res.json();
      setFloors([...floors, newFloor.floor]); // Update UI
      setFloorName(""); // Reset input
    } else {
      alert("Failed to create floor");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">🏢 Manage Floors</h1>

      {/* Floor List */}
      <ul className="mt-4">
        {floors.map((floor) => (
          <li key={floor._id} className="p-2 border-b">{floor.name}</li>
        ))}
      </ul>

      {/* Add Floor Form */}
      <div className="mt-4">
        <input
          type="text"
          value={floorName}
          onChange={(e) => setFloorName(e.target.value)}
          placeholder="Enter floor name"
          className="p-2 border rounded mr-2"
        />
        <button onClick={createFloor} className="p-2 bg-blue-500 text-white rounded">Add Floor</button>
      </div>
    </div>
  );
}
