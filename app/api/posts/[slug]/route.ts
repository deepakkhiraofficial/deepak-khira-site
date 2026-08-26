import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { slug } = await params;

    const cleanSlug = slug?.trim();

    if (!cleanSlug) {
      return NextResponse.json(
        {
          success: false,
          error: "Post slug is required.",
        },
        { status: 400 }
      );
    }

    const post = await Post.findOne({
      slug: cleanSlug,
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "Post not found.",
        },
        { status: 404 }
      );
    }

    // Increase view count
    post.views = (post.views || 0) + 1;

    await post.save();

    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("GET POST BY SLUG ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch post.",
      },
      { status: 500 }
    );
  }
}