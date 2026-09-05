import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { EmptyState } from '../../../components/EmptyState';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, deleteProduct } = useAppStore();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id) || products[0];

  if (!product) {
    return <EmptyState title="Product Not Found" description="The requested product record does not exist in the catalogue database." actionText="Back to Catalogue" actionLink="/admin/products" />;
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      deleteProduct(product.id);
      navigate('/admin/products');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-luxe-border pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 rounded border border-luxe-border bg-luxe-surface text-luxe-muted hover:text-luxe-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted block">
              PRODUCT SPECIFICATION
            </span>
            <h1 className="font-playfair text-3xl font-bold text-luxe-text">
              {product.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded border border-luxe-border text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Product Image */}
        <div className="lg:col-span-5 rounded border border-luxe-border bg-luxe-surface overflow-hidden aspect-[3/4]">
          <img
            src={product.imageUrl || ' '}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-luxe-border rounded bg-luxe-surface p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-luxe-border pb-4">
              <span className="px-2.5 py-1 rounded bg-luxe-bg border border-luxe-border text-xs font-bold text-luxe-text uppercase tracking-wider">
                Grade {product.grade}
              </span>
              <span className="font-mono text-2xl font-bold text-luxe-text">
                ${product.price?.toLocaleString()}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
                Hierarchy Classification
              </span>
              <p className="text-xs font-semibold text-luxe-text">
                {product.brick} &gt; {product.category}
              </p>
            </div>

            {product.description && (
              <div className="space-y-1 pt-2 border-t border-luxe-border">
                <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
                  Product Description
                </span>
                <p className="text-xs text-luxe-muted leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          <div className="border border-luxe-border rounded bg-luxe-surface p-6 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
              Available Dynamic Sizes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((sz) => (
                <span key={sz} className="px-3 py-1 rounded text-xs font-mono font-semibold bg-luxe-bg border border-luxe-border text-luxe-text">
                  {sz}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
