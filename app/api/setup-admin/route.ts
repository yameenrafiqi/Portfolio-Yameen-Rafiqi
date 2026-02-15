import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@/lib/firebase';

// One-time setup endpoint to create admin user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the current Firebase user from the request
    const uid = request.nextUrl.searchParams.get('uid');
    
    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID parameter is required. Add ?uid=YOUR_FIREBASE_UID to the URL' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await User.findOne({ uid });

    if (user) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'User already exists in MongoDB',
          data: user 
        },
        { status: 200 }
      );
    }

    // Create the admin user
    user = await User.create({
      uid: uid,
      email: 'yameem369@gmail.com',
      displayName: 'Yameen Rafiqi',
      role: 'admin',
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Admin user created successfully!',
        data: user 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
