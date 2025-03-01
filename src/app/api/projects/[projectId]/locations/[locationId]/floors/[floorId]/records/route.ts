import { NextRequest, NextResponse } from "next/server";
import Record from "@/models/Record";
import multer from "multer";
import { writeFile } from "fs/promises";
import path from "path";
import { connect } from "mongoose";
import { connectToDatabase } from "@/utils/db";
import Project from "@/models/MainProject";
import Location from "@/models/Location";
import Floor from "@/models/Floor";


connectToDatabase(); // Ensure MongoDB is connected

// Configure Multer storage
const upload = multer({ dest: "/tmp/uploads/" });

// Utility function to handle file upload
async function handleFileUpload(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(process.cwd(), "public/uploads", file.name);
    await writeFile(filePath, buffer);
    return `/uploads/${file.name}`;
}
export async function GET(req: Request, { params }: { params: { projectId: string, locationId: string, floorId: string } }) {
    await connectToDatabase();

    const { projectId, locationId, floorId } = params;

    // Fetch project, location, and floor names
    const project = await Project.findById(projectId);
    const location = await Location.findById(locationId);
    const floor = await Floor.findById(floorId);

    if (!project || !location || !floor) {
        return NextResponse.json({ error: "Invalid project, location, or floor ID" }, { status: 404 });
    }

    // Fetch records
    const records = await Record.find({ projectId, locationId, floorId }).sort({ createdAt: 1 });

    const startRecord = records.find(record => record.recordType === "Start") || null;
    const endRecord = records.find(record => record.recordType === "End") || null;

    return NextResponse.json({
        projectName: project.name,
        locationName: location.name,
        floorName: floor.name,
        startRecord,
        endRecord
    });
}
// 🟢 **POST**: Create Start or End record
export async function POST(req: NextRequest, { params }: { params: { projectId: string; locationId: string; floorId: string } }) {
    const { projectId, locationId, floorId } = params;
    const formData = await req.formData();
    const pressure = parseFloat(formData.get("pressure") as string);
    const plumberName = formData.get("plumberName") as string;
    const file = formData.get("image") as File;

    if (!pressure || !plumberName || !file) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const existingStart = await Record.findOne({ projectId, locationId, floorId, recordType: "Start" });
        const recordType = existingStart ? "End" : "Start";
        const imageUrl = await handleFileUpload(file);

        const newRecord = await Record.create({
            projectId,
            locationId,
            floorId,
            recordType,
            pressure,
            plumberName,
            image: imageUrl,
        });

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
    }
}

// 🟢 **DELETE**: Remove all records
export async function DELETE(req: NextRequest, { params }: { params: { projectId: string; locationId: string; floorId: string } }) {
    const { projectId, locationId, floorId } = params;
    try {
        await Record.deleteMany({ projectId, locationId, floorId });
        return NextResponse.json({ message: "Records deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete records" }, { status: 500 });
    }
}
