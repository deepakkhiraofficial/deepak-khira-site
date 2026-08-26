import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await connectDB();

  const post = await Post.findOne({ slug: params.slug });
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  // Increase view count
  post.views = (post.views || 0) + 1;
  await post.save();

  return NextResponse.json(post);
}
