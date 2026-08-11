import { HeroSection } from '../components/home/HeroSection'
import { HomeAgende2027PromoSection } from '../components/home/HomeAgende2027PromoSection'
import { FeaturedCategorySpotlight } from '../components/home/FeaturedCategorySpotlight'
import { BrandMarquee } from '../components/home/BrandMarquee'
import { WhyChooseUs } from '../components/home/WhyChooseUs'
import { HomeFeaturedProductsSection } from '../components/home/HomeFeaturedProductsSection'
import { AstroSalutePromoSection } from '../components/home/AstroSalutePromoSection'
import { AstroMedicalShopInfoPanel } from '../components/astroMedical/AstroMedicalShopInfoPanel'

export function HomePage() {
  return (
    <main>
      <HomeAgende2027PromoSection />
      <HeroSection />
      <section
        className="bg-gradient-to-b from-medical-50/80 to-white"
        aria-label="Catalogo GIMA Astro Medical Shop"
      >
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6 lg:px-8">
          <AstroMedicalShopInfoPanel className="mt-4" />
        </div>
      </section>
      <FeaturedCategorySpotlight />
      <BrandMarquee />
      <WhyChooseUs />
      <HomeFeaturedProductsSection />
      <AstroSalutePromoSection />
    </main>
  )
}
