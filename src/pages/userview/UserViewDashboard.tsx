import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserProductCard } from '../../components/userview/UserProductCard';

export const UserViewDashboard: React.FC = () => {
  const { products, catalogues, recentlyViewed } = useAppStore();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  const validCatalogueIds = React.useMemo(() => new Set(catalogues.map(c => c.id)), [catalogues]);
  const activeProducts = React.useMemo(() => {
    if (catalogues.length === 0) return [];
    return products.filter(p => p.catalogueId && validCatalogueIds.has(p.catalogueId));
  }, [catalogues, products, validCatalogueIds]);

  const recentProducts = recentlyViewed
    .map((id) => activeProducts.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const heroSlides = [
    {
      title: 'AUTUMN / WINTER 2026',
      subtitle: 'The Editorial Couture Collection',
      cta: 'Explore New Collection',
      bgUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop',
      link: '/admin/user-view/catalogue',
    },
    {
      title: 'GRADE-WISE ESSENTIALS',
      subtitle: 'Precision Size Allocation Engine Active',
      cta: 'Configure Ratios',
      bgUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop',
      link: '/admin/user-view/ratios/new',
    },
    {
      title: 'CURATED SILHOUETTES',
      subtitle: 'Master Catalogue Ingestion Complete',
      cta: 'View All Products',
      bgUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000&auto=format&fit=crop',
      link: '/admin/user-view/catalogue',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categories = [
    { name: 'Dresses', count: 18, img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600&auto=format&fit=crop' },
    { name: 'Shirts', count: 14, img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop' },
    { name: 'Tops', count: 12, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop' },
    { name: 'Shorts', count: 9, img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop' },
    { name: 'Jeans & Jeggings', count: 16, img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop' },
    { name: 'Trackpants', count: 8, img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Category Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted">
            CATEGORIES
          </span>
          <button onClick={() => navigate('/admin/user-view/catalogue')} className="text-xs font-semibold text-luxe-muted hover:text-luxe-text">
            All Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/admin/user-view/category/${encodeURIComponent(cat.name)}`)}
              className="cursor-pointer group border border-luxe-border rounded bg-luxe-surface p-3 text-center space-y-2 hover:bg-luxe-bg transition-colors"
            >
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border border-luxe-border bg-luxe-bg">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-luxe-text truncate">{cat.name}</h4>
                <p className="text-[10px] text-luxe-muted font-mono">{cat.count} styles</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative rounded overflow-hidden bg-luxe-dark text-luxe-bg h-[380px] sm:h-[460px] flex items-center shadow-dropdown">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-75"
          style={{ backgroundImage: `url('${heroSlides[currentSlide].bgUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxe-dark/90 via-luxe-dark/40 to-transparent" />

        <div className="relative z-10 p-8 sm:p-16 max-w-xl space-y-4">
          <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-luxe-bg text-luxe-dark inline-block">
            FEATURED COLLECTION
          </span>
          <h1 className="font-playfair text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-xs sm:text-sm text-luxe-bg/80 leading-relaxed font-sans">
            {heroSlides[currentSlide].subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate(heroSlides[currentSlide].link)}
              className="px-6 py-3 rounded text-xs font-bold bg-luxe-bg text-luxe-dark hover:bg-white transition-colors inline-flex items-center gap-2 shadow-subtle"
            >
              <span>{heroSlides[currentSlide].cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-luxe-bg/30 text-luxe-bg backdrop-blur-md hover:bg-luxe-bg/60 transition-colors z-20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-luxe-bg/30 text-luxe-bg backdrop-blur-md hover:bg-luxe-bg/60 transition-colors z-20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* New Arrivals Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-luxe-border pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
              COLLECTION
            </span>
            <h2 className="font-playfair text-2xl font-bold text-luxe-text">New Arrivals</h2>
          </div>
          <button
            onClick={() => navigate('/admin/user-view/catalogue')}
            className="text-xs font-semibold text-luxe-muted hover:text-luxe-text transition-colors"
          >
            View All Products →
          </button>
        </div>

        {activeProducts.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40 p-6 space-y-3">
            <p className="text-sm font-semibold text-luxe-text">Catalogue directory is empty</p>
            <p className="text-xs text-luxe-muted max-w-md mx-auto">
              Upload an Excel catalogue file from the admin portal to showcase products here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {activeProducts.slice(0, 4).map((p) => (
              <UserProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Trending & Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="border-b border-luxe-border pb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
              POPULAR SELECTION
            </span>
            <h2 className="font-playfair text-xl font-bold text-luxe-text">Trending Merchandising Lines</h2>
          </div>

          {activeProducts.length === 0 ? (
            <div className="py-8 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40">
              <p className="text-xs text-luxe-muted">No trending items available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {activeProducts.slice(4, 7).map((p) => (
                <UserProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Ratio Workbench Banner */}
        <div className="lg:col-span-4 border border-luxe-border rounded bg-luxe-surface p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-luxe-bg border border-luxe-border text-luxe-text">
              RATIO WORKBENCH
            </span>
            <h3 className="font-playfair text-2xl font-bold text-luxe-text">Grade Ratio Engine</h3>
            <p className="text-xs text-luxe-muted leading-relaxed">
              Build independent size ratio rules across Grades A, B, C & D for Brick, Category, and custom attribute combinations.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/user-view/ratios/new')}
            className="w-full py-3 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Configure Grade Ratios →</span>
          </button>
        </div>
      </div>

      {/* Recently Viewed Section (if any) */}
      {recentProducts.length > 0 && (
        <div className="space-y-6 pt-4 border-t border-luxe-border">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
                RECENTLY VIEWED
              </span>
              <h2 className="font-playfair text-2xl font-bold text-luxe-text">Your Browsing History</h2>
            </div>
            <button
              onClick={() => navigate('/admin/user-view/recently-viewed')}
              className="text-xs font-semibold text-luxe-muted hover:text-luxe-text transition-colors"
            >
              View History →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentProducts.slice(0, 6).map((p) => (
              <UserProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
