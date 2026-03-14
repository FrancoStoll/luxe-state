import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-nordic-light">
      <aside className="w-64 bg-nordic-dark text-white p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-10">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
            LUXE<span className="text-mosque">STATE</span>
          </Link>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">Admin Dashboard</p>
        </div>
        
        <nav className="space-y-4">
          <Link href="/admin/properties" className="block p-3 rounded-lg hover:bg-white/10 transition-colors">
            Properties
          </Link>
          <Link href="/admin/users" className="block p-3 rounded-lg hover:bg-white/10 transition-colors">
            Users & Roles
          </Link>
          <div className="pt-10">
             <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
              &larr; Back to Site
            </Link>
          </div>
        </nav>
      </aside>
      
      <main className="flex-1 p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
