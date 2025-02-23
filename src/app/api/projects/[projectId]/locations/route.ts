import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Location from "@/models/Location";
import mongoose from "mongoose"; // Import mongoose for ObjectId conversion

// **GET**: Fetch all locations for a project
export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectToDatabase();

    const mainProjectId = params.projectId;
    console.log("📌 Fetching locations for project:", mainProjectId);

    if (!mainProjectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Ensure mainProjectId is treated as an ObjectId
    const locations = await Location.find({ mainProjectId: new mongoose.Types.ObjectId(mainProjectId) });

    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching locations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// **POST**: Create a new location under a project
export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  try {
    await connectToDatabase();

    const mainProjectId = params.projectId;
    console.log("📌 Creating location under project:", mainProjectId);

    if (!mainProjectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Location name is required" }, { status: 400 });
    }

    // Ensure `mainProjectId` is stored as an ObjectId
    const newLocation = await Location.create({ name, mainProjectId: new mongoose.Types.ObjectId(mainProjectId) });

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating location:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
