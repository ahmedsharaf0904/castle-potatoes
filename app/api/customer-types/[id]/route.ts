import { NextRequest, NextResponse } from 'next/server';
import {
  getCustomerTypeById,
  updateCustomerType,
  archiveCustomerType,
} from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const type = await getCustomerTypeById(params.id);
    
    if (!type) {
      return NextResponse.json(
        { error: 'Customer type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(type);
  } catch (error) {
    console.error('[v0] Error fetching customer type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer type' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await updateCustomerType(params.id, body);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Customer type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('[v0] Error updating customer type:', error);
    return NextResponse.json(
      { error: 'Failed to update customer type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await archiveCustomerType(params.id);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Customer type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Customer type archived successfully' });
  } catch (error) {
    console.error('[v0] Error archiving customer type:', error);
    return NextResponse.json(
      { error: 'Failed to archive customer type' },
      { status: 500 }
    );
  }
}
