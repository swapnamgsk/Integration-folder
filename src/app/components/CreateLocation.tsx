"use client";
import { useState } from "react";

export default function CreateLocation({ projectId }: { projectId: string }) {
  const [name, setName] = useState("");

  const createLocation = async () => {
    const res = await fetch(`/api/projects/${projectId}/locations`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setName("");
      alert("Location created successfully!");
    }
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Location Name" />
      <button onClick={createLocation}>Create</button>
    </div>
  );
}
