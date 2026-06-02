import { NextRequest, NextResponse } from 'next/server';
import {
  getAllCustomerTypes,
  createCustomerType,
} from '@/lib/db/queries';

export async function GET(_request: NextRequest) {
  try {
    const types = await getAllCustomerTypes();
    return NextResponse.json(types);
  } catch (error) {
    console.error('[v0] Error fetching customer types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, sortOrder } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await createCustomerType({
      name,
      description,
      sortOrder: sortOrder || 0,
    });

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating customer type:', error);
    return NextResponse.json(
      { error: 'Failed to create customer type' },
      { status: 500 }
    );
  }
}
