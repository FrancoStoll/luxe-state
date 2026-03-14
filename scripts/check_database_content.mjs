import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local not found');
    process.exit(1);
  }
  const fileContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  fileContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdmins() {
  console.log('Checking for admin users in user_roles...');
  
  // Try to count admins. Note: This will only work if RLS allows it 
  // or if we use a service role (which we don't have here).
  // But we can check if there are ANY records in public.users to see if sync worked.
  
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .limit(5);

  if (userError) {
    console.error('Error fetching users:', userError.message);
  } else {
    console.log('Users found:', users.length);
    users.forEach(u => console.log(`- ${u.email} (${u.id})`));
  }

  const { data: roles, error: roleError } = await supabase
    .from('user_roles')
    .select('*');

  if (roleError) {
    console.error('Error fetching roles:', roleError.message);
  } else {
    console.log('Roles found:', roles.length);
    roles.forEach(r => console.log(`- User ID: ${r.user_id}, Role: ${r.role}`));
  }
}

checkAdmins();
