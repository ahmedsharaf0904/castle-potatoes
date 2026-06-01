'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
      setError('Failed to load customer types');
      console.error('[v0] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this customer type?')) return;
    try {
      const response = await fetch(`/api/customer-types/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTypes(types.filter(t => t.id !== id));
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
        setTypes(types.map(t => (t.id === id ? updated : t)));
        setEditingId(null);
      }
    } catch (err) {
      console.error('[v0] Error saving:', err);
    }
  };

  const handleSort = async (id: string, direction: 'up' | 'down') => {
    const index = types.findIndex(t => t.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === types.length - 1)
    ) {
      return;
    }

    const newOrder = [...types];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];

    // Update sort orders
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Customer Types</h1>
          <p className="text-secondary">Manage different types of customers in your system</p>
        </div>
        <Link
          href="/dashboard/customer-types/new"
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Add Type
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-foreground">Loading customer types...</p>
          </div>
        </div>
      ) : types.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-8 text-center">
          <p className="text-secondary text-lg">No customer types found</p>
          <Link
            href="/dashboard/customer-types/new"
            className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add your first customer type
          </Link>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Order</th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">Actions</th>
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
                        className="w-full px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <td className="px-6 py-4 text-right space-x-2">
                    {editingId === type.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(type.id)}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(type)}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleArchive(type.id)}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition text-sm"
                        >
                          Archive
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
