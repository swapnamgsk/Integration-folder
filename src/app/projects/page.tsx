"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Project = { _id: string; name: string };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      <Link href="/projects/create">Create Project</Link>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <Link href={`/projects/${project._id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
