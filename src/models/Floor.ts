import mongoose, { Schema, model, models } from "mongoose";

const FloorSchema = new Schema({
  name: { type: String, required: true },
  locationId: { type: Schema.Types.ObjectId, ref: "Location", required: true },
});

export default models.Floor || model("Floor", FloorSchema);
