"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Record {
  _id: string;
  plumberName: string;
  recordType: string;
  pressure: number;
  imageUrl?: string;
  formattedDate: string;
  projectName: string;
  locationName: string;
  floorName: string;
}

export default function RecordsList() {
  const { projectId, locationId, floorId } = useParams();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/locations/${locationId}/floors/${floorId}/records`);
        if (!res.ok) throw new Error("Failed to fetch records");
        const data = await res.json();
        setRecords(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [projectId, locationId, floorId]);

  if (loading) return <Skeleton className="h-40 w-full" />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Records List</CardTitle>
      </CardHeader>
      <CardContent>
        {records.length > 0 ? (
          <>
            {/* Show Project, Location, and Floor Names */}
            <div className="mb-4 text-lg font-semibold text-gray-700">
              <p>📌 Project: <span className="text-blue-600">{records[0].projectName}</span></p>
              <p>📍 Location: <span className="text-blue-600">{records[0].locationName}</span></p>
              <p>🏢 Floor: <span className="text-blue-600">{records[0].floorName}</span></p>
            </div>

            {/* Table Displaying Records */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plumber Name</TableHead>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Pressure</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.plumberName}</TableCell>
                    <TableCell>{record.recordType}</TableCell>
                    <TableCell>{record.pressure} PSI</TableCell>
                    <TableCell>
                      {record.imageUrl ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${record.imageUrl}`} 
                          alt="Record" 
                          className="w-12 h-12 rounded-md object-cover"
                          onError={(e) => { e.currentTarget.src = "/default-image.jpg"; }}
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </TableCell>
                    <TableCell>{record.formattedDate}</TableCell>
                    <TableCell>
                      <Link href={`/projects/${projectId}/locations/${locationId}/floors/${floorId}/records/${record._id}`} className="text-blue-600 underline">
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <p className="text-center text-gray-500">No records found.</p>
        )}
      </CardContent>
    </Card>
  );
}
