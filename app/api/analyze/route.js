import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    return NextResponse.json({ 
      message: "API is working!", 
      receivedData: data 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

// Next.js needs this for the build to succeed if you have a POST route
export async function GET() {
  return NextResponse.json({ status: "API is online" });
}
