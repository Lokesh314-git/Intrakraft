import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ShoppingBag, SlidersHorizontal, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewOrders: React.FC = () => {
  const { selectionsHistory, cart, saveSelection } = useAppStore();
  const navigate = useNavigate();

  const handleSaveCurrentCart = () => {
    if (cart.length === 0) return;
    saveSelection(`Selection #${Math.floor(1000 + Math.random() * 9000)}`, cart);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
            MERCHANDISING ARCHIVE
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">Selection History</h1>
          <p className="text-xs text-luxe-muted mt-0.5">
            Archived cart groupings and grade-wise size allocation orders.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={handleSaveCurrentCart}
            className="px-4 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Save Current Cart to History</span>
          </button>
        )}
      </div>

      {selectionsHistory.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-8 space-y-4">
          <Clock className="w-10 h-10 text-luxe-muted mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-luxe-text">No Selection History Yet</h3>
            <p className="text-xs text-luxe-muted">
              Add products to your cart and configure size ratio rules to save selections here.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/user-view/catalogue')}
            className="px-6 py-2.5 bg-luxe-dark text-luxe-bg rounded text-xs font-semibold hover:bg-black transition-colors"
          >
            Explore Product Catalogue
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {selectionsHistory.map((record) => (
            <div key={record.id} className="border border-luxe-border rounded bg-luxe-surface p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-luxe-border pb-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-luxe-text">{record.title}</h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Ratio Configured
                    </span>
                  </div>
                  <p className="text-[10px] text-luxe-muted font-mono mt-0.5">
                    Saved on {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs font-bold text-luxe-text">
                  <span>{record.itemsCount} Styles</span>
                  <span>•</span>
                  <span>{record.totalQty} Total Units</span>
                </div>
              </div>

              {/* Product Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {record.items.map((item) => (
                  <div key={item.id} className="p-3 rounded border border-luxe-border/70 bg-luxe-bg flex items-center gap-3 text-xs">
                    <img src={item.product.imageUrl} alt="" className="w-10 h-12 object-cover rounded border border-luxe-border" />
                    <div>
                      <span className="text-[9px] font-bold uppercase bg-luxe-dark text-luxe-bg px-1.5 py-0.2 rounded">
                        Grade {item.grade}
                      </span>
                      <p className="font-bold text-luxe-text line-clamp-1 mt-0.5">{item.product.name}</p>
                      <p className="text-[10px] text-luxe-muted font-mono">{item.totalQuantity} units</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => navigate('/admin/user-view/ratios')}
                  className="px-4 py-1.5 rounded text-xs font-semibold border border-luxe-border text-luxe-text hover:bg-luxe-bg transition-colors flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Inspect Ratio Rule Matrix</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
