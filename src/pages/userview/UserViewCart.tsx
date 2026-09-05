import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Download, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { exportCartSummaryPDF } from '../../services/pdfExporter';
import { Grade } from '../../types';

export const UserViewCart: React.FC = () => {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useAppStore();
  const navigate = useNavigate();

  const totalCartQty = cart.reduce((acc, item) => acc + item.totalQuantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price || 0) * item.totalQuantity, 0);

  const gradesList: Grade[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-8 pb-12">
      {/* Requirement #15: Clean Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-luxe-muted block">YOUR CART</span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">{totalCartQty} selected units ({cart.length} lines)</h1>
        </div>

        {cart.length > 0 && (
          <div className="flex items-center gap-3">
            <button onClick={() => exportCartSummaryPDF(cart)} className="h-9 px-3.5 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-luxe-muted" />
              <span>Export PDF Manifest</span>
            </button>
            <button onClick={clearCart} className="h-9 px-3.5 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors">
              Clear Cart
            </button>
          </div>
        )}
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Items Grouped by Grade (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {gradesList.map((grade) => {
              const groupItems = cart.filter((i) => i.grade === grade);
              if (groupItems.length === 0) return null;

              return (
                <div key={grade} className="space-y-4">
                  <div className="border-b border-luxe-border pb-2 flex justify-between items-baseline">
                    <h3 className="font-playfair text-lg font-bold text-luxe-text">GRADE {grade}</h3>
                    <span className="text-xs font-mono text-luxe-muted">{groupItems.length} Products</span>
                  </div>

                  <div className="divide-y divide-luxe-border">
                    {groupItems.map((item) => (
                      <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-14 h-18 rounded object-cover border border-luxe-border shrink-0 bg-luxe-surface"
                              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                          ) : (
                            <div className="w-14 h-18 rounded border border-luxe-border shrink-0 bg-gradient-to-b from-luxe-surface to-luxe-bg flex flex-col items-center justify-center p-1 text-center select-none">
                              <span className="font-serif text-xs font-bold text-luxe-border/80">LUXÉ</span>
                              <span className="text-[8px] uppercase font-bold text-luxe-muted">{item.grade}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-bold text-luxe-muted uppercase">Grade {item.grade} • {item.product.category}</span>
                            <h4 className="font-playfair text-base font-bold text-luxe-text">{item.product.name}</h4>
                            <p className="text-xs font-mono text-luxe-text">${item.product.price?.toLocaleString()} / unit</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {Object.entries(item.sizes).map(([sz, qty]) => (
                            <span key={sz} className="px-2 py-0.5 rounded bg-luxe-surface border border-luxe-border text-xs font-mono">
                              {sz}: <strong>{qty}</strong>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="font-mono text-xs font-bold text-luxe-text">${((item.product.price || 0) * item.totalQuantity).toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-rose-600 hover:text-rose-800">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Summary Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 border-t lg:border-t-0 lg:border-l border-luxe-border lg:pl-8 pt-6 lg:pt-0">
            <div className="space-y-4">
              <h3 className="font-playfair text-xl font-bold text-luxe-text border-b border-luxe-border pb-3">Order Summary</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-luxe-muted">
                  <span>Line Items</span>
                  <span className="font-bold font-mono text-luxe-text">{cart.length}</span>
                </div>
                <div className="flex justify-between text-luxe-muted">
                  <span>Apparel Units</span>
                  <span className="font-bold font-mono text-luxe-text">{totalCartQty} Units</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-luxe-text pt-3 border-t border-luxe-border">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/admin/user-view/ratios/new')}
                className="w-full py-3 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center justify-center gap-2"
              >
                <span>Build Size Ratio Proportions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
          <p className="text-xs text-luxe-muted">Your merchandising cart is currently empty.</p>
          <button onClick={() => navigate('/admin/user-view/catalogue')} className="px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors">
            Explore Catalogue →
          </button>
        </div>
      )}
    </div>
  );
};
