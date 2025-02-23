import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Project from "@/models/MainProject";
import Location from "@/models/Location";
import Floor from "@/models/Floor";
import Record from "@/models/Record";

export async function GET(req: NextRequest, { params }: { params: { projectId: string; locationId: string; floorId: string } }) {
  await connectToDatabase();

  console.log("Fetching records for:", params);

  // Fetch project, location, and floor details
  const project = await Project.findById(params.projectId);
  const location = await Location.findById(params.locationId);
  const floor = await Floor.findById(params.floorId);

  // Fetch records for the floor
  const records = await Record.find({ floorId: params.floorId });

  if (!records || records.length === 0) {
    return NextResponse.json({ error: "No records found" }, { status: 404 });
  }

  // Enhance records with project, location, and floor names
  const enhancedRecords = records.map((record) => ({
    ...record.toObject(),
    projectName: project?.name || "Unknown Project",
    locationName: location?.name || "Unknown Location",
    floorName: floor?.name || "Unknown Floor",
    formattedDate: new Date(record.dateTime).toLocaleString(), // Format Date & Time
    imageUrl: record.imageUrl || "/default-image.jpg", // Fallback Image
  }));

  return NextResponse.json(enhancedRecords);
}





export async function POST(req: NextRequest, { params }: { params: { projectId: string; locationId: string; floorId: string } }) {
  await connectToDatabase();

  const formData = await req.formData();
  const recordType = formData.get("recordType") as string;
  const pressure = Number(formData.get("pressure"));
  const plumberName = formData.get("plumberName") as string;
  const image = formData.get("image") as File;

  if (!recordType || !plumberName || !image) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newRecord = await Record.create({
    projectId: params.projectId,
    locationId: params.locationId,
    floorId: params.floorId,
    recordType,
    pressure,
    plumberName,
    imageUrl: `/uploads/${image.name}`, // You need to handle actual file storage
  });

  return NextResponse.json({ record: newRecord }, { status: 201 });
}
