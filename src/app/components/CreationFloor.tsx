import { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
}

interface Location {
  _id: string;
  name: string;
}

interface Floor {
  _id: string;
  name: string;
}

export default function FloorManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorName, setFloorName] = useState<string>("");

  // ✅ Fetch Projects
  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    }
    fetchProjects();
  }, []);

  // ✅ Fetch Locations when a project is selected
  async function fetchLocations(projectId: string) {
    setSelectedProject(projectId);
    setSelectedLocation(null);
    setFloors([]);
    const res = await fetch(`/api/projects/${projectId}/locations`);
    const data = await res.json();
    setLocations(data);
  }

  // ✅ Fetch Floors when a location is selected
  async function fetchFloors(locationId: string) {
    setSelectedLocation(locationId);
    const res = await fetch(`/api/projects/${selectedProject}/locations/${locationId}/floors`);
    const data = await res.json();
    setFloors(data);
  }

  // ✅ Handle Creating a New Floor
  async function createFloor() {
    if (!selectedLocation || !floorName) return alert("Select a location & enter floor name!");

    const res = await fetch(`/api/projects/${selectedProject}/locations/${selectedLocation}/floors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ floorName }),
    });

    if (res.ok) {
      const newFloor = await res.json();
      setFloors([...floors, newFloor.floor]);
      setFloorName("");
    } else {
      alert("Failed to create floor!");
    }
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🏗 Select a Project</h2>
      <select onChange={(e) => fetchLocations(e.target.value)} defaultValue="">
        <option value="" disabled>Select a Project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>{project.name}</option>
        ))}
      </select>

      {selectedProject && (
        <>
          <h3>📍 Select a Location</h3>
          <select onChange={(e) => fetchFloors(e.target.value)} defaultValue="">
            <option value="" disabled>Select a Location</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>{location.name}</option>
            ))}
          </select>
        </>
      )}

      {selectedLocation && (
        <div>
          <h3>🏢 Floors in Location</h3>
          <ul>
            {floors.map((floor) => (
              <li key={floor._id}>{floor.name}</li>
            ))}
          </ul>

          <h3>➕ Add a Floor</h3>
          <input value={floorName} onChange={(e) => setFloorName(e.target.value)} placeholder="Enter floor name" />
          <button onClick={createFloor}>Create Floor</button>
        </div>
      )}
    </div>
  );
}