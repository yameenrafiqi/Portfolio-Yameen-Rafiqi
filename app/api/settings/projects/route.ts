import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectSettings from '@/models/ProjectSettings';

// GET project visibility settings
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let settings = await ProjectSettings.findOne({ userId: 'default' });

    // If no settings exist, create default empty settings
    if (!settings) {
      settings = await ProjectSettings.create({
        userId: 'default',
        visibility: {},
      });
    }

    // Convert Map to plain object for JSON response
    const visibilityObj = Object.fromEntries(settings.visibility);

    return NextResponse.json({ 
      success: true, 
      data: { visibility: visibilityObj }
    });
  } catch (error: any) {
    console.error('Error fetching project settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST/PUT update project visibility settings
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { visibility } = body;

    // Update or create settings
    const settings = await ProjectSettings.findOneAndUpdate(
      { userId: 'default' },
      { visibility },
      { 
        upsert: true, 
        returnDocument: 'after',
        runValidators: true 
      }
    );

    // Convert Map to plain object for JSON response
    const visibilityObj = Object.fromEntries(settings.visibility);

    return NextResponse.json({ 
      success: true, 
      data: { visibility: visibilityObj }
    });
  } catch (error: any) {
    console.error('Error updating project settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
