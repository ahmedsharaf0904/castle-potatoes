'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export default function NewCustomerTypePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.name.trim()) {
      setError(t.newCustomerType.nameRequired);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/customer-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t.newCustomerType.failedCreate);
        return;
      }

      router.push('/dashboard/customer-types');
    } catch (err) {
      setError(t.newCustomerType.errorOccurred);
      console.error('[v0] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.newCustomerType.title}</h1>
        <p className="text-secondary">
          <Link href="/dashboard/customer-types" className="text-primary hover:underline">
            {t.newCustomerType.backTo}
          </Link>
        </p>
      </div>

      <div className="max-w-2xl bg-background border border-border rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t.newCustomerType.name} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t.newCustomerType.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t.newCustomerType.description}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t.newCustomerType.descriptionPlaceholder}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
              <p className="text-red-700 text-sm dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? t.newCustomerType.creating : t.newCustomerType.create}
            </button>
            <Link
              href="/dashboard/customer-types"
              className="flex-1 border border-border text-foreground py-2 rounded-lg hover:bg-muted transition font-semibold text-center"
            >
              {t.newCustomerType.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
