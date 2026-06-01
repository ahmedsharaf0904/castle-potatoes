import { NextRequest, NextResponse } from 'next/server';
import {
  getRepresentativeById,
  updateRepresentative,
  archiveRepresentative,
} from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const representative = await getRepresentativeById(id);
    
    if (!representative) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(representative);
  } catch (error) {
    console.error('[v0] Error fetching representative:', error);
    return NextResponse.json(
      { error: 'Failed to fetch representative' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateRepresentative(id, body);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('[v0] Error updating representative:', error);
    return NextResponse.json(
      { error: 'Failed to update representative' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await archiveRepresentative(id);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Representative not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Representative archived successfully' });
  } catch (error) {
    console.error('[v0] Error archiving representative:', error);
    return NextResponse.json(
      { error: 'Failed to archive representative' },
      { status: 500 }
    );
  }
}
