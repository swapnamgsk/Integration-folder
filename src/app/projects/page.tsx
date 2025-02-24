"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Project = { _id: string; name: string };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">📁 Projects</h1>
        <Link href="/projects/create">
          <Button className="bg-blue-600 hover:bg-blue-700">➕ Create Project</Button>
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-center">No projects found.</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}/locations`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">📍 Click to view locations</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
