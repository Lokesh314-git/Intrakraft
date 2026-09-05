import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Download, Plus, Minus, Layers, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { exportCartSummaryPDF } from '../services/pdfExporter';
import { Grade } from '../types';

interface CartProps {
  onNavigate: (page: string) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useAppStore();

  const totalCartQty = cart.reduce((acc, item) => acc + item.totalQuantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price || 0) * item.totalQuantity, 0);

  // Group cart items strictly by Grade A, B, C, D
  const gradeGroups: { grade: Grade; title: string; color: string; bg: string }[] = [
    { grade: 'A', title: 'Grade A Cart Items', color: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-950/10' },
    { grade: 'B', title: 'Grade B Cart Items', color: 'text-luxe-gold', bg: 'border-luxe-gold/30 bg-luxe-gold/5' },
    { grade: 'C', title: 'Grade C Cart Items', color: 'text-sky-400', bg: 'border-sky-500/30 bg-sky-950/10' },
    { grade: 'D', title: 'Grade D Cart Items', color: 'text-purple-400', bg: 'border-purple-500/30 bg-purple-950/10' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-luxe-gold/15 text-luxe-gold border border-luxe-gold/30">
              Assignment Requirement #2
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-luxe-ivory">
            Grade-Wise Cart Studio
          </h1>
          <p className="text-xs text-luxe-muted mt-1">
            Cart items strictly grouped by Grade A, Grade B, Grade C & Grade D
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cart.length > 0 && (
            <>
              <button
                onClick={() => exportCartSummaryPDF(cart)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-luxe-surface border border-luxe-borderGold/40 text-luxe-gold hover:bg-luxe-gold/10 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export Cart PDF</span>
              </button>

              <button
                onClick={clearCart}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-400 hover:bg-rose-950/20 border border-rose-500/20 transition-all"
              >
                Clear Cart
              </button>
            </>
          )}
        </div>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grouped Cart Items Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {gradeGroups.map((group) => {
              const groupItems = cart.filter((item) => item.grade === group.grade);
              if (groupItems.length === 0) return null;

              return (
                <div
                  key={group.grade}
                  className={`rounded-3xl border p-6 sm:p-8 space-y-4 shadow-glass ${group.bg}`}
                >
                  <div className="flex items-center justify-between border-b border-luxe-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className={`w-5 h-5 ${group.color}`} />
                      <h3 className={`font-playfair text-xl font-bold ${group.color}`}>
                        {group.title}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-luxe-ivory px-3 py-1 rounded-full bg-luxe-black/60 border border-luxe-border">
                      {groupItems.length} Products
                    </span>
                  </div>

                  <div className="space-y-4">
                    {groupItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-luxe-card border border-luxe-border/80 gap-4"
                      >
                        {/* Product Info */}
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.imageUrl || ' '}
                            alt={item.product.name}
                            className="w-16 h-20 rounded-xl object-cover border border-luxe-border shrink-0 bg-luxe-surface"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-luxe-gold">
                                Grade {item.grade}
                              </span>
                              <span className="text-[10px] text-luxe-muted">• {item.product.category}</span>
                            </div>
                            <h4 className="font-playfair text-base font-bold text-luxe-ivory">
                              {item.product.name}
                            </h4>
                            <p className="text-xs text-luxe-gold font-bold mt-0.5">
                              ${item.product.price?.toLocaleString()} / unit
                            </p>
                          </div>
                        </div>

                        {/* Size Quantities breakdown matrix */}
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase font-bold text-luxe-muted tracking-wider block">
                            Size Breakdown Matrix
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {Object.entries(item.sizes).map(([sz, qty]) => (
                              <div key={sz} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-luxe-surface border border-luxe-border text-xs">
                                <span className="font-bold text-luxe-ivory">{sz}:</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => updateCartItemQuantity(item.id, sz, qty - 1)}
                                    className="w-4 h-4 rounded flex items-center justify-center bg-luxe-dark text-luxe-muted hover:text-luxe-ivory"
                                  >
                                    -
                                  </button>
                                  <span className="font-bold text-luxe-gold">{qty}</span>
                                  <button
                                    onClick={() => updateCartItemQuantity(item.id, sz, qty + 1)}
                                    className="w-4 h-4 rounded flex items-center justify-center bg-luxe-dark text-luxe-muted hover:text-luxe-ivory"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Subtotal & Action */}
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-luxe-border/60">
                          <div className="text-right">
                            <span className="text-[10px] text-luxe-muted uppercase tracking-wider block">Subtotal</span>
                            <span className="text-base font-bold text-luxe-ivory">
                              ${((item.product.price || 0) * item.totalQuantity).toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl transition-colors"
                            title="Remove from Cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Side Panel */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-luxe-card border border-luxe-borderGold/40 p-6 sm:p-8 space-y-6 shadow-gold-glow">
              <h3 className="font-playfair text-xl font-bold text-luxe-ivory border-b border-luxe-border/60 pb-3">
                Order Manifest Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-luxe-muted">
                  <span>Total Line Items</span>
                  <span className="font-bold text-luxe-ivory">{cart.length}</span>
                </div>
                <div className="flex justify-between text-luxe-muted">
                  <span>Total Apparel Units</span>
                  <span className="font-bold text-luxe-gold">{totalCartQty} Units</span>
                </div>
                <div className="flex justify-between text-luxe-muted">
                  <span>Grade Classification</span>
                  <span className="font-bold text-emerald-400">Strict A/B/C/D</span>
                </div>
              </div>

              <div className="pt-4 border-t border-luxe-border/60 flex items-center justify-between">
                <span className="text-sm font-bold text-luxe-ivory">Estimated Total</span>
                <span className="font-playfair text-2xl font-bold text-luxe-gold">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => onNavigate('ratios')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-luxe-gold to-luxe-goldDark text-luxe-black hover:brightness-110 transition-all shadow-gold-glow"
              >
                <span>Proceed to Size Ratio Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-12 text-center space-y-4 max-w-md mx-auto">
          <ShoppingCart className="w-12 h-12 text-luxe-gold/50 mx-auto" />
          <h3 className="font-playfair text-xl font-bold text-luxe-ivory">
            Your Merchandising Cart is Empty
          </h3>
          <p className="text-xs text-luxe-muted">
            Add products from the directory to organize them by Grade A, Grade B, Grade C & Grade D.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold bg-luxe-gold text-luxe-black hover:brightness-110 transition-all shadow-gold-glow"
          >
            Browse Products Directory →
          </button>
        </div>
      )}
    </div>
  );
};
