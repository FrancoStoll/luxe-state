import FeaturedCard from "@/components/FeaturedCard";
import PropertyCard from "@/components/PropertyCard";
import Pagination from "@/components/Pagination";
import HomeSearchSection from "@/components/HomeSearchSection";
import { getFeaturedProperties, getProperties } from "@/lib/properties";

interface HomeProps {
  searchParams: Promise<{ page?: string; q?: string; type?: string }>;
}

import { getTranslation } from "@/lib/i18n-server";

export default async function Home({ searchParams }: HomeProps) {
  const { t } = await getTranslation();
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const query = params.q || "";
  const type = params.type || "All";

  const [featuredProperties, { properties, totalPages }] = await Promise.all([
    getFeaturedProperties(),
    getProperties(currentPage, { query, type }),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <HomeSearchSection />

      {query === "" && type === "All" && currentPage === 1 && featuredProperties.length > 0 && (
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-light text-nordic-dark ">
                {t('home.featured')}
              </h2>
              <p className="text-nordic-muted mt-1 text-sm">
                {t('home.featured_subtitle')}
              </p>
            </div>
            <a
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
              href="#"
            >
              {t('home.view_all')} <span className="material-icons text-sm">arrow_forward</span>
            </a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProperties.map((property) => (
              <FeaturedCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-light text-nordic-dark ">
              {t('home.new_market')}
            </h2>
            <p className="text-nordic-muted mt-1 text-sm">
              {t('home.new_market_subtitle')}
            </p>
          </div>
          <div className="hidden md:flex bg-white p-1 rounded-lg">
            {["All", "Buy", "Rent"].map((filterType) => (
               <button 
                 key={filterType}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                   type === filterType 
                     ? "bg-nordic-dark text-white shadow-sm" 
                     : "text-nordic-muted hover:text-nordic-dark"
                 }`}
               >
                 {t(`home.types.${filterType}`)}
               </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </section>
    </main>
  );
}
