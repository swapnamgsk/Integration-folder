"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 

// Define the expected structure of a floor record
interface FloorRecord {
  _id: string;
  projectName: string;
  locationName: string;
  floorName: string;
  recordType: "Start" | "End";
  pressure: number;
  plumberName: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const RecordsPage = () => {
  const params = useParams(); 
  const [records, setRecords] = useState<FloorRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch(
          `/api/projects/${params.projectId}/locations/${params.locationId}/floors/${params.floorId}/records`
        );
        const data: FloorRecord[] = await response.json();
        console.log("Fetched Records:", data);
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, [params]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Floor Records</h1>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        records.map((record) => (
          <div key={record._id} className="border p-4 mb-4 rounded-lg shadow">
            <p><strong>Project Name:</strong> {record.projectName}</p>
            <p><strong>Location:</strong> {record.locationName}</p>
            <p><strong>Floor:</strong> {record.floorName}</p>
            <p><strong>Record Type:</strong> {record.recordType}</p>
            <p><strong>Pressure:</strong> {record.pressure} PSI</p>
            <p><strong>Plumber Name:</strong> {record.plumberName}</p>
            <p>
              <strong>Image:</strong> <br />
              <img 
                src={record.imageUrl} 
                alt="Record Image" 
                className="w-32 h-32 object-cover rounded-md mt-2"
              />
            </p>
            <p><strong>Created At:</strong> {new Date(record.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(record.updatedAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default RecordsPage;