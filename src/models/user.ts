// models/user.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface Crud extends Document {
  name: string;
  description: string;
}

const CrudSchema = new Schema<Crud>({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

// ✅ Prevents recompilation of the model when Next.js refreshes
const CrudModel: Model<Crud> =
  mongoose.models.CrudActions || mongoose.model<Crud>("CrudActions", CrudSchema);

export default CrudModel;
