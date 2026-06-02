'use client';

import { useLanguage } from '@/lib/i18n/language-context';

export function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="w-9 h-9 flex items-center justify-center rounded-lg text-foreground hover:bg-muted transition text-sm font-semibold"
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'ع' : 'EN'}
    </button>
  );
}
