import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Floor from "@/models/Floor";
import Location from "@/models/Location";
import { connectToDatabase } from "@/utils/db";

// ✅ Create a Floor
export async function POST(request: Request, { params }: { params: { projectId: string; locationId: string } }) {
  try {
    console.log("📌 Connecting to MongoDB...");
    await connectToDatabase();

    const { floorName } = await request.json();
    console.log("📌 Received locationId:", params.locationId);
    console.log("📌 Received floorName:", floorName);

    // Validate locationId
    if (!mongoose.Types.ObjectId.isValid(params.locationId)) {
      return NextResponse.json({ error: "Invalid locationId" }, { status: 400 });
    }

    // Check if location exists
    const location = await Location.findById(params.locationId);
    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    // Create a new floor
    const newFloor = await Floor.create({ name: floorName, locationId: params.locationId });

    console.log("✅ Floor created successfully:", newFloor);
    return NextResponse.json({ message: "Floor created successfully", floor: newFloor }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating floor:", error);
    return NextResponse.json({ error: "Failed to create floor" }, { status: 500 });
  }
}

// ✅ Get Floors for a Location
export async function GET(request: Request, { params }: { params: { projectId: string; locationId: string } }) {
  try {
    console.log("📌 Fetching floors for location:", params.locationId);
    await connectToDatabase();

    // Validate locationId
    if (!mongoose.Types.ObjectId.isValid(params.locationId)) {
      return NextResponse.json({ error: "Invalid locationId" }, { status: 400 });
    }

    const floors = await Floor.find({ locationId: params.locationId });

    console.log("✅ Floors fetched successfully:", floors);
    return NextResponse.json(floors, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching floors:", error);
    return NextResponse.json({ error: "Failed to fetch floors" }, { status: 500 });
  }
}
