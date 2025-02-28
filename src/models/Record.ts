import mongoose, { Schema, Document } from "mongoose";

export interface IRecord extends Document {
  projectId: string;
  locationId: string;
  floorId: string;
  recordType: "Start" | "End";
  pressure: number;
  plumberName: string;
  imageUrl: string;
}

const RecordSchema: Schema = new Schema(
  {
    projectId: { type: String, required: true },
    locationId: { type: String, required: true },
    floorId: { type: String, required: true },
    recordType: { type: String, enum: ["Start", "End"], required: true },
    pressure: { type: Number, required: true },
    plumberName: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Record || mongoose.model<IRecord>("Record", RecordSchema);