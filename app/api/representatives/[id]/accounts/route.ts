import { NextRequest, NextResponse } from 'next/server';
import { getAccountsByRepresentative } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accounts = await getAccountsByRepresentative(params.id);
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('[v0] Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
