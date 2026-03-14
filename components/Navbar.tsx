'use client';

import Image from 'next/image';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { signOut } from '@/app/login/actions';

export default function Navbar() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link 
            href="/" 
            className="shrink-0 flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-nordic-dark flex items-center justify-center group-hover:bg-mosque transition-colors shadow-sm">
              <span className="material-icons text-white text-xl">apartment</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-nordic-dark group-hover:text-mosque transition-colors">
              LuxeEstate
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link className="text-mosque font-medium text-sm border-b-2 border-mosque px-1 py-1" href="/">{t('nav.buy')}</Link>
            <Link className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('nav.rent')}</Link>
            <Link className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('nav.sell')}</Link>
            <Link className="text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm hover:border-b-2 hover:border-nordic-dark/20 px-1 py-1 transition-all" href="#">{t('nav.saved')}</Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            <button className="text-nordic-dark hover:text-mosque transition-colors">
              <span className="material-icons">search</span>
            </button>
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light "></span>
            </button>
            
            <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-nordic-dark/5 hover:ring-mosque transition-all relative">
                    <Image 
                      alt={user.user_metadata.full_name || "User"} 
                      className="w-full h-full object-cover" 
                      src={user.user_metadata.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
                      fill
                    />
                  </div>
                  <form action={signOut}>
                    <button className="text-xs font-semibold text-nordic-dark/60 hover:text-mosque transition-colors uppercase tracking-wider">
                      {t('nav.logout')}
                    </button>
                  </form>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="text-sm font-semibold text-nordic-dark hover:text-mosque transition-colors"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-nordic-dark/5 bg-background-light overflow-hidden h-0 transition-all duration-300">
        <div className="px-4 py-2 space-y-1">
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-mosque bg-mosque/10" href="/">{t('nav.buy')}</Link>
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('nav.rent')}</Link>
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('nav.sell')}</Link>
          <Link className="block px-3 py-2 rounded-md text-base font-medium text-nordic-dark hover:bg-black/5" href="#">{t('nav.saved')}</Link>
        </div>
      </div>
    </nav>
  );
}
