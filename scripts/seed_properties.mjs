import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Using URL:', supabaseUrl);
console.log('Using Key (start):', supabaseAnonKey?.substring(0, 10));



if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const properties = [
  {
    title: 'Sunset Villa',
    slug: 'sunset-villa',
    location: 'Ibiza, Spain',
    price: '$4,200,000',
    beds: 5,
    baths: 4,
    area: '380',
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCra-FKp81t0_OM8bWD55m2o9OOSnR_v7D0UilyExMImxyIcr9tIMZ2Py3HcC0ra_MtSsBkduMcwxUNKI9_iSXFFr_YRON1SF9hNM3fcYy-uG7N7uusL0Z367WINi1V7_GwfNQx-gsbUqLtzVi4ivFyqFQGb4qBs79bALeSFb6i3_ZnJnI1VVrN-VeZYHjfYyQI5C6zy90N3uxWZpwzIBhNoUDKKQjQ8EOEYPoyPTzhnh6b6AS3dkkFJ8t4xSDC6qjhMrQUoUPnAeM'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Alpine Modern Chalet',
    slug: 'alpine-modern-chalet',
    location: 'Zermatt, Switzerland',
    price: '$3,500,000',
    beds: 4,
    baths: 3.5,
    area: '250',
    images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2071&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Kyoto Zen House',
    slug: 'kyoto-zen-house',
    location: 'Kyoto, Japan',
    price: '$1,800,000',
    beds: 3,
    baths: 2,
    area: '180',
    images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Belgravia Residence',
    slug: 'belgravia-residence',
    location: 'London, UK',
    price: '$12,500,000',
    beds: 6,
    baths: 6,
    area: '550',
    images: ['https://images.unsplash.com/photo-1600607687948-38666579893d?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Santorini Cliff Villa',
    slug: 'santorini-cliff-villa',
    location: 'Oia, Greece',
    price: '$2,900,000',
    beds: 3,
    baths: 3,
    area: '210',
    images: ['https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Manhattan Sky Loft',
    slug: 'manhattan-sky-loft',
    location: 'New York, USA',
    price: '$7,500/mo',
    beds: 2,
    baths: 2,
    area: '140',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR RENT',
    badge_color: 'mosque',
    is_featured: false
  },
  {
    title: 'Cotswolds Manor',
    slug: 'cotswolds-manor',
    location: 'Gloucestershire, UK',
    price: '$5,800,000',
    beds: 7,
    baths: 5,
    area: '620',
    images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Berlin Art District Flat',
    slug: 'berlin-art-district-flat',
    location: 'Berlin, Germany',
    price: '$1,200,000',
    beds: 2,
    baths: 1,
    area: '95',
    images: ['https://images.unsplash.com/photo-1536376074432-bf121770998a?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Amalfi Coast Retreat',
    slug: 'amalfi-coast-retreat',
    location: 'Positano, Italy',
    price: '$3,600,000',
    beds: 4,
    baths: 3,
    area: '280',
    images: ['https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Tokyo Minimalist Studio',
    slug: 'tokyo-minimalist-studio',
    location: 'Shibuya, Japan',
    price: '$950,000',
    beds: 1,
    baths: 1,
    area: '45',
    images: ['https://images.unsplash.com/photo-1556912177-c54034b7971d?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Sydney Harbour View',
    slug: 'sydney-harbour-view',
    location: 'Sydney, Australia',
    price: '$8,200,000',
    beds: 4,
    baths: 4,
    area: '320',
    images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecde9d7?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Paris Haussmannian Apartment',
    slug: 'paris-haussmannian-apartment',
    location: 'Paris, France',
    price: '$4,800,000',
    beds: 3,
    baths: 2,
    area: '160',
    images: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1974&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Cape Town Coastal Estate',
    slug: 'cape-town-coastal-estate',
    location: 'Cape Town, SA',
    price: '$2,400,000',
    beds: 5,
    baths: 4,
    area: '410',
    images: ['https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Dubai Marina Penthouse',
    slug: 'dubai-marina-penthouse',
    location: 'Dubai, UAE',
    price: '$12,000/mo',
    beds: 3,
    baths: 3,
    area: '220',
    images: ['https://images.unsplash.com/photo-1527030280862-64139fba04ca?q=80&w=2071&auto=format&fit=crop'],
    badge: 'FOR RENT',
    badge_color: 'mosque',
    is_featured: false
  },
  {
    title: 'Reykjavik Eco Home',
    slug: 'reykjavik-eco-home',
    location: 'Reykjavik, Iceland',
    price: '$1,900,000',
    beds: 3,
    baths: 2,
    area: '145',
    images: ['https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Lisbon Riverfront Flat',
    slug: 'lisbon-riverfront-flat',
    location: 'Lisbon, Portugal',
    price: '$3,200/mo',
    beds: 2,
    baths: 1.5,
    area: '110',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR RENT',
    badge_color: 'mosque',
    is_featured: false
  },
  {
    title: 'Aspen Ski Lodge',
    slug: 'aspen-ski-lodge',
    location: 'Aspen, USA',
    price: '$15,500,000',
    beds: 6,
    baths: 7,
    area: '780',
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Tulum Jungle Cabin',
    slug: 'tulum-jungle-cabin',
    location: 'Tulum, Mexico',
    price: '$650,000',
    beds: 2,
    baths: 2,
    area: '120',
    images: ['https://images.unsplash.com/photo-1510627889976-180a3167fba0?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Vancouver Island Retreat',
    slug: 'vancouver-island-retreat',
    location: 'BC, Canada',
    price: '$2,150,000',
    beds: 3,
    baths: 2,
    area: '230',
    images: ['https://images.unsplash.com/photo-1449156001435-3a141fcdbb99?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  },
  {
    title: 'Rome Historic Loft',
    slug: 'rome-historic-loft',
    location: 'Rome, Italy',
    price: '$2,100,000',
    beds: 2,
    baths: 2,
    area: '155',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'],
    badge: 'FOR SALE',
    badge_color: 'nordic-dark',
    is_featured: false
  }
];

async function seed() {
  console.log('Seeding 20 properties...');
  const { data, error } = await supabase
    .from('properties')
    .insert(properties);

  if (error) {
    console.error('Error seeding properties:', error);
    process.exit(1);
  }

  console.log('Successfully seeded 20 properties.');
}

seed();
