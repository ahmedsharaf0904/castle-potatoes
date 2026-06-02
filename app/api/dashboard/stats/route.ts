import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db/queries';

export async function GET(_request: NextRequest) {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[v0] Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
