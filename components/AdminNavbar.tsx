'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';

interface AdminNavbarProps {
  user: User | null;
  fullName: string;
}

export default function AdminNavbar({ user, fullName }: AdminNavbarProps) {
  const pathname = usePathname();

  const isDashboard = pathname === '/admin/properties' || pathname === '/admin';
  const isUsers = pathname === '/admin/users';

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 backdrop-blur-md border-b border-nordic-dark/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Main Nav */}
          <div className="flex items-center gap-12">
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
            
            <div className="hidden md:flex items-center space-x-8 self-stretch">
              <Link 
                href="/admin/properties" 
                className={`flex items-center h-full px-1 text-sm font-medium transition-all border-b-2 ${
                  isDashboard 
                  ? 'text-mosque border-mosque' 
                  : 'text-nordic-dark/70 border-transparent hover:text-nordic-dark'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/properties" 
                className="flex items-center h-full px-1 text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm transition-all border-b-2 border-transparent"
              >
                Listings
              </Link>
              <Link 
                href="/admin/users" 
                className={`flex items-center h-full px-1 text-sm font-medium transition-all border-b-2 ${
                  isUsers 
                  ? 'text-mosque border-mosque' 
                  : 'text-nordic-dark/70 border-transparent hover:text-nordic-dark'
                }`}
              >
                Users
              </Link>
              <Link 
                href="#" 
                className="flex items-center h-full px-1 text-nordic-dark/70 hover:text-nordic-dark font-medium text-sm transition-all border-b-2 border-transparent"
              >
                Finance
              </Link>
            </div>
          </div>
          
          {/* Right side Profile & Notifications */}
          <div className="flex items-center gap-6">
            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>
            
            <div className="h-10 w-px bg-nordic-dark/10"></div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-nordic-dark">{fullName}</span>
                <span className="text-[11px] text-nordic-dark/50 font-medium tracking-tight">Premium Agent</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-nordic-dark/5 hover:ring-mosque transition-all relative">
                 {user?.user_metadata?.avatar_url ? (
                   <Image 
                    src={user.user_metadata.avatar_url} 
                    alt="Profile" 
                    fill 
                    className="object-cover" 
                   />
                 ) : (
                   <span className="material-icons text-nordic-dark/40 text-lg flex items-center justify-center h-full">person</span>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
