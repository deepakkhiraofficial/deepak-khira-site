// app/api/posts/route.ts
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const trending = searchParams.get('trending') === 'true';
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '6');
  const skip = (page - 1) * limit;

  let posts, total;

  if (trending) {
    posts = await Post.find().sort({ views: -1 }).limit(5);
    total = posts.length;
  } else {
    total = await Post.countDocuments();
    posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  }

  return NextResponse.json({ posts, total });
}

// Optional: POST route for creating posts (auth recommended)
export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();

  if (!data.title || !data.slug || !data.excerpt || !data.content || !data.category || !data.author) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const existing = await Post.findOne({ slug: data.slug });
    if (existing) return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });

    const post = await Post.create(data);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Post creation failed' }, { status: 500 });
  }
}
