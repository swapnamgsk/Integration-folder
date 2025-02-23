import mongoose, { Schema, model, models } from "mongoose";

const MainProjectSchema = new Schema({
  name: { type: String, required: true },
});

export default models.MainProject || model("MainProject", MainProjectSchema);
