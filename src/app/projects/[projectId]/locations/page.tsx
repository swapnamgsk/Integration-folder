"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define Type for Locations
type LocationType = {
  _id: string;
  name: string;
};

const LocationsPage = ({ params }: { params: { projectId: string } }) => {
  const { projectId } = params;
  const router = useRouter();
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${projectId}/locations`)
      .then((res) => res.json())
      .then((data: LocationType[]) => setLocations(data)); // Set correct type
  }, []);

  const handleAddLocation = async () => {
    if (!newLocation) return;

    const res = await fetch(`/api/projects/${projectId}/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newLocation }),
    });

    if (res.ok) {
      const createdLocation: LocationType = await res.json();
      setLocations([...locations, createdLocation]);
      setNewLocation("");
    }
  };

  const handleLocationClick = (locationId: string) => {
    router.push(`/projects/${projectId}/locations/${locationId}/floors`);
  };

  return (
    <div>
      <h2>Locations for Project {projectId}</h2>
      <input
        type="text"
        placeholder="Add Location"
        value={newLocation}
        onChange={(e) => setNewLocation(e.target.value)}
      />
      <button onClick={handleAddLocation}>Add Location</button>

      {locations.map((location) => (
        <button key={location._id} onClick={() => handleLocationClick(location._id)}>
          {location.name}
        </button>
      ))}
    </div>
  );
};

export default LocationsPage;
