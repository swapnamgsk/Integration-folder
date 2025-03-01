"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function RecordsPage() {
    const params = useParams();
    if (!params) return <p>Loading...</p>;

    const { projectId, locationId, floorId } = params as { projectId: string, locationId: string, floorId: string };

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ pressure: "", plumberName: "", image: null });

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(`/api/projects/${projectId}/locations/${locationId}/floors/${floorId}/records`);
            setData(res.data);
            setLoading(false);
        }
        fetchData();
    }, [projectId, locationId, floorId]);

    const handleFileChange = (e: any) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("pressure", form.pressure);
        formData.append("plumberName", form.plumberName);
        if (form.image) { // ✅ Ensure that image is not null
            formData.append("image", form.image);
        }
    

        await axios.post(`/api/projects/${projectId}/locations/${locationId}/floors/${floorId}/records`, formData);
        location.reload();
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    const { projectName, locationName, floorName, startRecord, endRecord } = data;
    const showForm = !(startRecord && endRecord);

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold">Project : {projectName}</h1>
            <h2 className="text-lg font-semibold">Location : {locationName}</h2>
            <h3 className="text-md font-medium mb-4">Floor : {floorName}</h3>

            {startRecord && (
                <div className="border p-4 rounded-md mb-4">
                    <h4 className="text-lg font-bold">Start Record</h4>
                    <img src={startRecord.image} alt="Start Record" className="w-32 h-32 mt-2 border" />
                    <p><strong>Plumber Name:</strong> {startRecord.plumberName}</p>
                    <p><strong>Pressure:</strong> {startRecord.pressure}</p>
                    <p><strong>Time:</strong> {new Date(startRecord.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}</p>
                    </div>
            )}

            {endRecord && (
                <div className="border p-4 rounded-md">
                    <h4 className="text-lg font-bold">End Record</h4>
                    <img src={endRecord.image} alt="End Record" className="w-32 h-32 mt-2 border" />
                    <p><strong>Pressure:</strong> {endRecord.pressure}</p>
                    <p><strong>Time:</strong> {new Date(endRecord.createdAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}</p>
                    </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <label>Plumber Name:</label>
                    <input type="text" value={form.plumberName} onChange={(e) => setForm({ ...form, plumberName: e.target.value })} required />
                    <label>Pressure:</label>
                    <input type="number" value={form.pressure} onChange={(e) => setForm({ ...form, pressure: e.target.value })} required />
                    <label>Upload Image:</label>
                    <input type="file" onChange={handleFileChange} required />
                    <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">Submit</button>
                </form>
            )}
        </div>
    );
}
