'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Representative {
  id: string;
  name: string;
  mobile?: string;
  email?: string;
  designation?: string;
  createdAt: string;
  isArchived: boolean;
}

interface Account {
  id: string;
  accountName: string;
  location?: string;
  contactPerson?: string;
  contactNumber?: string;
}

export default function RepresentativesPage() {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [accounts, setAccounts] = useState<{ [key: string]: Account[] }>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRepresentatives();
  }, []);

  const fetchRepresentatives = async (query = '') => {
    try {
      setIsLoading(true);
      const url = query
        ? `/api/representatives?q=${encodeURIComponent(query)}`
        : '/api/representatives';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRepresentatives(data);
      setError('');
    } catch (err) {
      setError('Failed to load representatives');
      console.error('[v0] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchRepresentatives(query);
  };

  const toggleExpand = async (repId: string) => {
    if (expandedId === repId) {
      setExpandedId(null);
    } else {
      // Fetch accounts for this representative
      try {
        const response = await fetch(`/api/representatives/${repId}/accounts`);
        if (response.ok) {
          const accts = await response.json();
          setAccounts({ ...accounts, [repId]: accts });
        }
      } catch (err) {
        console.error('[v0] Error fetching accounts:', err);
      }
      setExpandedId(repId);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this representative?')) return;
    try {
      const response = await fetch(`/api/representatives/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setRepresentatives(representatives.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('[v0] Error archiving:', err);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Representatives</h1>
          <p className="text-secondary">Manage your sales representatives and their accounts</p>
        </div>
        <Link
          href="/dashboard/representatives/new"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Add Representative
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-background border border-border rounded-lg p-6 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-foreground">Loading representatives...</p>
          </div>
        </div>
      ) : representatives.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-8 text-center">
          <p className="text-secondary text-lg">No representatives found</p>
          <Link
            href="/dashboard/representatives/new"
            className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add your first representative
          </Link>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          {representatives.map((rep) => (
            <div key={rep.id} className="border-b border-border last:border-0">
              <button
                onClick={() => toggleExpand(rep.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition text-left"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{rep.name}</h3>
                  <div className="mt-1 text-sm text-secondary space-x-4">
                    {rep.designation && <span>{rep.designation}</span>}
                    {rep.mobile && <span>{rep.mobile}</span>}
                    {rep.email && <span>{rep.email}</span>}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(rep.id);
                  }}
                  className="ml-4 px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition text-sm"
                >
                  Archive
                </button>
                <span className="ml-4 text-secondary">
                  {expandedId === rep.id ? '▼' : '▶'}
                </span>
              </button>

              {expandedId === rep.id && (
                <div className="px-6 py-4 bg-muted border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">Accounts</h4>
                  {accounts[rep.id]?.length ? (
                    <div className="space-y-3">
                      {accounts[rep.id].map((account) => (
                        <div key={account.id} className="p-3 bg-background border border-border rounded">
                          <p className="font-semibold text-foreground">{account.accountName}</p>
                          {account.contactPerson && (
                            <p className="text-sm text-secondary">Contact: {account.contactPerson}</p>
                          )}
                          {account.location && (
                            <p className="text-sm text-secondary">Location: {account.location}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary text-sm">No accounts for this representative</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
