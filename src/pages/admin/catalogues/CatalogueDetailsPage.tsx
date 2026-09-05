import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Package, Layers, ArrowLeft, Trash2, Upload, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { EmptyState } from '../../../components/EmptyState';

export const CatalogueDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { catalogues, products, deleteCatalogue } = useAppStore();
  const navigate = useNavigate();

  const catalogue = catalogues.find((c) => c.id === id) || catalogues[0];

  if (!catalogue) {
    return <EmptyState title="Catalogue Not Found" description="The requested catalogue does not exist." actionText="Back to Library" actionLink="/admin/catalogues" />;
  }

  const catProducts = products.filter((p) => p.catalogueId === catalogue.id || !p.catalogueId);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete catalogue "${catalogue.name}"?`)) {
      deleteCatalogue(catalogue.id);
      navigate('/admin/catalogues');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/catalogues')} className="p-2 rounded-xl bg-luxe-surface border border-luxe-border text-luxe-muted hover:text-luxe-ivory">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-gold">Catalogue Details</span>
            <h1 className="font-playfair text-2xl font-bold text-luxe-ivory">{catalogue.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-500/40 text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Catalogue</span>
          </button>
          <button onClick={() => navigate('/admin/products')} className="px-4 py-2 rounded-xl text-xs font-bold bg-luxe-gold text-luxe-black shadow-gold-glow">
            View Products Directory →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-6 space-y-4 shadow-glass">
            <h3 className="font-playfair text-lg font-bold text-luxe-ivory border-b border-luxe-border/60 pb-3">
              Catalogue Metadata Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-luxe-muted block">File Name</span>
                <span className="font-bold text-luxe-ivory font-mono">{catalogue.fileName}</span>
              </div>
              <div>
                <span className="text-luxe-muted block">Uploaded By</span>
                <span className="font-bold text-luxe-gold">{catalogue.uploadedBy}</span>
              </div>
              <div>
                <span className="text-luxe-muted block">Upload Date</span>
                <span className="font-bold text-luxe-ivory">{new Date(catalogue.uploadDate).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-luxe-muted block">Ingestion Status</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {catalogue.status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-luxe-card border border-luxe-border/80 p-6 space-y-4 shadow-glass">
            <h3 className="font-playfair text-lg font-bold text-luxe-ivory border-b border-luxe-border/60 pb-3">
              Dynamic Sizes Extracted ({catalogue.detectedSizes.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {catalogue.detectedSizes.map((sz) => (
                <span key={sz} className="px-3 py-1 rounded-xl text-xs font-bold bg-luxe-gold/15 text-luxe-gold border border-luxe-gold/30">
                  {sz}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-b from-luxe-card to-luxe-dark border border-luxe-borderGold/40 p-6 space-y-4 shadow-gold-glow">
            <h3 className="font-playfair text-base font-bold text-luxe-ivory">
              Grade Distribution
            </h3>
            <div className="space-y-2 text-xs">
              {['A', 'B', 'C', 'D'].map((g) => (
                <div key={g} className="flex justify-between items-center p-2 rounded-xl bg-luxe-surface">
                  <span className="font-bold text-luxe-gold">Grade {g}</span>
                  <span className="font-bold text-luxe-ivory">{catProducts.filter(p => p.grade === g).length} Items</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
