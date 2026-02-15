import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// Endpoint to manually promote yameem369@gmail.com to admin if already exists
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const adminEmail = 'yameem369@gmail.com';

    // Find and update the user with admin email
    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin user not found. Please sign up first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user, message: 'User promoted to admin successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error promoting user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
