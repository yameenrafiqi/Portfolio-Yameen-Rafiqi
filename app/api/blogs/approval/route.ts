import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import User from '@/models/User';

// Submit post for approval
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { postId, uid } = body;

    if (!postId || !uid) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update post status to pending
    const post = await BlogPost.findByIdAndUpdate(
      postId,
      {
        status: 'pending',
        submittedAt: new Date(),
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: post, message: 'Post submitted for approval' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Approve or reject post (admin only)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { postId, action, uid, rejectionReason } = body;

    if (!postId || !action || !uid) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify admin
    const admin = await User.findOne({ uid });
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const updateData: any = {
      reviewedAt: new Date(),
      reviewedBy: admin.email,
    };

    if (action === 'approve') {
      updateData.status = 'approved';
      updateData.published = true;
    } else if (action === 'reject') {
      updateData.status = 'rejected';
      updateData.published = false;
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

    const post = await BlogPost.findByIdAndUpdate(postId, updateData, { new: true });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: post, message: `Post ${action}ed successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error reviewing post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get pending posts (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const status = searchParams.get('status') || 'pending';

    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'UID is required' },
        { status: 400 }
      );
    }

    // Verify admin
    const admin = await User.findOne({ uid });
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const posts = await BlogPost.find({ status }).sort({ submittedAt: -1 });

    return NextResponse.json(
      { success: true, data: posts },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
