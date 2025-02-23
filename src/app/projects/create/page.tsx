"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProject() {
  const [name, setName] = useState("");
  const router = useRouter();

  const createProject = async () => {
    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/projects");
    }
  };

  return (
    <div>
      <h1>Create Project</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project Name" />
      <button onClick={createProject}>Create</button>
    </div>
  );
}
