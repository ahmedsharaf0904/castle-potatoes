import { NextRequest, NextResponse } from 'next/server';
import {
  getAllRepresentatives,
  searchRepresentatives,
  createRepresentative,
} from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (query) {
      const results = await searchRepresentatives(query);
      return NextResponse.json(results);
    }

    const representatives = await getAllRepresentatives();
    return NextResponse.json(representatives);
  } catch (error) {
    console.error('[v0] Error fetching representatives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch representatives' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobile, email, designation } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await createRepresentative({
      name,
      mobile,
      email,
      designation,
    });

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating representative:', error);
    return NextResponse.json(
      { error: 'Failed to create representative' },
      { status: 500 }
    );
  }
}
