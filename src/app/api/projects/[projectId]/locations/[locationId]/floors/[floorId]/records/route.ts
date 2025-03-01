import { NextRequest, NextResponse } from "next/server";
import Record from "@/models/Record"; // Ensure correct path to your Mongoose model
import Project from "@/models/MainProject";
import Location from "@/models/Location";
import Floor from "@/models/Floor";
import formidable, { Fields, Files } from "formidable";
import fs from "fs/promises";
import path from "path";
export async function GET(req: NextRequest, { params }: { params: { projectId: string, locationId: string, floorId: string } }) {
  try {
      const { projectId, locationId, floorId } = params;

      // Fetch project, location, and floor details
      const project = await Project.findById(projectId);
      const location = await Location.findById(locationId);
      const floor = await Floor.findById(floorId);

      if (!project || !location || !floor) {
          return NextResponse.json({ error: "Invalid IDs provided" }, { status: 404 });
      }

      // Fetch the start (oldest) and end (newest) records
      const startRecord = await Record.findOne({ projectId, locationId, floorId }).sort({ createdAt: 1 });
      const endRecord = await Record.findOne({ projectId, locationId, floorId }).sort({ createdAt: -1 });

      return NextResponse.json({
          projectName: project.name,
          locationName: location.name,
          floorName: floor.name,
          startRecord: startRecord ? {
              plumberName: startRecord.plumberName,
              image: startRecord.image,
              pressure: startRecord.pressure,
              timing: startRecord.createdAt
          } : null,
          endRecord: endRecord ? {
              plumberName: endRecord.plumberName,
              image: endRecord.image,
              pressure: endRecord.pressure,
              timing: endRecord.createdAt
          } : null
      }, { status: 200 });

  } catch (error) {
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function POST(
  req: NextRequest, 
  { params }: { params: { projectId: string, locationId: string, floorId: string } }
) {
  try {
      const { projectId, locationId, floorId } = params;
      
      const form = formidable({ multiples: false });

      // Convert NextRequest to a readable stream
      const reqBody = await req.formData();
      const fields: Record<string, string> = {};
      let imageFile: formidable.File | null = null;

      for (const [key, value] of reqBody.entries()) {
          if (value instanceof Blob) {
              // Convert Blob to formidable.File
              const buffer = Buffer.from(await value.arrayBuffer());
              const tempPath = path.join(process.cwd(), "temp", value.name || "tempfile");

              await fs.writeFile(tempPath, buffer);
              
              imageFile = {
                  filepath: tempPath,
                  originalFilename: value.name,
                  mimetype: value.type,
                  size: buffer.length,
              } as formidable.File;
          } else {
              fields[key] = value.toString();
          }
      }

      const { recordType, pressure, plumberName } = fields;

      if (!recordType || !pressure || !plumberName || !imageFile) {
          return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }

      const uploadPath = path.join(process.cwd(), "public/uploads", imageFile.originalFilename || "image.jpg");
      await fs.rename(imageFile.filepath, uploadPath);

      const newRecord = new Record({
          projectId,
          locationId,
          floorId,
          recordType,
          pressure: Number(pressure),
          plumberName,
          image: `/uploads/${imageFile.originalFilename}`,
      });

      await newRecord.save();

      return NextResponse.json({ message: "Record saved successfully", record: newRecord }, { status: 201 });

  } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Server Error" }, { status: 500 });
  }
}
