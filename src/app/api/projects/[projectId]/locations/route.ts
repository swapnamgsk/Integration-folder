import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Location from "../../../../../models/Location";
import mongoose from "mongoose"; // Import mongoose for ObjectId conversion

// **GET**: Fetch all locations for a project
export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectToDatabase();

    const projectId = params.projectId;
    console.log("📌 Fetching locations for project:", projectId);

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Ensure mainProjectId is treated as an ObjectId
    const locations = await Location.find({ projectId: new mongoose.Types.ObjectId(projectId) });

    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function POST(req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    await connectToDatabase();

    // Await params before using it
    const { projectId } = await params;

    console.log("📌 Creating location under project:", projectId);

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Location name is required" }, { status: 400 });
    }

    const newLocation = await Location.create({ name, projectId });
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating location:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

