// 'use server'

// import { revalidatePath } from 'next/cache'
// import TestRecord from '@/models/plumberModel'
// import { connectToDatabase } from '@/utils/db'

// export async function createCrud(
//   projectName: string,
//   locationAddress: string,
//   technicianName: string,
//   floorName: string,
//   recordType: 'start' | 'end',
//   date: string,
//   time: string,
//   readingPressure: number,
//   imageBase64: string
// ) {
//   try {
//     await connectToDatabase();
    
//     const newRecord = new TestRecord({
//       projectName,
//       locationAddress,
//       technicianName,
//       floorName,
//       recordType,
//       date,
//       time,
//       readingPressure,
//       image: imageBase64,
//     });

//     await newRecord.save();
//     revalidatePath('/records');

//     return { success: true };
//   } catch (error) {
//     return { success: false, error: (error as Error).message };
//   }
// }

// export async function getAllCruds() {
//     try {
//         await connectToDatabase()

//         const records = await TestRecord.find({})
//             .sort({ createdAt: -1 })
//             .lean()
//             .exec()

//         const serializedRecords = records.map(record => {
//             const id = record._id && typeof record._id === 'object' && record._id.toString ? 
//                 record._id.toString() : 
//                 record._id;

//             return {
//                 ...record,
//                 _id: id,
//                 date: record.date instanceof Date ? record.date.toISOString() : record.date,
//                 createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
//                 updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
//             };
//         });

//         return { 
//             success: true, 
//             cruds: serializedRecords 
//         }
//     } catch (error) {
//         console.error('Error in getAllCruds:', error)
//         return { 
//             success: false, 
//             error: 'Failed to fetch records'
//         }
//     }
// }


// // Define the TypeScript type for test records
// export type TestRecordType = {
//   _id: string;
//   projectName: string;
//   locationAddress: string;
//   technicianName: string;
//   floorName: string;
//   recordType: "start" | "end";
//   date: string;
//   time: string;
//   readingPressure: number;
//   image: string;
// };

// // Server action to fetch all test records
// export async function getTestRecords(): Promise<TestRecordType[]> {
//   try {
//     await connectToDatabase();
    
//     // Fetch all records from testrecords collection
//     const records = await TestRecord.find({})
//       .lean()
//       .select('-__v')
//       .exec();

//     return records.map(record => ({
//       _id: record._id.toString(),
//       projectName: record.projectName,
//       locationAddress: record.locationAddress,
//       technicianName: record.technicianName,
//       floorName: record.floorName,
//       recordType: record.recordType,
//       date: record.date,
//       time: record.time,
//       readingPressure: record.readingPressure,
//       image: record.image
//     }));

//   } catch (error) {
//     console.error('Error fetching test records:', error);
//     return [];
//   }
// }



// export async function deleteCrud(id: string) {
//     try {
//         await connectToDatabase()

//         if (!id) {
//             throw new Error('Record ID is required')
//         }

//         const deletedRecord = await TestRecord.findByIdAndDelete(id)
        
//         if (!deletedRecord) {
//             throw new Error('Record not found')
//         }

//         revalidatePath('/ui')

//         return { success: true }
//     } catch (error) {
//         console.error('Error in deleteCrud:', error)
//         return { 
//             success: false, 
//             error: error instanceof Error ? error.message : 'Failed to delete record'
//         }
//     }
// }

// export async function getRecordsByType(recordType: 'start' | 'end') {
//     try {
//         await connectToDatabase()

//         const records = await TestRecord.find({ recordType })
//             .sort({ date: -1, time: -1 })
//             .lean()
//             .exec()

//         const serializedRecords = records.map(record => {
//             const id = record._id && typeof record._id === 'object' && record._id.toString ? 
//                 record._id.toString() : 
//                 record._id;

//             return {
//                 ...record,
//                 _id: id,
//                 date: record.date instanceof Date ? record.date.toISOString() : record.date,
//                 createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
//                 updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
//             };
//         });

//         return { 
//             success: true, 
//             cruds: serializedRecords 
//         }
//     } catch (error) {
//         console.error('Error in getRecordsByType:', error)
//         return { 
//             success: false, 
//             error: 'Failed to fetch records'
//         }
//     }
// }

// export async function getRecordsByProjectName(recordType: 'start' | 'end') {
//   try {
//     await connectToDatabase();
    
//     const records = await TestRecord.find({ recordType })
//       .sort({ date: -1, time: -1 })
//       .lean()
//       .exec();

//     const serializedRecords = records.map(record => ({
//       ...record,
//       _id: record._id.toString(),
//       date: record.date instanceof Date ? record.date.toISOString() : record.date,
//     }));

//     return { 
//       success: true, 
//       cruds: serializedRecords 
//     };
//   } catch (error) {
//     console.error('Error in getRecordsByProjectName:', error);
//     return { 
//       success: false, 
//       error: 'Failed to fetch records'
//     };
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Project from '@/models/plumberModel';

// 📌 1️⃣ Submit Start Record
export async function startRecord(req: NextRequest) {
  try {
    await connectToDatabase();
    const { projectId, locationId, floorName, date, time, readingPressure, image } = await req.json();

    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });

    const location = project.locations.id(locationId);
    if (!location) return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });

    const startRecord = { floorName, recordType: 'start', date, time, readingPressure, image };
    location.floorRecords.push(startRecord);
    await project.save();

    return NextResponse.json({ success: true, message: 'Start record submitted. Now fill the end record.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 📌 2️⃣ Submit End Record
export async function endRecord(req: NextRequest) {
  try {
    await connectToDatabase();
    const { projectId, locationId, floorName, date, time, readingPressure, image } = await req.json();

    const project = await Project.findById(projectId);
    if (!project) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });

    const location = project.locations.id(locationId);
    if (!location) return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });

    const endRecord = { floorName, recordType: 'end', date, time, readingPressure, image };
    location.floorRecords.push(endRecord);
    await project.save();

    return NextResponse.json({ success: true, message: 'End record submitted successfully.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
// 📌 1️⃣ Get All Projects
export async function getAllProjects(req: NextRequest) {
  try {
    await connectToDatabase();
    const projects = await Project.find({});
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 📌 2️⃣ Get a Single Project by ID
export async function getProjectById(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    await connectToDatabase();
    const project = await Project.findById(params.projectId);
    if (!project) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: project }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 📌 3️⃣ Get Floor Records for a Specific Location
export async function getFloorRecords(req: NextRequest, { params }: { params: { projectId: string; locationId: string } }) {
  try {
    await connectToDatabase();
    const project = await Project.findById(params.projectId);
    if (!project) return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });

    const location = project.locations.id(params.locationId);
    if (!location) return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: location.floorRecords }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
