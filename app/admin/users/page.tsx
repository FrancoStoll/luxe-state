import { createClient } from '@/lib/supabase/server';

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  
  // Fetch users and their roles
  const { data: users, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-nordic">User Directory</h1>
          <p className="text-nordic/60 mt-1 text-sm">Manage user access and roles for your properties.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-icons text-nordic/40 group-focus-within:text-primary text-xl">search</span>
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-nordic shadow-soft placeholder-nordic/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm" 
              placeholder="Search by name, email..." 
              type="text"
            />
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-primary text-sm font-medium rounded-lg text-primary bg-transparent hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap">
            <span className="material-icons text-lg mr-2">add</span>
            Add User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-nordic/10 overflow-x-auto">
        <button className="pb-3 text-sm font-semibold text-primary border-b-2 border-primary">All Users</button>
        <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Agents</button>
        <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Brokers</button>
        <button className="pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors">Admins</button>
      </div>

      {/* Main Content */}
      <div className="space-y-4 pb-12">
        {/* Table Header (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role & Status</div>
          <div className="col-span-3">Member Since</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* User Cards */}
        {users?.map((user: UserRole) => (
          <div key={user.id} className="group relative bg-white rounded-xl p-5 shadow-sm border border-transparent hover:shadow-soft flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-all duration-200">
            <div className="col-span-12 md:col-span-4 flex items-center w-full">
              <div className="relative flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-nordic/5 flex items-center justify-center border-2 border-white overflow-hidden uppercase font-bold text-nordic/60">
                  {user.role?.[0] || 'U'}
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <div className="ml-4 overflow-hidden">
                <div className="text-sm font-bold text-nordic truncate">User ID</div>
                <div className="text-xs text-nordic/70 truncate font-mono">{user.user_id}</div>
                <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-nordic/5 rounded text-nordic/60">ID: #{user.id.slice(-4).toUpperCase()}</div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-nordic/5 text-nordic/60'
              }`}>
                {user.role === 'admin' ? 'Administrator' : user.role === 'broker' ? 'Broker' : 'Agent'}
              </span>
              <div className="flex items-center text-xs text-nordic/60">
                <span className="material-icons text-[14px] mr-1 text-primary">check_circle</span>
                Active
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 w-full">
              <div className="text-[10px] uppercase tracking-wider text-nordic/50 font-semibold mb-1">Joined</div>
              <div className="text-sm font-semibold text-nordic">{new Date(user.created_at).toLocaleDateString()}</div>
            </div>

            <div className="col-span-12 md:col-span-2 w-full flex justify-end">
              <button className="inline-flex items-center px-4 py-2 border border-nordic/10 bg-white shadow-sm text-xs font-medium rounded-lg text-nordic hover:bg-nordic hover:text-white focus:outline-none transition-colors w-full md:w-auto justify-center">
                Change Role
                <span className="material-icons text-[16px] ml-2">expand_more</span>
              </button>
            </div>
          </div>
        ))}

        {(!users || users.length === 0) && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-nordic/10">
            <span className="material-icons text-nordic/20 text-5xl mb-4">person_off</span>
            <p className="text-nordic/50 italic font-medium">No users found in the system.</p>
          </div>
        )}
      </div>

      {/* Footer / Pagination */}
      <div className="mt-8 border-t border-nordic/5 py-6 flex items-center justify-between">
        <p className="text-sm text-nordic/60">
          Showing <span className="font-semibold text-nordic">1</span> to <span className="font-semibold text-nordic">{users?.length || 0}</span> of <span className="font-semibold text-nordic">{users?.length || 0}</span> users
        </p>
        <div className="flex gap-2">
           <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-nordic/10 text-nordic disabled:opacity-50">Previous</button>
           <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-nordic/10 text-nordic disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}
