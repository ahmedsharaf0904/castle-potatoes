import { NextRequest, NextResponse } from 'next/server';
import { getAccountsByRepresentative } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const accounts = await getAccountsByRepresentative(id);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('[v0] Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
