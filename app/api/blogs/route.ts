import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';
    const uid = searchParams.get('uid');
    const status = searchParams.get('status');

    let query: any = {};

    // If published filter is requested
    if (publishedOnly) {
      query.published = true;
      query.status = 'approved';
    }

    // If specific user's posts are requested
    if (uid) {
      query['author.uid'] = uid;
    }

    // If specific status is requested
    if (status) {
      query.status = status;
    }

    const blogs = await BlogPost.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: blogs });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new blog
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const blog = await BlogPost.create(body);

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
