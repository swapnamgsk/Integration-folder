import mongoose, { Schema, Document } from "mongoose";

interface ILocation extends Document {
  name: string;
  projectId: mongoose.Types.ObjectId; // Ensure projectId is stored
}

const LocationSchema = new Schema<ILocation>({
  name: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
});

export default mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);
