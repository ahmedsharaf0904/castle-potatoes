# Dark Mode + Arabic (i18n) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add dark/light mode toggle (persisted) and Arabic language toggle (RTL, persisted) to every page of the Castle Potatoes admin portal.

**Architecture:** `next-themes` drives dark mode via a `class` attribute on `<html>`. A custom `LanguageContext` (React context + `localStorage`) drives Arabic/English; toggling AR sets `dir="rtl"` and `lang="ar"` on `<html>` via `useEffect`. Cairo font (Google Fonts) serves Arabic script; Geist serves Latin. Both preferences survive page refresh. Toggles appear in the dashboard sidebar footer and the login page top-right corner.

**Tech Stack:** Next.js 16 App Router, next-themes, Tailwind CSS (`darkMode: 'class'`, `rtl:` variants), `next/font/google` (Cairo), React Context API

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | Modify | Add `next-themes` |
| `tailwind.config.ts` | Modify | Add `darkMode: 'class'` |
| `app/globals.css` | Modify | Add `.dark` CSS variable overrides; fix body to use vars |
| `lib/i18n/translations.ts` | **Create** | All EN + AR strings for every page |
| `lib/i18n/language-context.tsx` | **Create** | LanguageProvider + useLanguage hook |
| `components/theme-toggle.tsx` | **Create** | Sun/Moon button using `useTheme` |
| `components/language-toggle.tsx` | **Create** | EN/AR button using `useLanguage` |
| `app/providers.tsx` | **Create** | Client wrapper: ThemeProvider + LanguageProvider |
| `app/layout.tsx` | Modify | Add Cairo font var, wrap with Providers, `suppressHydrationWarning` |
| `app/(dashboard)/layout.tsx` | Modify | Add toggles to sidebar footer; RTL sidebar flip; translate nav |
| `app/(auth)/login/page.tsx` | Modify | Add toggles top-right; translate all strings |
| `app/(dashboard)/dashboard/page.tsx` | Modify | Translate all strings |
| `app/(dashboard)/dashboard/representatives/page.tsx` | Modify | Translate all strings |
| `app/(dashboard)/dashboard/representatives/new/page.tsx` | Modify | Translate all strings |
| `app/(dashboard)/dashboard/customer-types/page.tsx` | Modify | Translate all strings |
| `app/(dashboard)/dashboard/customer-types/new/page.tsx` | Modify | Translate all strings |

---

## Task 1: Feature branch

- [ ] **Step 1: Create branch**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
git checkout main
git checkout -b feature/dark-mode-arabic
```

Expected: `Switched to a new branch 'feature/dark-mode-arabic'`

---

## Task 2: Dark mode foundation

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Install next-themes**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
npm install next-themes
```

Expected: `added N packages`

- [ ] **Step 2: Add `darkMode: 'class'` to tailwind.config.ts**

Replace the entire content of `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        border: "var(--border)",
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Add dark mode variables to globals.css**

Replace the entire content of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --secondary: #64748b;
  --secondary-foreground: #ffffff;
  --accent: #0ea5e9;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --secondary: #94a3b8;
  --secondary-foreground: #0f172a;
  --accent: #38bdf8;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --border: #334155;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

:lang(ar) {
  font-family: var(--font-cairo), sans-serif;
}
```

---

## Task 3: Translations file

**Files:**
- Create: `lib/i18n/translations.ts`

- [ ] **Step 1: Create the translations file**

Create `lib/i18n/translations.ts` with this exact content:

```ts
export type Language = 'en' | 'ar';

const en = {
  nav: {
    dashboard: 'Dashboard',
    representatives: 'Representatives',
    customerTypes: 'Customer Types',
    loggedInAs: 'Logged in as',
    logout: 'Logout',
  },
  login: {
    title: 'Castle Potatoes',
    subtitle: 'Admin Portal',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    demoCredentials: 'Demo Credentials',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome to Castle Potatoes Admin Portal',
    representatives: 'Representatives',
    customerTypes: 'Customer Types',
    totalAccounts: 'Total Accounts',
    clickManageReps: 'Click to manage representatives',
    clickManageTypes: 'Click to manage customer types',
    associatedWithReps: 'Associated with representatives',
    quickActions: 'Quick Actions',
    manageRepresentatives: 'Manage Representatives',
    manageCustomerTypes: 'Manage Customer Types',
    loadingDashboard: 'Loading dashboard...',
    failedToLoad: 'Failed to load dashboard stats',
  },
  representatives: {
    title: 'Representatives',
    subtitle: 'Manage your sales representatives and their accounts',
    addRepresentative: 'Add Representative',
    searchPlaceholder: 'Search by name...',
    loading: 'Loading representatives...',
    noFound: 'No representatives found',
    addFirst: 'Add your first representative',
    failedToLoad: 'Failed to load representatives',
    archive: 'Archive',
    archiveConfirm: 'Are you sure you want to archive this representative?',
    accounts: 'Accounts',
    noAccounts: 'No accounts for this representative',
    contact: 'Contact',
    location: 'Location',
  },
  newRepresentative: {
    title: 'Add Representative',
    backTo: 'Back to Representatives',
    name: 'Name',
    namePlaceholder: 'John Doe',
    mobile: 'Mobile',
    mobilePlaceholder: '+1 234 567 8900',
    email: 'Email',
    emailPlaceholder: 'john@example.com',
    designation: 'Designation',
    designationPlaceholder: 'Sales Manager',
    create: 'Create Representative',
    creating: 'Creating...',
    cancel: 'Cancel',
    nameRequired: 'Name is required',
    failedCreate: 'Failed to create representative',
    errorOccurred: 'An error occurred while creating the representative',
  },
  customerTypes: {
    title: 'Customer Types',
    subtitle: 'Manage different types of customers in your system',
    addType: 'Add Type',
    loading: 'Loading customer types...',
    noFound: 'No customer types found',
    addFirst: 'Add your first customer type',
    failedToLoad: 'Failed to load customer types',
    colName: 'Name',
    colOrder: 'Order',
    colActions: 'Actions',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    archive: 'Archive',
    archiveConfirm: 'Are you sure you want to archive this customer type?',
  },
  newCustomerType: {
    title: 'Add Customer Type',
    backTo: 'Back to Customer Types',
    name: 'Name',
    namePlaceholder: 'e.g., Enterprise, SMB, Startup',
    description: 'Description',
    descriptionPlaceholder: 'Describe this customer type...',
    create: 'Create Customer Type',
    creating: 'Creating...',
    cancel: 'Cancel',
    nameRequired: 'Name is required',
    failedCreate: 'Failed to create customer type',
    errorOccurred: 'An error occurred while creating the customer type',
  },
};

const ar: typeof en = {
  nav: {
    dashboard: 'لوحة التحكم',
    representatives: 'المندوبون',
    customerTypes: 'أنواع العملاء',
    loggedInAs: 'مسجل الدخول كـ',
    logout: 'تسجيل الخروج',
  },
  login: {
    title: 'Castle Potatoes',
    subtitle: 'بوابة المسؤول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جارٍ تسجيل الدخول...',
    demoCredentials: 'بيانات اعتماد تجريبية',
  },
  dashboard: {
    title: 'لوحة التحكم',
    welcome: 'مرحباً بك في بوابة مسؤول Castle Potatoes',
    representatives: 'المندوبون',
    customerTypes: 'أنواع العملاء',
    totalAccounts: 'إجمالي الحسابات',
    clickManageReps: 'انقر لإدارة المندوبين',
    clickManageTypes: 'انقر لإدارة أنواع العملاء',
    associatedWithReps: 'مرتبطة بالمندوبين',
    quickActions: 'إجراءات سريعة',
    manageRepresentatives: 'إدارة المندوبين',
    manageCustomerTypes: 'إدارة أنواع العملاء',
    loadingDashboard: 'جارٍ تحميل لوحة التحكم...',
    failedToLoad: 'فشل تحميل إحصائيات لوحة التحكم',
  },
  representatives: {
    title: 'المندوبون',
    subtitle: 'إدارة مندوبي المبيعات وحساباتهم',
    addRepresentative: 'إضافة مندوب',
    searchPlaceholder: 'البحث بالاسم...',
    loading: 'جارٍ تحميل المندوبين...',
    noFound: 'لا يوجد مندوبون',
    addFirst: 'أضف أول مندوب',
    failedToLoad: 'فشل تحميل المندوبين',
    archive: 'أرشفة',
    archiveConfirm: 'هل أنت متأكد من أرشفة هذا المندوب؟',
    accounts: 'الحسابات',
    noAccounts: 'لا توجد حسابات لهذا المندوب',
    contact: 'جهة الاتصال',
    location: 'الموقع',
  },
  newRepresentative: {
    title: 'إضافة مندوب',
    backTo: 'العودة إلى المندوبين',
    name: 'الاسم',
    namePlaceholder: 'محمد أحمد',
    mobile: 'الجوال',
    mobilePlaceholder: '+966 50 000 0000',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'mohammed@example.com',
    designation: 'المسمى الوظيفي',
    designationPlaceholder: 'مدير مبيعات',
    create: 'إنشاء مندوب',
    creating: 'جارٍ الإنشاء...',
    cancel: 'إلغاء',
    nameRequired: 'الاسم مطلوب',
    failedCreate: 'فشل إنشاء المندوب',
    errorOccurred: 'حدث خطأ أثناء إنشاء المندوب',
  },
  customerTypes: {
    title: 'أنواع العملاء',
    subtitle: 'إدارة أنواع العملاء المختلفة في النظام',
    addType: 'إضافة نوع',
    loading: 'جارٍ تحميل أنواع العملاء...',
    noFound: 'لا توجد أنواع عملاء',
    addFirst: 'أضف أول نوع عميل',
    failedToLoad: 'فشل تحميل أنواع العملاء',
    colName: 'الاسم',
    colOrder: 'الترتيب',
    colActions: 'الإجراءات',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    archive: 'أرشفة',
    archiveConfirm: 'هل أنت متأكد من أرشفة هذا النوع؟',
  },
  newCustomerType: {
    title: 'إضافة نوع عميل',
    backTo: 'العودة إلى أنواع العملاء',
    name: 'الاسم',
    namePlaceholder: 'مثال: مؤسسات، شركات صغيرة، ناشئة',
    description: 'الوصف',
    descriptionPlaceholder: 'وصف هذا النوع من العملاء...',
    create: 'إنشاء نوع العميل',
    creating: 'جارٍ الإنشاء...',
    cancel: 'إلغاء',
    nameRequired: 'الاسم مطلوب',
    failedCreate: 'فشل إنشاء نوع العميل',
    errorOccurred: 'حدث خطأ أثناء إنشاء نوع العميل',
  },
};

export const translations = { en, ar };
```

---

## Task 4: Language context

**Files:**
- Create: `lib/i18n/language-context.tsx`

- [ ] **Step 1: Create language-context.tsx**

Create `lib/i18n/language-context.tsx`:

```tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { translations, type Language } from './translations';

type LanguageContextType = {
  lang: Language;
  t: typeof translations.en;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('cp-language') as Language;
    if (saved === 'ar' || saved === 'en') setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('cp-language', lang);
  }, [lang]);

  const toggleLanguage = () => setLang(l => (l === 'en' ? 'ar' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
```

---

## Task 5: Toggle components

**Files:**
- Create: `components/theme-toggle.tsx`
- Create: `components/language-toggle.tsx`

- [ ] **Step 1: Create ThemeToggle component**

Create `components/theme-toggle.tsx`:

```tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition text-foreground"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 2: Create LanguageToggle component**

Create `components/language-toggle.tsx`:

```tsx
'use client';

import { useLanguage } from '@/lib/i18n/language-context';

export function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition text-foreground text-xs font-bold"
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {lang === 'en' ? 'ع' : 'EN'}
    </button>
  );
}
```

---

## Task 6: Update app layout with providers and Cairo font

**Files:**
- Create: `app/providers.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create app/providers.tsx**

Create `app/providers.tsx`:

```tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/lib/i18n/language-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
```

- [ ] **Step 2: Replace app/layout.tsx**

Replace the entire content of `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] });

export const metadata: Metadata = {
  title: "Castle Potatoes",
  description: "Welcome to Castle Potatoes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Task 7: Update dashboard layout — toggles + RTL + translations

**Files:**
- Modify: `app/(dashboard)/layout.tsx`

- [ ] **Step 1: Replace app/(dashboard)/layout.tsx entirely**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/lib/i18n/language-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) { router.push('/login'); return; }
        setUser(await response.json());
      } catch {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch { /* ignore */ }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex rtl:flex-row-reverse">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-e border-border p-6 sticky top-0 h-screen overflow-y-auto flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CP</span>
          </div>
          <h1 className="text-lg font-bold text-foreground truncate">Castle Potatoes</h1>
        </div>

        <nav className="space-y-1 mb-8 flex-1">
          {[
            { href: '/dashboard', label: t.nav.dashboard, icon: '📊', exact: true },
            { href: '/dashboard/representatives', label: t.nav.representatives, icon: '👥', exact: false },
            { href: '/dashboard/customer-types', label: t.nav.customerTypes, icon: '🏷️', exact: false },
          ].map(({ href, label, icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                (exact ? pathname === href : pathname.startsWith(href))
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-border pt-4 space-y-3">
          {/* Theme + Language toggles */}
          <div className="flex items-center justify-between px-1">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-secondary uppercase font-semibold">{t.nav.loggedInAs}</p>
            <p className="text-sm text-foreground font-semibold truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition font-semibold text-sm"
          >
            {t.nav.logout}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
```

---

## Task 8: Translate login page

**Files:**
- Modify: `app/(auth)/login/page.tsx`

- [ ] **Step 1: Replace app/(auth)/login/page.tsx**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/lib/i18n/language-context';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@castlepotatoes.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Login failed');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4 relative">
      {/* Top-right toggles */}
      <div className="absolute top-4 end-4 flex items-center gap-1">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md bg-background rounded-lg border border-border shadow-lg p-8">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t.login.title}</h1>
          </div>
          <p className="text-center text-secondary">{t.login.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.login.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="admin@castlepotatoes.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t.login.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? t.login.signingIn : t.login.signIn}
          </button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <p className="text-sm text-secondary mb-2">{t.login.demoCredentials}:</p>
          <p className="text-sm text-foreground font-mono">Email: admin@castlepotatoes.com</p>
          <p className="text-sm text-foreground font-mono">Password: admin123</p>
        </div>
      </div>
    </main>
  );
}
```

---

## Task 9: Translate dashboard home

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Replace app/(dashboard)/dashboard/page.tsx**

```tsx
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
    fetch('/api/dashboard/stats')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setStats(data))
      .catch(() => setError(t.dashboard.failedToLoad))
      .finally(() => setIsLoading(false));
  }, [t.dashboard.failedToLoad]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
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
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/representatives">
          <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-secondary text-sm font-semibold">{t.dashboard.representatives}</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.representativesCount ?? 0}</h3>
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
                <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.customerTypesCount ?? 0}</h3>
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
              <h3 className="text-3xl font-bold text-foreground mt-1">{stats?.accountsCount ?? 0}</h3>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
          <p className="text-xs text-secondary">{t.dashboard.associatedWithReps}</p>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">{t.dashboard.quickActions}</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/representatives" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
            {t.dashboard.manageRepresentatives}
          </Link>
          <Link href="/dashboard/customer-types" className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-muted transition font-semibold text-sm">
            {t.dashboard.manageCustomerTypes}
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## Task 10: Translate representatives pages

**Files:**
- Modify: `app/(dashboard)/dashboard/representatives/page.tsx`
- Modify: `app/(dashboard)/dashboard/representatives/new/page.tsx`

- [ ] **Step 1: Replace representatives/page.tsx**

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

interface Representative {
  id: string;
  name: string;
  mobile?: string;
  email?: string;
  designation?: string;
  isArchived: boolean;
}

interface Account {
  id: string;
  accountName: string;
  location?: string;
  contactPerson?: string;
}

export default function RepresentativesPage() {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [accounts, setAccounts] = useState<{ [key: string]: Account[] }>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => { fetchRepresentatives(); }, []);

  const fetchRepresentatives = async (query = '') => {
    try {
      setIsLoading(true);
      const url = query ? `/api/representatives?q=${encodeURIComponent(query)}` : '/api/representatives';
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      setRepresentatives(await response.json());
      setError('');
    } catch {
      setError(t.representatives.failedToLoad);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = async (repId: string) => {
    if (expandedId === repId) { setExpandedId(null); return; }
    try {
      const response = await fetch(`/api/representatives/${repId}/accounts`);
      if (response.ok) setAccounts(prev => ({ ...prev, [repId]: await response.json() }));
    } catch { /* ignore */ }
    setExpandedId(repId);
  };

  const handleArchive = async (id: string) => {
    if (!confirm(t.representatives.archiveConfirm)) return;
    try {
      const response = await fetch(`/api/representatives/${id}`, { method: 'DELETE' });
      if (response.ok) setRepresentatives(prev => prev.filter(r => r.id !== id));
    } catch { /* ignore */ }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.representatives.title}</h1>
          <p className="text-secondary">{t.representatives.subtitle}</p>
        </div>
        <Link href="/dashboard/representatives/new" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
          {t.representatives.addRepresentative}
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-background border border-border rounded-lg p-6 mb-6">
        <input
          type="text"
          placeholder={t.representatives.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); fetchRepresentatives(e.target.value); }}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-foreground">{t.representatives.loading}</p>
          </div>
        </div>
      ) : representatives.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-8 text-center">
          <p className="text-secondary text-lg">{t.representatives.noFound}</p>
          <Link href="/dashboard/representatives/new" className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            {t.representatives.addFirst}
          </Link>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          {representatives.map((rep) => (
            <div key={rep.id} className="border-b border-border last:border-0">
              <button
                onClick={() => toggleExpand(rep.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted transition text-start"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{rep.name}</h3>
                  <div className="mt-1 text-sm text-secondary flex flex-wrap gap-4">
                    {rep.designation && <span>{rep.designation}</span>}
                    {rep.mobile && <span>{rep.mobile}</span>}
                    {rep.email && <span>{rep.email}</span>}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleArchive(rep.id); }}
                  className="ms-4 px-3 py-1 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900 transition text-sm"
                >
                  {t.representatives.archive}
                </button>
                <span className="ms-4 text-secondary">{expandedId === rep.id ? '▼' : '▶'}</span>
              </button>

              {expandedId === rep.id && (
                <div className="px-6 py-4 bg-muted border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">{t.representatives.accounts}</h4>
                  {accounts[rep.id]?.length ? (
                    <div className="space-y-3">
                      {accounts[rep.id].map((account) => (
                        <div key={account.id} className="p-3 bg-background border border-border rounded">
                          <p className="font-semibold text-foreground">{account.accountName}</p>
                          {account.contactPerson && <p className="text-sm text-secondary">{t.representatives.contact}: {account.contactPerson}</p>}
                          {account.location && <p className="text-sm text-secondary">{t.representatives.location}: {account.location}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary text-sm">{t.representatives.noAccounts}</p>
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
```

- [ ] **Step 2: Replace representatives/new/page.tsx**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export default function NewRepresentativePage() {
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '', designation: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim()) { setError(t.newRepresentative.nameRequired); return; }
    setIsLoading(true);
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
    } catch {
      setError(t.newRepresentative.errorOccurred);
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
          {[
            { key: 'name', label: t.newRepresentative.name, type: 'text', placeholder: t.newRepresentative.namePlaceholder, required: true },
            { key: 'mobile', label: t.newRepresentative.mobile, type: 'tel', placeholder: t.newRepresentative.mobilePlaceholder, required: false },
            { key: 'email', label: t.newRepresentative.email, type: 'email', placeholder: t.newRepresentative.emailPlaceholder, required: false },
            { key: 'designation', label: t.newRepresentative.designation, type: 'text', placeholder: t.newRepresentative.designationPlaceholder, required: false },
          ].map(({ key, label, type, placeholder, required }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                name={key}
                value={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                placeholder={placeholder}
              />
            </div>
          ))}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isLoading} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
              {isLoading ? t.newRepresentative.creating : t.newRepresentative.create}
            </button>
            <Link href="/dashboard/representatives" className="flex-1 border border-border text-foreground py-2 rounded-lg hover:bg-muted transition font-semibold text-center">
              {t.newRepresentative.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Task 11: Translate customer-types pages

**Files:**
- Modify: `app/(dashboard)/dashboard/customer-types/page.tsx`
- Modify: `app/(dashboard)/dashboard/customer-types/new/page.tsx`

- [ ] **Step 1: Replace customer-types/page.tsx**

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

interface CustomerType {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export default function CustomerTypesPage() {
  const [types, setTypes] = useState<CustomerType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const { t } = useLanguage();

  useEffect(() => { fetchCustomerTypes(); }, []);

  const fetchCustomerTypes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customer-types');
      if (!response.ok) throw new Error();
      setTypes(await response.json());
      setError('');
    } catch {
      setError(t.customerTypes.failedToLoad);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm(t.customerTypes.archiveConfirm)) return;
    try {
      const response = await fetch(`/api/customer-types/${id}`, { method: 'DELETE' });
      if (response.ok) setTypes(prev => prev.filter(t => t.id !== id));
    } catch { /* ignore */ }
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/customer-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (response.ok) {
        setTypes(prev => prev.map(t => (t.id === id ? { ...t, name: editName } : t)));
        setEditingId(null);
      }
    } catch { /* ignore */ }
  };

  const handleSort = async (id: string, direction: 'up' | 'down') => {
    const index = types.findIndex(t => t.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === types.length - 1)) return;
    const newOrder = [...types];
    const target = direction === 'up' ? index - 1 : index + 1;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    await Promise.all(newOrder.map((item, i) =>
      fetch(`/api/customer-types/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: i }),
      })
    ));
    setTypes(newOrder);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.customerTypes.title}</h1>
          <p className="text-secondary">{t.customerTypes.subtitle}</p>
        </div>
        <Link href="/dashboard/customer-types/new" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
          {t.customerTypes.addType}
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-foreground">{t.customerTypes.loading}</p>
          </div>
        </div>
      ) : types.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-8 text-center">
          <p className="text-secondary text-lg">{t.customerTypes.noFound}</p>
          <Link href="/dashboard/customer-types/new" className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-blue-700 transition">
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
                        className="w-full px-3 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      />
                    ) : (
                      <div>
                        <p className="font-semibold text-foreground">{type.name}</p>
                        {type.description && <p className="text-sm text-secondary mt-1">{type.description}</p>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSort(type.id, 'up')} disabled={index === 0} className="px-2 py-1 bg-muted hover:bg-primary hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">▲</button>
                      <span className="text-center w-6">{index + 1}</span>
                      <button onClick={() => handleSort(type.id, 'down')} disabled={index === types.length - 1} className="px-2 py-1 bg-muted hover:bg-primary hover:text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">▼</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-end space-x-2 rtl:space-x-reverse">
                    {editingId === type.id ? (
                      <>
                        <button onClick={() => handleSaveEdit(type.id)} className="px-3 py-1 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 rounded hover:bg-green-100 transition text-sm">{t.customerTypes.save}</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-muted text-foreground rounded hover:bg-border transition text-sm">{t.customerTypes.cancel}</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(type.id); setEditName(type.name); }} className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-100 transition text-sm">{t.customerTypes.edit}</button>
                        <button onClick={() => handleArchive(type.id)} className="px-3 py-1 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded hover:bg-red-100 transition text-sm">{t.customerTypes.archive}</button>
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
```

- [ ] **Step 2: Replace customer-types/new/page.tsx**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export default function NewCustomerTypePage() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name.trim()) { setError(t.newCustomerType.nameRequired); return; }
    setIsLoading(true);
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
    } catch {
      setError(t.newCustomerType.errorOccurred);
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
              {t.newCustomerType.name} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder={t.newCustomerType.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">{t.newCustomerType.description}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              placeholder={t.newCustomerType.descriptionPlaceholder}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isLoading} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
              {isLoading ? t.newCustomerType.creating : t.newCustomerType.create}
            </button>
            <Link href="/dashboard/customer-types" className="flex-1 border border-border text-foreground py-2 rounded-lg hover:bg-muted transition font-semibold text-center">
              {t.newCustomerType.cancel}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Task 12: Build, commit, push, PR, merge

- [ ] **Step 1: Verify build passes**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
npm run build
```

Expected: `✓ Generating static pages` with no TypeScript errors.

- [ ] **Step 2: Commit all changes**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
git add -A
git commit -m "feat: add dark/light mode toggle and Arabic (RTL) language support

- next-themes for theme switching (system default, persisted)
- LanguageContext for EN/AR toggle with localStorage persistence
- RTL layout via dir=rtl on html element when AR selected
- Cairo font for Arabic script via next/font/google
- ThemeToggle (sun/moon) and LanguageToggle (ع/EN) in sidebar + login
- Full AR translations for all dashboard pages
- dark: Tailwind variants on all colored elements

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 3: Push feature branch**

```bash
git push origin feature/dark-mode-arabic
```

- [ ] **Step 4: Create PR to staging**

```bash
gh pr create \
  --base staging \
  --head feature/dark-mode-arabic \
  --title "feat: dark/light mode + Arabic language support" \
  --body "$(cat <<'EOF'
## Summary
- Dark/light mode toggle with system default, persisted in next-themes
- Arabic language toggle (EN ↔ AR) with RTL layout, persisted in localStorage  
- Cairo font for Arabic script
- Full translations for all pages (login, dashboard, representatives, customer types)
- Sun/moon icon toggle + ع/EN button in sidebar footer and login top-right

## Test plan
- [ ] Build passes
- [ ] Theme toggle switches dark/light, persists on reload
- [ ] Language toggle switches EN/AR, layout flips RTL, persists on reload
- [ ] All pages display correctly in both languages and themes
EOF
)"
```

- [ ] **Step 5: Merge PR to staging**

```bash
gh pr merge --merge --delete-branch
```

- [ ] **Step 6: Wait for staging deployment (30s), then PR staging → main**

```bash
sleep 30
gh pr create --base main --head staging --title "promote: dark mode + Arabic → production" --body "Promotes feat/dark-mode-arabic to production via staging. Verified on staging."
```

- [ ] **Step 7: Merge to main**

```bash
gh pr merge --merge
```

- [ ] **Step 8: Update staging Vercel alias to latest deployment**

```bash
sleep 40
STAGING_URL=$(vercel list 2>&1 | grep "Preview.*Ready" | head -1 | awk '{print $3}')
echo "Staging URL: $STAGING_URL"
vercel alias set "$STAGING_URL" v0-representatives-staging.vercel.app
```
