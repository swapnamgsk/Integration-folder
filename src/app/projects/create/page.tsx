"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProject() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createProject = async () => {
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      await router.push("/projects"); // Ensure navigation happens after the request
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create Project</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
        className="border p-2 w-full rounded"
        disabled={loading}
      />
      <button
        onClick={createProject}
        disabled={loading}
        className="mt-2 bg-blue-600 text-white p-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </div>
  );
}
