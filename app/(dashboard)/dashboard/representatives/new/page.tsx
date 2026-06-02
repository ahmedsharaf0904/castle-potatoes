'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export default function NewRepresentativePage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    designation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.name.trim()) {
      setError(t.newRepresentative.nameRequired);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/representatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || t.newRepresentative.failedCreate);
        return;
      }

      router.push('/dashboard/representatives');
    } catch (err) {
      setError(t.newRepresentative.errorOccurred);
      console.error('[v0] Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.newRepresentative.title}</h1>
        <p className="text-secondary">
          <Link href="/dashboard/representatives" className="text-primary hover:underline">
            {t.newRepresentative.backTo}
          </Link>
        </p>
      </div>

      <div className="max-w-2xl bg-background border border-border rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t.newRepresentative.name} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t.newRepresentative.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t.newRepresentative.mobile}
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t.newRepresentative.mobilePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t.newRepresentative.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t.newRepresentative.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t.newRepresentative.designation}
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t.newRepresentative.designationPlaceholder}
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
              {isLoading ? t.newRepresentative.creating : t.newRepresentative.create}
            </button>
            <Link
              href="/dashboard/representatives"
              className="flex-1 border border-border text-foreground py-2 rounded-lg hover:bg-muted transition font-semibold text-center"
            >
              {t.newRepresentative.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
