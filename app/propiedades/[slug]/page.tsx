import { getPropertyBySlug } from "@/lib/properties";
import { notFound } from "next/navigation";
import Image from "next/image";
import PropertyMap from "@/components/PropertyMap";
import PropertyGallery from "@/components/PropertyGallery";
import { getTranslation } from "@/lib/i18n-server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found | Luxe Estate",
    };
  }

  const firstImage = property.images?.[0] ?? null;
  const description = `${property.title} — ${property.beds} beds, ${property.baths} baths, ${property.area} m² in ${property.location}. Price: ${property.price}`;
  const url = `https://luxe-state-main-delta.vercel.app/propiedades/${slug}`;

  return {
    title: `${property.title} | Luxe Estate`,
    description,
    openGraph: {
      title: `${property.title} | Luxe Estate`,
      description,
      url,
      siteName: "Luxe Estate",
      images: firstImage
        ? [
            {
              url: firstImage,
              width: 1200,
              height: 630,
              alt: property.title,
            },
          ]
        : [],
      locale: "es_AR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.title} | Luxe Estate`,
      description,
      images: firstImage ? [firstImage] : [],
    },
  };
}

export default async function PropertyDetailsPage({
  params,
}: Props) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  const { t } = await getTranslation();

  if (!property) {
    notFound();
  }
  
  const locationParts = property.location.split(',');
  const city = locationParts[0] || property.location;

  // Use the images collection
  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : [];

  // SEO Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": `${property.title} in ${property.location}. ${property.beds} beds, ${property.baths} baths.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.location,
    },
    "image": galleryImages[0],
    "price": property.price,
    "numberOfRooms": property.beds,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-4">
          {/* Interactive Gallery Component */}
          <PropertyGallery 
            images={galleryImages} 
            title={property.title}
            badge={property.badge}
          />

        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 space-y-6">
            
            {/* Price & Agent Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
              <div className="mb-4">
                <h1 className="text-4xl font-light text-nordic-dark mb-2">
                  {property.price}
                  {property.badge_color === 'mosque' && <span className="text-xl text-nordic-muted">{t('common.per_month')}</span>}
                </h1>
                <p className="text-nordic-muted font-medium flex items-center gap-1">
                  <span className="material-icons text-mosque text-sm">
                    location_on
                  </span>
                  {property.location}
                </p>
              </div>
              <div className="h-px bg-slate-100 my-6"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    alt="Agent"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-dark">Sarah Jenkins</h3>
                  <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                    <span className="material-icons text-[14px]">star</span>
                    <span>{t('property.top_agent')}</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-2">
                  <button className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-all shadow-sm hover:shadow-md cursor-pointer">
                    <span className="material-icons text-xl">chat</span>
                  </button>
                  <button className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-all shadow-sm hover:shadow-md cursor-pointer">
                    <span className="material-icons text-xl">call</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-mosque hover:bg-mosque/90 text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer">
                  <span className="material-icons text-xl group-hover:scale-110 transition-transform">
                    calendar_today
                  </span>
                  {t('property.schedule_visit')}
                </button>
                <button className="w-full bg-transparent border border-nordic-dark/10 hover:border-mosque text-nordic-dark hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span className="material-icons text-xl">mail_outline</span>
                  {t('property.contact_agent')}
                </button>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5 h-[300px]">
               <PropertyMap locationString={property.location} latitude={property.latitude} longitude={property.longitude} />
            </div>
            
          </div>
        </div>

        {/* Details Bottom Section */}
        <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
          
          {/* Features Grid */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">
              {t('property.features')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-mosque/20 hover:shadow-soft transition-all group cursor-pointer">
                <div className="w-14 h-14 aspect-square shrink-0 rounded-full bg-mosque/5 flex items-center justify-center text-mosque mb-4 group-hover:bg-mosque group-hover:text-white transition-all duration-300">
                  <span className="material-icons text-3xl">square_foot</span>
                </div>
                <span className="text-xl font-bold text-nordic-dark">{property.area}</span>
                <span className="text-[10px] uppercase tracking-widest text-nordic-muted font-bold">
                  {t('property.sq_meters')}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-mosque/20 hover:shadow-soft transition-all group cursor-pointer">
                <div className="w-14 h-14 aspect-square shrink-0 rounded-full bg-mosque/5 flex items-center justify-center text-mosque mb-4 group-hover:bg-mosque group-hover:text-white transition-all duration-300">
                  <span className="material-icons text-3xl">king_bed</span>
                </div>
                <span className="text-xl font-bold text-nordic-dark">{property.beds}</span>
                <span className="text-[10px] uppercase tracking-widest text-nordic-muted font-bold">
                  {t('property.bedrooms')}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-mosque/20 hover:shadow-soft transition-all group cursor-pointer">
                <div className="w-14 h-14 aspect-square shrink-0 rounded-full bg-mosque/5 flex items-center justify-center text-mosque mb-4 group-hover:bg-mosque group-hover:text-white transition-all duration-300">
                  <span className="material-icons text-3xl">bathtub</span>
                </div>
                <span className="text-xl font-bold text-nordic-dark">{property.baths}</span>
                <span className="text-[10px] uppercase tracking-widest text-nordic-muted font-bold">
                  {t('property.bathrooms')}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-mosque/20 hover:shadow-soft transition-all group cursor-pointer">
                <div className="w-14 h-14 aspect-square shrink-0 rounded-full bg-mosque/5 flex items-center justify-center text-mosque mb-4 group-hover:bg-mosque group-hover:text-white transition-all duration-300">
                  <span className="material-icons text-3xl">directions_car</span>
                </div>
                <span className="text-xl font-bold text-nordic-dark">
                  {Math.floor(property.beds / 2) || 1}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-nordic-muted font-bold">
                  {t('property.garage')}
                </span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-4 text-nordic-dark">
              {t('property.about')}
            </h2>
            <div className="prose prose-slate max-w-none text-nordic-muted leading-relaxed">
              <p className="mb-4">
                {t('property.description_1')} {city}. {t('property.description_2')}
              </p>
              <p>
                {t('property.description_3')}
                {t('property.description_4')}
              </p>
            </div>
            <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
              {t('property.read_more')}
              <span className="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Amenities */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
            <h2 className="text-lg font-semibold mb-6 text-nordic-dark">{t('property.amenities')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center gap-3 text-nordic-muted">
                <span className="material-icons text-mosque/60 text-sm">
                  check_circle
                </span>
                <span>{t('property.smart_home')}</span>
              </div>
              <div className="flex items-center gap-3 text-nordic-muted">
                <span className="material-icons text-mosque/60 text-sm">
                  check_circle
                </span>
                <span>{t('property.pool')}</span>
              </div>
              <div className="flex items-center gap-3 text-nordic-muted">
                <span className="material-icons text-mosque/60 text-sm">
                  check_circle
                </span>
                <span>{t('property.hvac')}</span>
              </div>
              <div className="flex items-center gap-3 text-nordic-muted">
                <span className="material-icons text-mosque/60 text-sm">
                  check_circle
                </span>
                <span>{t('property.ev_charging')}</span>
              </div>
              <div className="flex items-center gap-3 text-nordic-muted">
                <span className="material-icons text-mosque/60 text-sm">
                  check_circle
                </span>
                <span>{t('property.gym')}</span>
              </div>
              <div className="flex items-center gap-3 text-nordic-muted">
                <span className="material-icons text-mosque/60 text-sm">
                  check_circle
                </span>
                <span>{t('property.wine_cellar')}</span>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="bg-mosque/5 p-6 rounded-xl border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 aspect-square shrink-0 flex items-center justify-center bg-white rounded-full text-mosque shadow-md border border-slate-100">
                <span className="material-icons text-3xl">calculate</span>
              </div>
              <div>
                <h3 className="font-semibold text-nordic-dark">
                  {t('property.estimated_payment')}
                </h3>
                <p className="text-sm text-nordic-muted">
                  {t('property.starting_from')} <strong className="text-mosque">{(parseInt(property.price.replace(/[^0-9]/g, "")) * 0.005).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0})}{t('common.per_month')}</strong>{" "}
                  {t('property.down_payment')}
                </p>
              </div>
            </div>
            <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic-dark/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic-dark cursor-pointer">
              {t('property.calculate_mortgage')}
            </button>
          </div>

        </div>

      </div>
    </main>
    </>
  );
}
