import AnnouncementBar from '../components/home/AnnouncementBar';
import Header from '../components/home/Header';
import HeroBanner from '../components/home/HeroBanner';
import TrustBar from '../components/home/TrustBar';
import ProductSection from '../components/home/ProductSection';
import WhySection from '../components/home/WhySection';
import FaqSection from '../components/home/FaqSection';
import Footer from '../components/home/Footer';
import type { Product } from '../components/home/ProductCard';
import type { AccountSection } from '../components/Account/AccountSidebar';

// ─── Product data — images stored locally in /public/Images/products ─────────
const TRENDING: Product[] = [
  {
    id: 1,
    title: 'Life Extension, NAD+ Cell Regenerator, 100 mg, 30 Capsules',
    rating: 4.7,
    price: '₹1,750',
    originalPrice: '₹2,350',
    image: '/Images/products/product-1.png',
  },
  {
    id: 2,
    title: 'Everyone, 2 in 1 Lotion, Unscented, 32 fl oz (946 ml)',
    rating: 4.7,
    price: '₹3,200',
    originalPrice: '₹4,000',
    image: '/Images/products/product-2.png',
  },
  {
    id: 3,
    title: 'Medicube, PDRN Pink Peptide Serum, 1.01 fl oz (30 ml)',
    rating: 4.7,
    price: '₹2,100',
    originalPrice: '₹2,900',
    image: '/Images/products/product-3.png',
  },
  {
    id: 4,
    title: 'Forest Leaf, Quercetin Bromelain + Stinging Nettle, 120 Capsules',
    rating: 4.7,
    price: '₹1,900',
    originalPrice: '₹2,450',
    image: '/Images/products/product-4.png',
  },
  {
    id: 5,
    title: 'NutriGold, Vitamin C, 1000 mg, 240 Veggie Capsules',
    rating: 4.7,
    price: '₹2,600',
    originalPrice: '₹3,100',
    image: '/Images/products/product-5.png',
  },
  {
    id: 6,
    title: 'Solgar, Zinc Picolinate, 22 mg, 100 Tablets',
    rating: 4.7,
    price: '₹2,300',
    originalPrice: '₹3,000',
    image: '/Images/products/product-6.png',
  },
  {
    id: 7,
    title: "Doctor's Best, High Absorption Magnesium, 120 Tablets",
    rating: 4.7,
    price: '₹1,850',
    originalPrice: '₹2,600',
    image: '/Images/products/product-1.png',
  },
  {
    id: 8,
    title: 'California Gold Nutrition, Sport, Pure Creatine Monohydrate, 1 kg',
    rating: 4.7,
    price: '₹2,750',
    originalPrice: '₹3,300',
    image: '/Images/products/product-2.png',
  },
  {
    id: 9,
    title: 'California Gold Nutrition, CollagenUP®, Hydrolysed Marine Collagen',
    rating: 4.7,
    price: '₹2,000',
    originalPrice: '₹2,700',
    image: '/Images/products/product-3.png',
  },
  {
    id: 10,
    title: 'Garden of Life, Vitamin D3, 5000 IU, 180 Softgels',
    rating: 4.8,
    price: '₹2,150',
    originalPrice: '₹2,800',
    image: '/Images/products/product-4.png',
  },
];


// Rotate the same 9 products across sections (shifted for variety)
const makeSection = (offset: number): Product[] =>
  TRENDING.map((p, i) => ({
    ...p,
    id: offset * 10 + i + 1,
  }));

const SECTIONS = [
  { title: 'Trending this week',    products: TRENDING },
  { title: 'Customer Favourites',   products: makeSection(1) },
  { title: 'New Arrivals',          products: makeSection(2) },
  { title: 'Vitamins & Supplements',products: makeSection(3) },
  { title: 'Beauty & Skincare',     products: makeSection(4) },
];

interface HomePageProps {
  onProductClick?: (product: Product) => void;
  onCategoryNav?: (categoryId: string) => void;
  onAccountClick?: (anchor: HTMLElement) => void;
  onAccountNavigate?: (section: AccountSection) => void;
  onLogoClick?: () => void;
}

export default function HomePage({ onProductClick, onCategoryNav, onAccountClick, onAccountNavigate, onLogoClick }: HomePageProps) {
  return (
    <main>
      <AnnouncementBar />
      <Header onCategoryNav={onCategoryNav} onAccountClick={onAccountClick} onAccountNavigate={onAccountNavigate} onLogoClick={onLogoClick} />
      <HeroBanner />
      {/* Feature highlights first, then trending, then remaining sections */}
      <TrustBar />
      <ProductSection title={SECTIONS[0].title} products={SECTIONS[0].products} onProductClick={onProductClick} />
      {SECTIONS.slice(1).map((section) => (
        <ProductSection
          key={section.title}
          title={section.title}
          products={section.products}
          onProductClick={onProductClick}
        />
      ))}
      <WhySection />
      <FaqSection />
      <Footer />
    </main>
  );
}
