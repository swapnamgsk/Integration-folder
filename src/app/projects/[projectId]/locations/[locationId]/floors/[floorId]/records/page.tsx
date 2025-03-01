"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecordsPage({ params }: { params: { projectId: string, locationId: string, floorId: string } }) {
    const { projectId, locationId, floorId } = params;
    
    const [projectName, setProjectName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [floorName, setFloorName] = useState("");
    const [startRecord, setStartRecord] = useState<any>(null);
    const [endRecord, setEndRecord] = useState<any>(null);

    useEffect(() => {
        async function fetchDetails() {
            try {
                const { data } = await axios.get(`/api/projects/${projectId}/locations/${locationId}/floors/${floorId}/records`);

                setProjectName(data.projectName);
                setLocationName(data.locationName);
                setFloorName(data.floorName);
                setStartRecord(data.startRecord);
                setEndRecord(data.endRecord);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        }
        fetchDetails();
    }, [projectId, locationId, floorId]);

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold">Project: {projectName}</h1>
            <h2 className="text-lg font-semibold">Location: {locationName}</h2>
            <h3 className="text-md font-medium mb-4">Floor: {floorName}</h3>

            {/* Start Record Section */}
            <div className="border p-4 rounded-md mb-4">
                <h4 className="text-lg font-bold">Start Record Details:</h4>
                {startRecord ? (
                    <>
                        <p><strong>Plumber Name:</strong> {startRecord.plumberName}</p>
                        <img src={startRecord.image} alt="Start Record Image" className="w-32 h-32 mt-2 border" />
                        <p><strong>Pressure:</strong> {startRecord.pressure}</p>
                        <p><strong>Timings:</strong> {new Date(startRecord.timing).toLocaleString()}</p>
                    </>
                ) : <p className="text-red-500">No start record found.</p>}
            </div>

            {/* End Record Section */}
            <div className="border p-4 rounded-md">
                <h4 className="text-lg font-bold">End Record Details:</h4>
                {endRecord ? (
                    <>
                        <p><strong>Plumber Name:</strong> {endRecord.plumberName}</p>
                        <img src={endRecord.image} alt="End Record Image" className="w-32 h-32 mt-2 border" />
                        <p><strong>Pressure:</strong> {endRecord.pressure}</p>
                        <p><strong>Timings:</strong> {new Date(endRecord.timing).toLocaleString()}</p>
                    </>
                ) : <p className="text-red-500">No end record found.</p>}
            </div>
        </div>
    );
}
