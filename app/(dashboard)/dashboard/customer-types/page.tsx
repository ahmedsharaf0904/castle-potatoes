'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

interface CustomerType {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  createdAt: string;
}

export default function CustomerTypesPage() {
  const [types, setTypes] = useState<CustomerType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    fetchCustomerTypes();
  }, []);

  const fetchCustomerTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customer-types');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTypes(data);
      setError('');
    } catch (err) {
      setError(t.customerTypes.failedToLoad);
      console.error('[v0] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm(t.customerTypes.archiveConfirm)) return;
    try {
      const response = await fetch(`/api/customer-types/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTypes(types.filter(ty => ty.id !== id));
      }
    } catch (err) {
      console.error('[v0] Error archiving:', err);
    }
  };

  const handleEditClick = (type: CustomerType) => {
    setEditingId(type.id);
    setEditName(type.name);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/customer-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (response.ok) {
        const updated = await response.json();
        setTypes(types.map(ty => (ty.id === id ? updated : ty)));
        setEditingId(null);
      }
    } catch (err) {
      console.error('[v0] Error saving:', err);
    }
  };

  const handleSort = async (id: string, direction: 'up' | 'down') => {
    const index = types.findIndex(ty => ty.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === types.length - 1)
    ) {
      return;
    }

    const newOrder = [...types];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];

    for (let i = 0; i < newOrder.length; i++) {
      try {
        await fetch(`/api/customer-types/${newOrder[i].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: i }),
        });
      } catch (err) {
        console.error('[v0] Error updating sort order:', err);
      }
    }

    setTypes(newOrder);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.customerTypes.title}</h1>
          <p className="text-secondary">{t.customerTypes.subtitle}</p>
        </div>
        <Link
          href="/dashboard/customer-types/new"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {t.customerTypes.addType}
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 dark:bg-red-950 dark:border-red-800">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-foreground">{t.customerTypes.loading}</p>
          </div>
        </div>
      ) : types.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-8 text-center">
          <p className="text-secondary text-lg">{t.customerTypes.noFound}</p>
          <Link
            href="/dashboard/customer-types/new"
            className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t.customerTypes.addFirst}
          </Link>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-start font-semibold text-foreground">{t.customerTypes.colName}</th>
                <th className="px-6 py-3 text-start font-semibold text-foreground">{t.customerTypes.colOrder}</th>
                <th className="px-6 py-3 text-end font-semibold text-foreground">{t.customerTypes.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {types.map((type, index) => (
                <tr key={type.id} className="border-b border-border last:border-0 hover:bg-muted transition">
                  <td className="px-6 py-4">
                    {editingId === type.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <div>
                        <p className="font-semibold text-foreground">{type.name}</p>
                        {type.description && (
                          <p className="text-sm text-secondary mt-1">{type.description}</p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSort(type.id, 'up')}
                        disabled={index === 0}
                        className="px-2 py-1 bg-muted hover:bg-primary hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ▲
                      </button>
                      <span className="text-center w-6">{index + 1}</span>
                      <button
                        onClick={() => handleSort(type.id, 'down')}
                        disabled={index === types.length - 1}
                        className="px-2 py-1 bg-muted hover:bg-primary hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-end space-x-2 rtl:space-x-reverse">
                    {editingId === type.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(type.id)}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition text-sm dark:bg-green-950 dark:text-green-400"
                        >
                          {t.customerTypes.save}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-muted text-foreground rounded hover:bg-border transition text-sm"
                        >
                          {t.customerTypes.cancel}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(type)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition text-sm dark:bg-blue-950 dark:text-blue-400"
                        >
                          {t.customerTypes.edit}
                        </button>
                        <button
                          onClick={() => handleArchive(type.id)}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition text-sm dark:bg-red-950 dark:text-red-400"
                        >
                          {t.customerTypes.archive}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
