import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email } = body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const exists = await Subscriber.findOne({ email });
    if (exists) {
      return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
