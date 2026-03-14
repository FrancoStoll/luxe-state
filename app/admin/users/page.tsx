import { createClient } from '@/lib/supabase/server';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  
  // Fetch users and their roles
  // Note: We need to join with our custom user_roles table
  // Since we can't easily list auth.users from client-side without service role,
  // we rely on the entries in public.user_roles which should map 1:1 via our trigger.
  
  const { data: users, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-nordic-dark">User Management</h1>
        <p className="text-nordic-dark/60 mt-2">Manage user roles and permissions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-nordic-dark/10">
        <table className="w-full text-left">
          <thead className="bg-nordic-light border-b border-nordic-dark/10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60">User ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60">Created At</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-nordic-dark/60 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nordic-dark/5">
            {users?.map((user: any) => (
              <tr key={user.id} className="hover:bg-nordic-light/30 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-nordic-dark/60">{user.user_id}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                    user.role === 'admin' ? 'bg-mosque text-white' : 'bg-nordic-dark/10 text-nordic-dark'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-nordic-dark/70 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-mosque hover:underline font-bold text-sm">
                    {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-nordic-dark/40 italic">
                  No users found in user_roles table.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-6 bg-mosque/5 rounded-2xl border border-mosque/10">
        <h3 className="font-bold text-mosque mb-2">Note on User Management</h3>
        <p className="text-sm text-nordic-dark/70 leading-relaxed">
          The user list above shows users who have been assigned a role in our database. 
          The `user_roles` table is automatically populated when new users sign up via the database trigger.
        </p>
      </div>
    </div>
  );
}
