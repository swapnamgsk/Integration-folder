import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Record from "@/models/Record"; // Ensure you have this model

// ✅ Fetch Records for a Floor
export async function GET(
  req: Request,
  { params }: { params: { projectId: string; locationId: string; floorId: string } }
) {
  await connectToDatabase();

  try {
    const records = await Record.find({
      projectId: params.projectId,
      locationId: params.locationId,
      floorId: params.floorId,
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch records" }, { status: 500 });
  }
}

// import { writeFile } from "fs/promises";
// import path from "path";
// import { mkdir } from "fs/promises";



// export async function POST(req: Request, params: { projectId: string; locationId: string; floorId: string }) {
//   try {
//     const formData = await req.formData();

//     // Extract and validate required fields
//     const plumberName = formData.get("plumberName") as string;
//     const pressure = formData.get("pressure") as string;
//     const recordType = formData.get("recordType") as string;
//     const dateTime = formData.get("dateTime") as string;
//     const image = formData.get("image") as File | null;

//     if (!plumberName || !pressure || !recordType || !dateTime) {
//       return NextResponse.json(
//         { error: "Missing required fields: plumberName, pressure, recordType, or dateTime" },
//         { status: 400 }
//       );
//     }

//     // Ensure directory exists
//     const uploadsDir = path.join(process.cwd(), "public/uploads");
//     await mkdir(uploadsDir, { recursive: true });

//     // Save the file if an image is provided
//     let imageUrl = null;
//     if (image) {
//       const imageBuffer = await image.arrayBuffer();
//       const imageName = `${Date.now()}_${image.name}`;
//       const imagePath = path.join(uploadsDir, imageName);
//       await writeFile(imagePath, Buffer.from(imageBuffer));
//       imageUrl = `/uploads/${imageName}`;
//     }

//     // Create the record in MongoDB
//     const newRecord = await Record.create({
//       projectId: params.projectId,
//       locationId: params.locationId,
//       floorId: params.floorId,
//       plumberName,
//       pressure,
//       recordType,
//       dateTime,
//       imageUrl,
//     });

//     return NextResponse.json({ record: newRecord }, { status: 201 });

//   } catch (error) {
//     console.error("Error saving file:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



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
