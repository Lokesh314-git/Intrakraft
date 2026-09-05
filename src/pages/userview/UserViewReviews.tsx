import React from 'react';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewReviews: React.FC = () => {
  const { reviews, products, voteHelpful } = useAppStore();

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-luxe-border pb-6 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
          COMMERCE FEEDBACK
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">Customer Reviews Directory</h1>
        <p className="text-xs text-luxe-muted">
          Browse verified buyer & merchandiser product feedback across all catalogue items.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-8">
            <p className="text-xs text-luxe-muted">No reviews submitted yet.</p>
          </div>
        ) : (
          reviews.map((rev) => {
            const product = products.find((p) => p.id === rev.productId);
            return (
              <div key={rev.id} className="p-6 rounded border border-luxe-border bg-luxe-surface space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-luxe-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    {product?.imageUrl && (
                      <img src={product.imageUrl} alt="" className="w-10 h-12 object-cover rounded border border-luxe-border" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-luxe-text">{product?.name || 'Product'}</h4>
                      <p className="text-[10px] text-luxe-muted">Grade {product?.grade} • Reviewed by {rev.userName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-luxe-border'}`} />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-luxe-text">{rev.title}</h4>
                  <p className="text-xs text-luxe-muted leading-relaxed mt-1">{rev.comment}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-luxe-muted pt-2 border-t border-luxe-border/40">
                  <button onClick={() => voteHelpful(rev.id)} className="flex items-center gap-1 hover:text-luxe-text">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                  <span className="font-mono text-[10px]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
