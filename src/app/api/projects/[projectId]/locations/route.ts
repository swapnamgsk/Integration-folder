import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Location from "@/models/Location";

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    console.log("📌 API called - Creating location...");
    
    const { name } = await req.json();
    console.log("📌 Received data:", { name });

    if (!name) {
      console.error("❌ Missing name in request body");
      return NextResponse.json({ error: "Location name is required" }, { status: 400 });
    }

    await connectToDatabase();
    console.log("📌 Connected to MongoDB");

    // Ensure projectId is passed correctly
    const { projectId } = params; // Extract params correctly
    console.log("📌 Extracted projectId:", projectId);

    if (!projectId) {
      console.error("❌ Missing projectId in URL params");
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const newLocation = await Location.create({
      name,
      mainProjectId: projectId, // Ensure this matches your schema field
    });

    console.log("✅ Location created successfully:", newLocation);
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating location:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


import mongoose from "mongoose";


export async function GET(
  request: Request,
  context: { params: { projectId?: string } } // Ensure projectId is optional
) {
  console.log("📌 API Request Received");

  const { projectId } = context.params || {}; // Ensure params exist
  console.log("📌 Received projectId:", projectId);

  try {
    console.log("📌 Connecting to MongoDB...");
    await connectToDatabase();
    console.log("✅ Successfully connected to MongoDB");

    // Validate projectId
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      console.error("❌ Invalid projectId:", projectId);
      return NextResponse.json({ error: "Invalid projectId" }, { status: 400 });
    }

    console.log("📌 Querying database for locations...");
    const locations = await Location.find({
      mainProjectId: new mongoose.Types.ObjectId(projectId), // 🔥 Use mainProjectId
    });

    console.log("✅ Query successful, Locations fetched:", locations);
    return NextResponse.json(locations, { status: 200 });

  } catch (error: unknown) {
    console.error("❌ Error fetching locations:", error);

    let errorMessage = "Failed to fetch locations";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}