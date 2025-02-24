"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RecordsList from "@/app/components/CreateRecordModal";

export default function RecordsPage() {
  const params = useParams();
  const { projectId, locationId, floorId } = params as { projectId: string; locationId: string; floorId: string };

  const router = useRouter();
  const [records, setRecords] = useState<any[]>([]);
  const [plumberName, setPlumberName] = useState("");
  const [pressure, setPressure] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);

  // ✅ Automatically create "Start" record when the page loads
  useEffect(() => {
    async function createStartRecord() {
      if (!projectId || !locationId || !floorId) return;

      const res = await fetch(`/api/projects/${projectId}/locations/${locationId}/floors/${floorId}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordType: "Start" }),
      });

      if (!res.ok) {
        console.error("Failed to create Start record");
      }
    }

    createStartRecord();
  }, [projectId, locationId, floorId]);

  // ✅ Fetch and display only "End" records
  useEffect(() => {
    async function fetchEndRecords() {
      if (!projectId || !locationId || !floorId) return;

      const res = await fetch(`/api/projects/${projectId}/locations/${locationId}/floors/${floorId}/records`);
      if (res.ok) {
        const data = await res.json();
        const endRecords = data.filter((record: any) => record.recordType === "End");
        setRecords(endRecords);
      } else {
        console.error("Failed to fetch records");
      }
    }

    fetchEndRecords();
  }, [projectId, locationId, floorId]);

  // ✅ Create "End" record
  async function createEndRecord() {
    if (!plumberName || !image) return alert("Enter all details!");

    const formData = new FormData();
    formData.append("recordType", "End");
    formData.append("pressure", pressure.toString());
    formData.append("plumberName", plumberName);
    formData.append("image", image);

    const res = await fetch(`/api/projects/${projectId}/locations/${locationId}/floors/${floorId}/records`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newRecord = await res.json();
      setRecords([...records, newRecord.record]);
    } else {
      alert("Failed to create End record");
    }
  }

  return (
    <div className="p-6">
      <RecordsList />
      <h1 className="text-xl font-bold">📋 Floor Records</h1>

      {/* Form Fields for "End" Record */}
      <input type="text" value={plumberName} onChange={(e) => setPlumberName(e.target.value)} placeholder="Plumber Name" />
      <input type="number" value={pressure} onChange={(e) => setPressure(Number(e.target.value))} placeholder="Pressure" />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button onClick={createEndRecord}>Add End Record</button>

      {/* Display End Records */}
      <ul className="mt-4">
        {records.map((record) => (
          <li key={record._id} className="p-2 border-b">{record.plumberName} - {record.pressure} PSI</li>
        ))}
      </ul>
    </div>
  );
}
