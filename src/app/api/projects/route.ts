import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import Project from "@/models/MainProject";



export async function GET() {
    await connectToDatabase();
    const projects = await Project.find();
    return NextResponse.json(projects);
  }
  
  export async function POST(req: Request) {
    await connectToDatabase();
    const { name } = await req.json();
    const newProject = await Project.create({ name });
    return NextResponse.json(newProject);
  }