import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Download, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw, Layers, Sparkles } from 'lucide-react';
import { downloadSampleCatalogueExcel } from '../services/excelParser';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { Product } from '../types';

interface UploadCatalogueProps {
  onNavigate: (page: string) => void;
}

export const UploadCatalogue: React.FC<UploadCatalogueProps> = ({ onNavigate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedPreview, setParsedPreview] = useState<{
    catalogueName: string;
    productCount: number;
    detectedSizes: string[];
    products: Product[];
  } | null>(null);

  const { uploadCatalogueData, addToast, user } = useAppStore();

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      addToast('Invalid File Type', 'Please upload a valid Excel file (.xlsx or .xls).', 'error');
      return;
    }

    setUploading(true);
    setProgress(30);

    try {
      setProgress(60);
      // Backend parses the Excel file and extracts products, grades, and sizes
      const result = await api.uploadCatalogue(file, undefined, user?.name);
      setProgress(100);

      setParsedPreview({
        catalogueName: result.catalogue.name,
        productCount: result.products.length,
        detectedSizes: result.detectedSizes,
        products: result.products,
      });

      // Store catalogue in app store
      uploadCatalogueData(result.catalogue, result.products, result.detectedSizes);

      setTimeout(() => {
        setUploading(false);
      }, 500);
    } catch (err: any) {
      addToast('Backend Ingestion Error', err.message || 'Failed to process Excel file on server.', 'error');
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-luxe-gold/15 text-luxe-gold border border-luxe-gold/30">
              Assignment Requirement #1
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-luxe-ivory">
            Catalogue Upload & Dynamic Size Parser
          </h1>
          <p className="text-xs text-luxe-muted mt-1">
            Upload Excel files (.xlsx, .xls). Products, attributes, and sizes are dynamically parsed into Firestore.
          </p>
        </div>

        {/* Download Sample Excel Button */}
        <button
          onClick={downloadSampleCatalogueExcel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-luxe-surface border border-luxe-borderGold/40 text-luxe-gold hover:bg-luxe-gold/10 transition-all shadow-sm shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Sample Excel Template</span>
        </button>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-luxe-card/60 backdrop-blur-xl ${dragActive
            ? 'border-luxe-gold bg-luxe-gold/10 scale-[1.01]'
            : 'border-luxe-borderGold/40 hover:border-luxe-gold/70'
          }`}
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />

        <div className="space-y-4 max-w-md mx-auto pointer-events-none">
          <div className="w-16 h-16 rounded-3xl bg-luxe-gold/10 border border-luxe-gold/30 flex items-center justify-center mx-auto text-luxe-gold shadow-gold-glow">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-playfair text-xl font-bold text-luxe-ivory">
              Drag & Drop your Excel Catalogue
            </h3>
            <p className="text-xs text-luxe-muted mt-1 leading-relaxed">
              Supports <strong className="text-luxe-ivory">.xlsx</strong> and <strong className="text-luxe-ivory">.xls</strong> files containing Product Name, Grade (A/B/C/D), Brick, Category, and Size columns.
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold bg-gradient-to-r from-luxe-gold to-luxe-goldDark text-luxe-black shadow-gold-glow">
              Browse Excel File from Computer
            </span>
          </div>
        </div>

        {/* Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-luxe-black/90 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center p-6 z-30">
            <RefreshCw className="w-10 h-10 text-luxe-gold animate-spin mb-4" />
            <h4 className="font-playfair text-lg font-bold text-luxe-ivory">
              Parsing Excel Catalogue & Detecting Sizes...
            </h4>
            <div className="w-64 h-2 bg-luxe-surface rounded-full mt-4 overflow-hidden border border-luxe-border">
              <div
                className="h-full bg-luxe-gold transition-all duration-300 shadow-gold-glow"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-luxe-muted mt-2 font-bold">{progress}%</span>
          </div>
        )}
      </div>

      {/* Dynamic Size Detection & Parsed Data Preview */}
      {parsedPreview && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-luxe-card border border-luxe-borderGold/40 p-6 sm:p-8 space-y-6 shadow-glass"
        >
          <div className="flex items-center justify-between border-b border-luxe-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-playfair text-lg font-bold text-luxe-ivory">
                  Catalogue Imported: {parsedPreview.catalogueName}
                </h3>
                <p className="text-xs text-luxe-muted mt-0.5">
                  Parsed {parsedPreview.productCount} products into Firestore & catalogue store
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('products')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-luxe-gold text-luxe-black hover:brightness-110 transition-all shadow-gold-glow"
            >
              View in Product Directory →
            </button>
          </div>

          {/* Dynamic Sizes Discovered */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxe-gold mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Dynamically Detected Sizes ({parsedPreview.detectedSizes.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {parsedPreview.detectedSizes.map((sz) => (
                <span
                  key={sz}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-luxe-gold/15 border border-luxe-gold/40 text-luxe-gold shadow-sm"
                >
                  {sz}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Product Rows Preview Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxe-gold mb-3">
              Parsed Products Preview (First 5 Items)
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-luxe-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-luxe-surface text-luxe-gold uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Brick</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Sizes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxe-border/60 bg-luxe-card">
                  {parsedPreview.products.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-luxe-surface/40 transition-colors">
                      <td className="p-3 font-semibold text-luxe-ivory">{p.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-luxe-gold/10 text-luxe-gold border border-luxe-gold/30">
                          Grade {p.grade}
                        </span>
                      </td>
                      <td className="p-3 text-luxe-muted">{p.brick}</td>
                      <td className="p-3 text-luxe-ivory/90">{p.category}</td>
                      <td className="p-3 text-luxe-muted">{p.sizes.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
