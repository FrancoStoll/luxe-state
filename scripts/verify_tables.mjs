import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env parsing
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Checking database tables...');
  
  // Checking 'users' table in public schema
  const { error: userError } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (userError) {
    if (userError.code === '42P01') {
      console.log('❌ Table "public.users" does NOT exist.');
    } else {
      console.error('Error checking "users" table:', userError.message);
    }
  } else {
    console.log('✅ Table "public.users" EXISTS.');
  }

  // Checking 'user_roles' table
  const { error: roleError } = await supabase
    .from('user_roles')
    .select('*')
    .limit(1);

  if (roleError) {
    if (roleError.code === '42P01') {
      console.log('❌ Table "public.user_roles" does NOT exist.');
    } else {
      console.error('Error checking "user_roles" table:', roleError.message);
    }
  } else {
    console.log('✅ Table "public.user_roles" EXISTS.');
  }
}

checkTables();
