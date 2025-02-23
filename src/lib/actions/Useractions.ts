// app/actions.ts
"use server";

import CrudModel from "@/models/user";
import { connectToDatabase } from "@/utils/db";

// ✅ Create a new CRUD entry
// export async function createCrud(name: string, description: string) {
//   try {
//     await connectToDatabase();
//     const newCrud = new CrudModel({ name, description });
//     await newCrud.save();
//     return { success: true, message: "Entry created successfully", crud: newCrud };
//   } catch (error) {
//     console.error("❌ Error during CRUD creation:", error);
//     return { success: false, error: "Failed to create entry" };
//   }
// }

// // ✅ Fetch all CRUD entries
// export async function getAllCruds() {
//   try {
//     await connectToDatabase();
//     const cruds = await CrudModel.find();
//     return { success: true, cruds };
//   } catch (error) {
//     return { success: false, error: "Failed to fetch entries" };
//   }
// }

// // ✅ Delete a CRUD entry
// export async function deleteCrud(id: string) {
//   try {
//     await connectToDatabase();
//     await CrudModel.findByIdAndDelete(id);
//     return { success: true, message: "Entry deleted successfully" };
//   } catch (error) {
//     return { success: false, error: "Failed to delete entry" };
//   }
// }


import { authApi } from './api';

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const response = await authApi.login(credentials);
    return response;
  } catch (error) {
    console.error('Login action error:', error);
    throw error;
  }
}

export async function registerUser(userData: { 
  email: string; 
  password: string; 
  name: string; 
}) {
  try {
    const response = await authApi.register(userData);
    return response;
  } catch (error) {
    console.error('Registration action error:', error);
    throw error;
  }
}