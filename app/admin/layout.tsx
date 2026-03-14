import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import AdminNavbar from "@/components/AdminNavbar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  // Check admin role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (roleData?.role !== 'admin') {
    redirect('/');
  }

  const fullName = user?.user_metadata?.full_name || "Alex Morgan";

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-nordic font-sans antialiased flex flex-col">
      <AdminNavbar user={user} fullName={fullName} />

      {/* Content Area */}
      <main className="grow pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
