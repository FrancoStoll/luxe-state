import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log('Checking connection...');
  const { data, error } = await supabase.from('properties').select('*').limit(1);
  if (error) {
    console.error('Error fetching properties:', error);
  } else {
    console.log('Success! Found properties:', data.length);
    console.log('Example property:', JSON.stringify(data[0], null, 2));
    
    console.log('Attempting test insert...');
    const testProp = {
      title: 'Test Property',
      slug: 'test-property-' + Date.now(),
      location: 'Test City',
      price: '$1,000,000',
      beds: 1,
      baths: 1,
      area: '100',
      images: ['https://example.com/image.jpg'],
      badge: 'TEST',
      badge_color: 'white',
      is_featured: false
    };
    const { error: insertError } = await supabase.from('properties').insert([testProp]);
    if (insertError) {
      console.error('Error inserting test property:', insertError);
    } else {
      console.log('Successfully inserted test property!');
    }
  }
}

check();
