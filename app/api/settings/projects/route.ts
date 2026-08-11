import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ProjectSettings from '@/models/ProjectSettings';

function normalizeVisibility(visibility: unknown): Record<string, boolean> {
  if (!visibility || typeof visibility !== 'object') {
    return {};
  }

  if (visibility instanceof Map) {
    return Object.fromEntries(visibility.entries()) as Record<string, boolean>;
  }

  return Object.entries(visibility as Record<string, unknown>).reduce<Record<string, boolean>>((acc, [key, value]) => {
    if (typeof value === 'boolean') {
      acc[key] = value;
    }
    return acc;
  }, {});
}

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

    const visibilityObj = normalizeVisibility(settings.visibility);

    return NextResponse.json({
      success: true,
      data: { visibility: visibilityObj },
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
    const normalizedVisibility = normalizeVisibility(visibility);

    // Update or create settings
    const settings = await ProjectSettings.findOneAndUpdate(
      { userId: 'default' },
      { visibility: normalizedVisibility },
      {
        upsert: true,
        returnDocument: 'after',
        runValidators: true,
      }
    );

    const visibilityObj = normalizeVisibility(settings.visibility);

    return NextResponse.json({
      success: true,
      data: { visibility: visibilityObj },
    });
  } catch (error: any) {
    console.error('Error updating project settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
