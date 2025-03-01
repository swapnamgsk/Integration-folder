'use client'

import CreateLocation from "@/app/components/CreateLocation";
import { useParams } from "next/navigation";

export default function ProjectDetails() {
  const params = useParams(); // Use the new Next.js way
  const projectId = params?.projectId as string; // Extract projectId

  return (
    <div>
      <h1>Project Details</h1>
      <CreateLocation projectId={projectId} />
    </div>
  );
}
