'use server'

import { revalidatePath } from 'next/cache'
import TestRecord from '@/models/plumberModel'
import { connectToDatabase } from '@/utils/db'

export async function createCrud(
  projectName: string,
  locationAddress: string,
  technicianName: string,
  floorName: string,
  recordType: 'start' | 'end',
  date: string,
  time: string,
  readingPressure: number,
  imageBase64: string
) {
  try {
    await connectToDatabase();
    
    const newRecord = new TestRecord({
      projectName,
      locationAddress,
      technicianName,
      floorName,
      recordType,
      date,
      time,
      readingPressure,
      image: imageBase64,
    });

    await newRecord.save();
    revalidatePath('/records');

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getAllCruds() {
    try {
        await connectToDatabase()

        const records = await TestRecord.find({})
            .sort({ createdAt: -1 })
            .lean()
            .exec()

        const serializedRecords = records.map(record => {
            const id = record._id && typeof record._id === 'object' && record._id.toString ? 
                record._id.toString() : 
                record._id;

            return {
                ...record,
                _id: id,
                date: record.date instanceof Date ? record.date.toISOString() : record.date,
                createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
                updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
            };
        });

        return { 
            success: true, 
            cruds: serializedRecords 
        }
    } catch (error) {
        console.error('Error in getAllCruds:', error)
        return { 
            success: false, 
            error: 'Failed to fetch records'
        }
    }
}


// Define the TypeScript type for test records
export type TestRecordType = {
  _id: string;
  projectName: string;
  locationAddress: string;
  technicianName: string;
  floorName: string;
  recordType: "start" | "end";
  date: string;
  time: string;
  readingPressure: number;
  image: string;
};

// Server action to fetch all test records
export async function getTestRecords(): Promise<TestRecordType[]> {
  try {
    await connectToDatabase();
    
    // Fetch all records from testrecords collection
    const records = await TestRecord.find({})
      .lean()
      .select('-__v')
      .exec();

    return records.map(record => ({
      _id: record._id.toString(),
      projectName: record.projectName,
      locationAddress: record.locationAddress,
      technicianName: record.technicianName,
      floorName: record.floorName,
      recordType: record.recordType,
      date: record.date,
      time: record.time,
      readingPressure: record.readingPressure,
      image: record.image
    }));

  } catch (error) {
    console.error('Error fetching test records:', error);
    return [];
  }
}



export async function deleteCrud(id: string) {
    try {
        await connectToDatabase()

        if (!id) {
            throw new Error('Record ID is required')
        }

        const deletedRecord = await TestRecord.findByIdAndDelete(id)
        
        if (!deletedRecord) {
            throw new Error('Record not found')
        }

        revalidatePath('/ui')

        return { success: true }
    } catch (error) {
        console.error('Error in deleteCrud:', error)
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to delete record'
        }
    }
}

export async function getRecordsByType(recordType: 'start' | 'end') {
    try {
        await connectToDatabase()

        const records = await TestRecord.find({ recordType })
            .sort({ date: -1, time: -1 })
            .lean()
            .exec()

        const serializedRecords = records.map(record => {
            const id = record._id && typeof record._id === 'object' && record._id.toString ? 
                record._id.toString() : 
                record._id;

            return {
                ...record,
                _id: id,
                date: record.date instanceof Date ? record.date.toISOString() : record.date,
                createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : record.createdAt,
                updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : record.updatedAt
            };
        });

        return { 
            success: true, 
            cruds: serializedRecords 
        }
    } catch (error) {
        console.error('Error in getRecordsByType:', error)
        return { 
            success: false, 
            error: 'Failed to fetch records'
        }
    }
}

export async function getRecordsByProjectName(recordType: 'start' | 'end') {
  try {
    await connectToDatabase();
    
    const records = await TestRecord.find({ recordType })
      .sort({ date: -1, time: -1 })
      .lean()
      .exec();

    const serializedRecords = records.map(record => ({
      ...record,
      _id: record._id.toString(),
      date: record.date instanceof Date ? record.date.toISOString() : record.date,
    }));

    return { 
      success: true, 
      cruds: serializedRecords 
    };
  } catch (error) {
    console.error('Error in getRecordsByProjectName:', error);
    return { 
      success: false, 
      error: 'Failed to fetch records'
    };
  }
}