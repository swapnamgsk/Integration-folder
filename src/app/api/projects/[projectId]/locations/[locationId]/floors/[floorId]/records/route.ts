import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";


import Project from "../../../../../../../../../models/MainProject";
import Location from "../../../../../../../../../models/Location";
import Floor from "../../../../../../../../../models/Floor";
import Record from "../../../../../../../../../models/Record";

export async function POST(req: NextRequest, { params }: { params: any }) {
  await connectToDatabase();
  try {
    const { recordType, pressure, plumberName, imageUrl } = await req.json();

    const newRecord = await Record.create({
      projectId: params.projectId,
      locationId: params.locationId,
      floorId: params.floorId,
      recordType,
      pressure,
      plumberName,
      imageUrl,
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating record", details: error }, { status: 500 });
  }
}


export async function GET(req: NextRequest, { params }: { params: { projectId: string; locationId: string; floorId: string } }) {
  await connectToDatabase();

  try {
    const records = await Record.find({ floorId: params.floorId });

    // Fetch project, location, and floor names
    const project = await Project.findById(params.projectId);
    const location = await Location.findById(params.locationId);
    const floor = await Floor.findById(params.floorId);

    if (!project || !location || !floor) {
      return NextResponse.json({ message: "Project, Location, or Floor not found" }, { status: 404 });
    }

    // Transform response to include names
    const formattedRecords = records.map((record) => ({
      _id: record._id,
      projectName: project.name,
      locationName: location.name,
      floorName: floor.name,
      recordType: record.recordType,
      pressure: record.pressure,
      plumberName: record.plumberName,
      imageUrl: record.imageUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }));

    return NextResponse.json(formattedRecords, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching records", error }, { status: 500 });
  }
}

// *📌 PUT: Update a specific record by ID*
export async function PUT(req: NextRequest, { params }: { params: any }) {
  await connectToDatabase();
  try {
    const { id } = await req.json();
    const updatedData = await req.json();

    const updatedRecord = await Record.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record updated successfully", record: updatedRecord });
  } catch (error) {
    return NextResponse.json({ error: "Error updating record", details: error }, { status: 500 });
  }
}

// *📌 DELETE: Remove a specific record by ID*
export async function DELETE(req: NextRequest, { params }: { params: any }) {
  await connectToDatabase();
  try {
    const { id } = await req.json();

    const deletedRecord = await Record.findByIdAndDelete(id);

    if (!deletedRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting record", details: error }, { status: 500 });
  }
}