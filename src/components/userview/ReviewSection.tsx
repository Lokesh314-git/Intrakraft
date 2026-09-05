import React, { useState } from 'react';
import { Star, ThumbsUp, Plus, X } from 'lucide-react';
import { Review } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { reviews, addReview, voteHelpful } = useAppStore();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'helpful'>('recent');

  const productReviews = reviews.filter((r) => r.productId === productId);

  const sortedReviews = [...productReviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const avgRating = productReviews.length > 0
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '5.0';

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !comment) return;
    addReview({
      productId,
      rating,
      title,
      comment,
      userId: 'usr-current',
      userName: 'Current Merchandiser',
    });
    setTitle('');
    setComment('');
    setIsWriteModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Rating Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-luxe-border pb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="font-playfair text-4xl font-bold text-luxe-text block">{avgRating}</span>
            <div className="flex items-center justify-center gap-0.5 text-amber-500 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-[10px] text-luxe-muted font-mono">{productReviews.length} Verified Reviews</span>
          </div>

          {/* Rating Bars */}
          <div className="space-y-1 w-44">
            {ratingCounts.map(({ star, count }) => {
              const pct = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-[10px] font-mono text-luxe-muted">
                  <span className="w-3">{star}★</span>
                  <div className="flex-1 h-1.5 bg-luxe-bg rounded-full overflow-hidden border border-luxe-border">
                    <div className="h-full bg-luxe-dark rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Filter & Sort Bar */}
      {productReviews.length > 0 && (
        <div className="flex items-center justify-between text-xs text-luxe-muted">
          <span className="font-semibold text-luxe-text">{productReviews.length} Reviews</span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-luxe-bg border border-luxe-border rounded px-2.5 py-1 text-luxe-text focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-6">
            <p className="text-xs text-luxe-muted">No reviews yet for this product. Be the first to leave a review!</p>
          </div>
        ) : (
          sortedReviews.map((rev) => (
            <div key={rev.id} className="p-4 sm:p-6 rounded border border-luxe-border bg-luxe-surface space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-luxe-dark text-luxe-bg font-bold font-mono text-xs flex items-center justify-center">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-luxe-text">{rev.userName}</h5>
                    <span className="text-[10px] text-luxe-muted font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-luxe-border'}`} />
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-luxe-text">{rev.title}</h4>
                <p className="text-xs text-luxe-muted leading-relaxed mt-1">{rev.comment}</p>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-luxe-muted border-t border-luxe-border/60">
                <button
                  onClick={() => voteHelpful(rev.id)}
                  className="flex items-center gap-1 hover:text-luxe-text transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>

                <span className="text-[10px] uppercase font-bold text-emerald-700">Verified Purchase</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxe-dark/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-luxe-surface border border-luxe-border rounded-lg p-6 space-y-4 shadow-dropdown">
            <div className="flex items-center justify-between border-b border-luxe-border pb-3">
              <h3 className="font-playfair text-lg font-bold text-luxe-text">Write a Customer Review</h3>
              <button onClick={() => setIsWriteModalOpen(false)} className="text-luxe-muted hover:text-luxe-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-luxe-muted text-[10px] mb-1.5">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-1.5 rounded border transition-colors ${rating >= s ? 'text-amber-500 border-amber-300 bg-amber-50' : 'text-luxe-muted border-luxe-border'}`}
                    >
                      <Star className={`w-5 h-5 ${rating >= s ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-luxe-muted text-[10px] mb-1.5">Review Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exceptional Silk Quality & Fit"
                  className="w-full bg-luxe-bg border border-luxe-border rounded px-3 py-2 text-luxe-text focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-luxe-muted text-[10px] mb-1.5">Detailed Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about the fabric, sizing, grade allocation, or craftsmanship..."
                  className="w-full bg-luxe-bg border border-luxe-border rounded px-3 py-2 text-luxe-text focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
