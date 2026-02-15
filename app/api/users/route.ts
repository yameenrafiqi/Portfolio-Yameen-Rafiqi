import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { uid, email, displayName } = body;

    if (!uid || !email || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ uid });

    if (user) {
      return NextResponse.json(
        { success: true, data: user, message: 'User already exists' },
        { status: 200 }
      );
    }

    // Create new user with default role 'user'
    user = await User.create({
      uid,
      email,
      displayName,
      role: 'user',
    });

    return NextResponse.json(
      { success: true, data: user, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in user registration:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ uid });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
