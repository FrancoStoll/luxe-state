'use client';

import Image from 'next/image';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '@/lib/contexts/LanguageContext';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

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

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsPopoverOpen(false);
    router.push("/login");
    router.refresh();
  };

  // Hides the navbar in LoginPage and Admin pages
  if (pathname === '/login' || pathname?.startsWith('/admin')) return null;

  const socialProvider = user?.app_metadata?.provider;
  const hasSocialAvatar = user?.user_metadata?.avatar_url;
  const isAuthorizedProvider = socialProvider === 'google' || socialProvider === 'github';
  const showProfile = user && isAuthorizedProvider && hasSocialAvatar;

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
            
            <div className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 ml-2 relative" ref={popoverRef}>
              {showProfile ? (
                <>
                  <button 
                    onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                    className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-nordic-dark/5 hover:ring-mosque transition-all relative"
                  >
                    <Image 
                      alt={user.user_metadata.full_name || "User"} 
                      className="w-full h-full object-cover" 
                      src={user.user_metadata.avatar_url || "https://www.gravatar.com/avatar/?d=mp"}
                      fill
                    />
                  </button>

                  {/* Popover */}
                  {isPopoverOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-nordic-dark/5 py-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-nordic-dark/5 mb-1">
                        <p className="text-sm font-bold text-nordic-dark truncate">
                          {user.user_metadata.full_name || user.email}
                        </p>
                        <p className="text-[11px] text-nordic-dark/50 font-medium truncate">
                          {user.email}
                        </p>
                      </div>
                      
                      <div className="px-4 py-2 text-[10px] font-bold text-nordic-dark/30 uppercase tracking-widest leading-none mt-1">
                        Admin
                      </div>

                      <Link 
                        href="/admin/properties"
                        onClick={() => setIsPopoverOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-dark hover:bg-nordic-dark/5 transition-colors"
                      >
                        <span className="material-icons text-lg text-nordic-dark/40">dashboard</span>
                        {t('admin.nav.properties')}
                      </Link>
                      
                      <Link 
                        href="/admin/users"
                        onClick={() => setIsPopoverOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-dark hover:bg-nordic-dark/5 transition-colors"
                      >
                        <span className="material-icons text-lg text-nordic-dark/40">people</span>
                        {t('admin.nav.users')}
                      </Link>

                      <div className="h-px bg-nordic-dark/5 my-1"></div>
                      
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <span className="material-icons text-lg">logout</span>
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </>
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
