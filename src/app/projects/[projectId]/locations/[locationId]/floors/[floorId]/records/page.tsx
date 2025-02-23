"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import RecordsList from "@/app/components/CreateRecordModal";

export default function RecordsPage() {
  const params = useParams();
  const { projectId, locationId, floorId } = params as { projectId: string; locationId: string; floorId: string };

  const [projects, setProjects] = useState<any[]>([]);

 const router = useRouter();
  const [locations, setLocations] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  const [recordType, setRecordType] = useState("Start");
  const [pressure, setPressure] = useState<number>(0);
  const [plumberName, setPlumberName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/projects");
      setProjects(await res.json());
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchLocations() {
      if (!selectedProject) return;
      const res = await fetch(`/api/projects/${selectedProject}/locations`);
      setLocations(await res.json());
    }
    fetchLocations();
  }, [selectedProject]);

  useEffect(() => {
    async function fetchFloors() {
      if (!selectedLocation) return;
      const res = await fetch(`/api/projects/${selectedProject}/locations/${selectedLocation}/floors`);
      setFloors(await res.json());
    }
    fetchFloors();
  }, [selectedLocation]);

  async function createRecord() {
    if (!recordType || !plumberName || !image) return alert("Enter all details!");

    const formData = new FormData();
    formData.append("recordType", recordType);
    formData.append("pressure", pressure.toString());
    formData.append("plumberName", plumberName);
    formData.append("image", image);

    const res = await fetch(`/api/projects/${selectedProject}/locations/${selectedLocation}/floors/${selectedFloor}/records`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newRecord = await res.json();
      setRecords([...records, newRecord.record]);
      router.push("/components/records"); // Redirect after form submission

    } else {
      alert("Failed to create record");
    }
  }

  return (
    <div className="p-6">
      <RecordsList />
      <h1 className="text-xl font-bold">📋 Floor Records</h1>

      {/* Project Dropdown */}
      <select onChange={(e) => setSelectedProject(e.target.value)}>
        <option value="">Select Project</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      {/* Location Dropdown */}
      <select onChange={(e) => setSelectedLocation(e.target.value)}>
        <option value="">Select Location</option>
        {locations.map((l) => (
          <option key={l._id} value={l._id}>{l.name}</option>
        ))}
      </select>

      {/* Floor Dropdown */}
      <select onChange={(e) => setSelectedFloor(e.target.value)}>
        <option value="">Select Floor</option>
        {floors.map((f) => (
          <option key={f._id} value={f._id}>{f.name}</option>
        ))}
      </select>

      {/* Form Fields */}
      <input type="text" value={plumberName} onChange={(e) => setPlumberName(e.target.value)} placeholder="Plumber Name" />
      <select onChange={(e) => setRecordType(e.target.value)}>
        <option value="Start">Start</option>
        <option value="End">End</option>
      </select>
      <input type="number" value={pressure} onChange={(e) => setPressure(Number(e.target.value))} placeholder="Pressure" />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button onClick={createRecord}>Add Record</button>
    </div>
    
  );
  
}



