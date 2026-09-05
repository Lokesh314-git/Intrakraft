import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, SlidersHorizontal, Heart, Star, CheckCircle2, Shield } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatCurrency } from '../../utils/formatters';
import { ProductGallery } from '../../components/userview/ProductGallery';
import { ReviewSection } from '../../components/userview/ReviewSection';
import { QuestionSection } from '../../components/userview/QuestionSection';
import { UserProductCard } from '../../components/userview/UserProductCard';

export const UserViewProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, settings, wishlist, toggleWishlist, addToCart, addRecentlyViewed, reviews } = useAppStore();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'questions'>('details');

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm font-semibold text-luxe-text">Product not found</p>
        <button onClick={() => navigate('/admin/user-view/catalogue')} className="px-4 py-2 bg-luxe-dark text-luxe-bg rounded text-xs">
          Return to Catalogue
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '4.9';

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.grade === product.grade))
    .slice(0, 4);

  const handleSizeQtyChange = (size: string, qty: number) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [size]: Math.max(0, qty),
    }));
  };

  const totalQty = Object.values(selectedSizes).reduce((acc, q) => acc + (q || 0), 0);

  const handleAddToCart = () => {
    if (totalQty <= 0) {
      // If no size qty selected yet, pick 1 of first size
      const firstSize = product.sizes[0] || 'S';
      addToCart(product, { [firstSize]: 1 });
    } else {
      addToCart(product, selectedSizes);
    }
  };

  const images = product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="space-y-12 pb-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-luxe-muted hover:text-luxe-text transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Catalogue</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery images={images} productName={product.name} />
        </div>

        {/* Right Product Specs & Purchase Engine */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3 border-b border-luxe-border pb-5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-luxe-dark text-luxe-bg">
                Grade {product.grade} • {product.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold font-mono">
                <Star className="w-4 h-4 fill-current" />
                <span>{avgRating}</span>
                <span className="text-luxe-muted font-normal">({productReviews.length || 12} reviews)</span>
              </div>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-luxe-text">{product.name}</h1>
            <p className="font-mono text-2xl font-bold text-luxe-text">
              {formatCurrency(product.price || 390, settings?.general?.currency)}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-luxe-muted leading-relaxed">
            {product.description || 'Masterpiece couture apparel tailored from luxury fabrics. Configured for Grade-wise size ratio breakdown and bulk merchandising.'}
          </p>

          {/* Product Attribute Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-luxe-surface p-3.5 rounded border border-luxe-border">
            <div>
              <span className="text-[9px] uppercase font-bold text-luxe-muted block">BRICK</span>
              <span className="font-semibold text-luxe-text">{product.brick}</span>
            </div>
            {product.neck && (
              <div>
                <span className="text-[9px] uppercase font-bold text-luxe-muted block">NECKLINE</span>
                <span className="font-semibold text-luxe-text">{product.neck}</span>
              </div>
            )}
            {product.sleeve && (
              <div>
                <span className="text-[9px] uppercase font-bold text-luxe-muted block">SLEEVE</span>
                <span className="font-semibold text-luxe-text">{product.sleeve}</span>
              </div>
            )}
          </div>

          {/* Size Quantity Matrix */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted">
                SELECT QUANTITY PER SIZE
              </span>
              <span className="text-xs font-mono font-bold text-luxe-text">
                Total: {totalQty} units
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {product.sizes.map((sz) => (
                <div key={sz} className="p-2 border border-luxe-border rounded bg-luxe-surface text-center space-y-1.5 shadow-subtle">
                  <span className="text-xs font-mono font-bold text-luxe-text block">{sz}</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleSizeQtyChange(sz, (selectedSizes[sz] || 0) - 1)}
                      className="w-6 h-6 rounded bg-luxe-bg border border-luxe-border text-xs font-bold text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold w-4">{selectedSizes[sz] || 0}</span>
                    <button
                      onClick={() => handleSizeQtyChange(sz, (selectedSizes[sz] || 0) + 1)}
                      className="w-6 h-6 rounded bg-luxe-bg border border-luxe-border text-xs font-bold text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-luxe-border">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 rounded font-semibold text-xs bg-luxe-dark text-luxe-bg hover:bg-black transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Grade {product.grade} Cart ({totalQty || 1} units)</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded border transition-colors ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-luxe-border text-luxe-muted hover:text-luxe-text'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => navigate('/admin/user-view/ratios/new')}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded font-semibold text-xs border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-luxe-muted" />
              <span>Configure Grade {product.grade} Size Allocation Ratio →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Reviews, Q&A */}
      <div className="space-y-6 pt-8 border-t border-luxe-border">
        <div className="flex border-b border-luxe-border gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 transition-colors ${
              activeTab === 'details' ? 'border-b-2 border-luxe-dark text-luxe-text' : 'text-luxe-muted hover:text-luxe-text'
            }`}
          >
            Product Specs
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews' ? 'border-b-2 border-luxe-dark text-luxe-text' : 'text-luxe-muted hover:text-luxe-text'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="px-1.5 py-0.2 rounded-full bg-luxe-bg border border-luxe-border text-[10px]">
              {productReviews.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 transition-colors ${
              activeTab === 'questions' ? 'border-b-2 border-luxe-dark text-luxe-text' : 'text-luxe-muted hover:text-luxe-text'
            }`}
          >
            Questions & Answers
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-luxe-muted">
            <div className="space-y-3 bg-luxe-surface p-6 rounded border border-luxe-border">
              <h4 className="font-bold text-luxe-text uppercase text-[10px] tracking-widest">Material & Care</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>Primary Composition: Premium Italian Mulberry Silk & Organza Blend</li>
                <li>Embroidery: Hand-stitched metallic thread detailing</li>
                <li>Care Instructions: Dry clean only; steam iron on low setting</li>
                <li>Ingestion Source: Catalogue AW2026 Master Feed</li>
              </ul>
            </div>
            <div className="space-y-3 bg-luxe-surface p-6 rounded border border-luxe-border">
              <h4 className="font-bold text-luxe-text uppercase text-[10px] tracking-widest">Merchandising Allocation Specs</h4>
              <ul className="space-y-2 list-disc list-inside">
                <li>Assigned Grade: Grade {product.grade} (Couture Matrix)</li>
                <li>Brick Alignment: {product.brick}</li>
                <li>Size Range: {product.sizes.join(', ')}</li>
                <li>Local Asset ID: {product.imageId || product.id}</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && <ReviewSection productId={product.id} />}
        {activeTab === 'questions' && <QuestionSection productId={product.id} />}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-luxe-border">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">CURATED RECOMMENDATIONS</span>
            <h2 className="font-playfair text-2xl font-bold text-luxe-text">You May Also Like</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {relatedProducts.map((p) => (
              <UserProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
