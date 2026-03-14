'use client';

import { useTranslation } from '@/lib/contexts/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'pt-br' as const, name: 'Português', flag: '🇧🇷' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full rounded-md border border-nordic-dark/10 shadow-sm px-3 py-1.5 bg-background-light text-sm font-medium text-nordic-dark hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mosque transition-all"
          id="language-menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="mr-2">{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
          <span className="material-icons text-sm ml-1">expand_more</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-background-light ring-1 ring-black ring-opacity-5 focus:outline-none z-100 animate-in fade-in zoom-in duration-200"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu-button"
        >
          <div className="py-1" role="none">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                  router.refresh();
                }}
                className={`
                  ${language === lang.code ? 'bg-gray-100 text-mosque' : 'text-nordic-dark'}
                  flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors
                `}
                role="menuitem"
              >
                <span className="mr-3">{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
