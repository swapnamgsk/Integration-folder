import mongoose, { Schema, Document } from 'mongoose';

interface ITestRecord extends Document {
  projectName: string;
  locationAddress: string;
  technicianName: string;
  floorName: string;
  recordType: 'start' | 'end';
  date: string;
  time: string;
  readingPressure: number;
  image: string; // Store base64 image
}

const TestRecordSchema = new Schema<ITestRecord>({
  projectName: { type: String, required: true },
  locationAddress: { type: String, required: true },
  technicianName: { type: String, required: true },
  floorName: { type: String, required: true },
  recordType: { type: String, enum: ['start', 'end'], required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  readingPressure: { type: Number, required: true },
  image: { type: String, required: true }, // Store image as base64
});

export default mongoose.models.TestRecord || mongoose.model<ITestRecord>('TestRecord', TestRecordSchema);
