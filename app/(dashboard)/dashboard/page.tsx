'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  representativesCount: number;
  customerTypesCount: number;
  accountsCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error('[v0] Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-secondary">Welcome to Castle Potatoes Admin Portal</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Representatives Card */}
        <Link href="/dashboard/representatives">
          <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-secondary text-sm font-semibold">Representatives</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {stats?.representativesCount || 0}
                </h3>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <p className="text-xs text-secondary">Click to manage representatives</p>
          </div>
        </Link>

        {/* Customer Types Card */}
        <Link href="/dashboard/customer-types">
          <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-secondary text-sm font-semibold">Customer Types</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {stats?.customerTypesCount || 0}
                </h3>
              </div>
              <div className="text-4xl">🏷️</div>
            </div>
            <p className="text-xs text-secondary">Click to manage customer types</p>
          </div>
        </Link>

        {/* Total Accounts Card */}
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-secondary text-sm font-semibold">Total Accounts</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {stats?.accountsCount || 0}
              </h3>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
          <p className="text-xs text-secondary">Associated with representatives</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/representatives"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
          >
            Manage Representatives
          </Link>
          <Link
            href="/dashboard/customer-types"
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-muted transition font-semibold text-sm"
          >
            Manage Customer Types
          </Link>
        </div>
      </div>
    </div>
  );
}
