"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/contexts/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import { useState, useRef, useEffect } from "react";

interface AdminNavbarProps {
  user: User | null;
  fullName: string;
}

export default function AdminNavbar({ user, fullName }: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  const isProperties = pathname === "/admin/properties" || pathname === "/admin";
  const isUsers = pathname === "/admin/users";

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
                <span className="material-icons text-white text-xl">
                  apartment
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight text-nordic-dark group-hover:text-mosque transition-colors">
                LuxeEstate
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8 self-stretch">
              <Link
                href="/admin/properties"
                className={`flex items-center h-full px-1 text-sm font-medium transition-all border-b-2 ${
                  isProperties
                    ? "text-mosque border-mosque"
                    : "text-nordic-dark/70 border-transparent hover:text-nordic-dark"
                }`}
              >
                {t('admin.nav.properties')}
              </Link>
              <Link
                href="/admin/users"
                className={`flex items-center h-full px-1 text-sm font-medium transition-all border-b-2 ${
                  isUsers
                    ? "text-mosque border-mosque"
                    : "text-nordic-dark/70 border-transparent hover:text-nordic-dark"
                }`}
              >
                {t('admin.nav.users')}
              </Link>
            </div>
          </div>

          {/* Right side Profile & Notifications & Logout */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            <button className="text-nordic-dark hover:text-mosque transition-colors relative">
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light"></span>
            </button>

            <div className="h-10 w-px bg-nordic-dark/10"></div>

            <div className="flex items-center gap-4 relative" ref={popoverRef}>
              <button 
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-nordic-dark group-hover:text-mosque transition-colors">
                    {fullName}
                  </span>
                  <span className="text-[11px] text-nordic-dark/50 font-medium tracking-tight">
                    {t('admin.nav.role')}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-nordic-dark/5 group-hover:ring-mosque transition-all relative">
                  {user?.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="material-icons text-nordic-dark/40 text-lg flex items-center justify-center h-full">
                      person
                    </span>
                  )}
                </div>
              </button>

              {/* Popover */}
              {isPopoverOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-nordic-dark/5 py-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-nordic-dark/5 mb-1">
                    <p className="text-sm font-bold text-nordic-dark truncate">
                      {fullName}
                    </p>
                    <p className="text-[11px] text-nordic-dark/50 font-medium truncate">
                      {user?.email}
                    </p>
                  </div>
                  
                  <Link 
                    href="/"
                    onClick={() => setIsPopoverOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-nordic-dark hover:bg-nordic-dark/5 transition-colors"
                  >
                    <span className="material-icons text-lg text-nordic-dark/40">home</span>
                    {t('nav.buy')}
                  </Link>
                  
                  <div className="h-px bg-nordic-dark/5 my-1"></div>
                  
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <span className="material-icons text-lg">logout</span>
                    {t('admin.nav.sign_out')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
