'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

interface DashboardStats {
  representativesCount: number;
  customerTypesCount: number;
  accountsCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();

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
        setError(t.dashboard.failedToLoad);
        console.error('[v0] Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [t.dashboard.failedToLoad]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-foreground">{t.dashboard.loadingDashboard}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.dashboard.title}</h1>
        <p className="text-secondary">{t.dashboard.welcome}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 dark:bg-red-950 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/representatives">
          <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-secondary text-sm font-semibold">{t.dashboard.representatives}</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {stats?.representativesCount || 0}
                </h3>
              </div>
              <div className="text-4xl">👥</div>
            </div>
            <p className="text-xs text-secondary">{t.dashboard.clickManageReps}</p>
          </div>
        </Link>

        <Link href="/dashboard/customer-types">
          <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-secondary text-sm font-semibold">{t.dashboard.customerTypes}</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {stats?.customerTypesCount || 0}
                </h3>
              </div>
              <div className="text-4xl">🏷️</div>
            </div>
            <p className="text-xs text-secondary">{t.dashboard.clickManageTypes}</p>
          </div>
        </Link>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-secondary text-sm font-semibold">{t.dashboard.totalAccounts}</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">
                {stats?.accountsCount || 0}
              </h3>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
          <p className="text-xs text-secondary">{t.dashboard.associatedWithReps}</p>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">{t.dashboard.quickActions}</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/representatives"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
          >
            {t.dashboard.manageRepresentatives}
          </Link>
          <Link
            href="/dashboard/customer-types"
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-muted transition font-semibold text-sm"
          >
            {t.dashboard.manageCustomerTypes}
          </Link>
        </div>
      </div>
    </div>
  );
}
