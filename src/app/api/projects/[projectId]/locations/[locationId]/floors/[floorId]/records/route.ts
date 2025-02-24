import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Project from "@/models/MainProject";
import Location from "@/models/Location";
import Floor from "@/models/Floor";
import Record from "@/models/Record";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string; locationId: string; floorId: string } }
) {
  await connectToDatabase();

  console.log("Fetching records for:", params);

  // Fetch project, location, and floor details
  const project = await Project.findById(params.projectId);
  const location = await Location.findById(params.locationId);
  const floor = await Floor.findById(params.floorId);

  if (!project || !location || !floor) {
    return NextResponse.json({ error: "Invalid project, location, or floor ID" }, { status: 404 });
  }

  // Fetch records associated with the floor
  const records = await Record.find({ floorId: params.floorId });

  if (!records || records.length === 0) {
    return NextResponse.json({ error: "No records found" }, { status: 404 });
  }

  // Enhance records with project, location, and floor details
  const enhancedRecords = records.map((record) => ({
    id: record._id.toString(),
    recordType: record.recordType,
    pressure: record.pressure,
    plumberName: record.plumberName,
    formattedDate: new Date(record.dateTime).toLocaleString(),
    projectName: project?.name || "Unknown Project",
    locationName: location?.name || "Unknown Location",
    floorName: floor?.name || "Unknown Floor",
    imagePath: record.imageUrl, // Direct file path from /public/uploads
  }));

  return NextResponse.json(enhancedRecords, { status: 200 });
}



import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string; locationId: string; floorId: string } }
) {
  await connectToDatabase();

  const formData = await req.formData();
  const recordType = formData.get("recordType") as string;
  const pressure = Number(formData.get("pressure"));
  const plumberName = formData.get("plumberName") as string;
  const image = formData.get("image") as File; // Get image file

  if (!recordType || !plumberName || !image) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Read image data as buffer
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const fileName = `${Date.now()}-${image.name}`;
  const filePath = join(process.cwd(), "public/uploads", fileName);

  // Save file to the /public/uploads directory
  await writeFile(filePath, imageBuffer);

  // Create a new record in MongoDB
  const newRecord = await Record.create({
    projectId: params.projectId,
    locationId: params.locationId,
    floorId: params.floorId,
    recordType,
    pressure,
    plumberName,
    imageUrl: `/uploads/${fileName}`, // Store image path, not URL
  });

  return NextResponse.json({ record: newRecord }, { status: 201 });
}


// export async function POST(req: NextRequest, { params }: { params: { projectId: string; locationId: string; floorId: string } }) {
//   await connectToDatabase();

//   const formData = await req.formData();
//   const recordType = formData.get("recordType") as string;
//   const pressure = Number(formData.get("pressure"));
//   const plumberName = formData.get("plumberName") as string;
//   const image = formData.get("image") as File;

//   if (!recordType || !plumberName || !image) {
//     return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//   }

//   const newRecord = await Record.create({
//     projectId: params.projectId,
//     locationId: params.locationId,
//     floorId: params.floorId,
//     recordType,
//     pressure,
//     plumberName,
//     imageUrl: `/uploads/${image.name}`, // You need to handle actual file storage
//   });

//   return NextResponse.json({ record: newRecord }, { status: 201 });
// }
