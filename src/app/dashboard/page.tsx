"use client";

// import RecordsPage from "../projects/[projectId]/locations/[locationId]/floors/[floorId]/records/page"
import ProjectDetails from "../projects/page"
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6"> Hello
          {/* <RecordsPage /> */}
          <ProjectDetails />
        </h1>
      </div>
    </div>
  );
}
