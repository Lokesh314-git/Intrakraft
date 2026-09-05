import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Check, RefreshCw, Download } from 'lucide-react';
import { parseCatalogueExcel, downloadSampleCatalogueExcel } from '../../../services/excelParser';
import { useAppStore } from '../../../store/useAppStore';
import { Product } from '../../../types';
import { api } from '../../../services/api';

export const UploadCataloguePage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<{
    catalogueName: string;
    productCount: number;
    detectedSizes: string[];
    products: Product[];
  } | null>(null);

  const { uploadCatalogueData, addToast } = useAppStore();
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      addToast('Invalid File Format', 'Please choose a valid Excel spreadsheet (.xlsx or .xls)', 'error');
      return;
    }

    setSelectedFile(file);
    setStep(2);

    setParsing(true);
    setTimeout(async () => {
      try {
        const result = await parseCatalogueExcel(file);
        setParsedData({
          catalogueName: result.catalogue.name,
          productCount: result.products.length,
          detectedSizes: result.detectedSizes,
          products: result.products,
        });
        setParsing(false);
        setStep(3);
      } catch (err: any) {
        addToast('Validation Failed', err.message, 'error');
        setParsing(false);
        setStep(1);
      }
    }, 600);
  };

  const handleImport = async () => {
    if (!parsedData || !selectedFile) return;

    setStep(5);
    try {
      const serverRes = await api.uploadCatalogue(selectedFile, parsedData.catalogueName, 'Current Merchandiser');
      uploadCatalogueData(serverRes.catalogue, serverRes.products, serverRes.detectedSizes);
    } catch {
      // Fallback local upload if server offline
      uploadCatalogueData(
        {
          id: `cat-${Date.now()}`,
          name: parsedData.catalogueName,
          fileName: selectedFile.name,
          uploadedBy: 'Current Merchandiser',
          uploadDate: new Date().toISOString(),
          totalProducts: parsedData.productCount,
          gradesCount: {
            A: parsedData.products.filter(p => p.grade === 'A').length,
            B: parsedData.products.filter(p => p.grade === 'B').length,
            C: parsedData.products.filter(p => p.grade === 'C').length,
            D: parsedData.products.filter(p => p.grade === 'D').length,
          },
          detectedSizes: parsedData.detectedSizes,
          status: 'Completed',
        },
        parsedData.products,
        parsedData.detectedSizes
      );
    }

    setTimeout(() => {
      navigate('/admin/catalogues');
    }, 400);
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-luxe-border pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-luxe-muted">UPLOAD WORKFLOW</span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">Catalogue Upload</h1>
        </div>

        <button onClick={downloadSampleCatalogueExcel} className="px-3 py-1.5 rounded text-xs border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors flex items-center gap-2">
          <Download className="w-3.5 h-3.5" />
          <span>Sample Excel Template</span>
        </button>
      </div>

      {/* Stepper */}
      <div className="flex justify-between border-b border-luxe-border pb-4 text-xs font-semibold">
        {['1. Select File', '2. Validate', '3. Preview', '4. Review', '5. Import'].map((lbl, idx) => (
          <span key={lbl} className={step === idx + 1 ? 'text-luxe-text border-b-2 border-luxe-dark pb-1' : 'text-luxe-muted'}>
            {lbl}
          </span>
        ))}
      </div>

      <div className="p-8 border border-luxe-border rounded bg-luxe-surface space-y-6">
        {step === 1 && (
          <div className="text-center space-y-4 py-8">
            <UploadCloud className="w-10 h-10 text-luxe-muted mx-auto" />
            <h3 className="font-playfair text-xl font-bold text-luxe-text">Select Excel Catalogue File</h3>
            <p className="text-xs text-luxe-muted max-w-md mx-auto">
              Supports .xlsx and .xls formats containing Product Name, Grade (A/B/C/D), Brick, Category, and Size columns.
            </p>
            <div className="relative max-w-xs mx-auto pt-2">
              <input type="file" accept=".xlsx, .xls" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <button className="w-full py-2.5 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors">
                Choose Excel File
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center py-12 space-y-3">
            <RefreshCw className="w-8 h-8 text-luxe-muted animate-spin mx-auto" />
            <p className="text-xs font-semibold text-luxe-text">Validating spreadsheet and extracting dynamic sizes...</p>
          </div>
        )}

        {step === 3 && parsedData && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-luxe-border pb-3">
              <h3 className="font-playfair text-lg font-bold text-luxe-text">Parsed: {parsedData.catalogueName}</h3>
              <span className="text-xs font-mono font-bold text-luxe-text">{parsedData.productCount} Products</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted block mb-2">
                Dynamically Detected Sizes ({parsedData.detectedSizes.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {parsedData.detectedSizes.map(sz => (
                  <span key={sz} className="px-2.5 py-1 rounded bg-luxe-bg border border-luxe-border text-xs font-mono">
                    {sz}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-luxe-border">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-xs font-medium text-luxe-muted">Cancel</button>
              <button onClick={() => setStep(4)} className="px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black">
                Proceed to Review →
              </button>
            </div>
          </div>
        )}

        {step === 4 && parsedData && (
          <div className="space-y-6">
            <h3 className="font-playfair text-lg font-bold text-luxe-text">Review Ingestion Summary</h3>
            <div className="space-y-2 text-xs border-y border-luxe-border py-4">
              <div className="flex justify-between"><span className="text-luxe-muted">Catalogue Name</span><span className="font-bold text-luxe-text">{parsedData.catalogueName}</span></div>
              <div className="flex justify-between"><span className="text-luxe-muted">Total Products</span><span className="font-bold text-luxe-text">{parsedData.productCount}</span></div>
              <div className="flex justify-between"><span className="text-luxe-muted">Sizes Extracted</span><span className="font-mono text-luxe-text">{parsedData.detectedSizes.join(', ')}</span></div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setStep(3)} className="px-4 py-2 text-xs text-luxe-muted">Back</button>
              <button onClick={handleImport} className="px-6 py-2.5 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black">
                Confirm & Import Catalogue
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-12 space-y-3">
            <RefreshCw className="w-8 h-8 text-luxe-muted animate-spin mx-auto" />
            <p className="text-xs font-semibold text-luxe-text">Importing catalogue records into Firestore...</p>
          </div>
        )}
      </div>
    </div>
  );
};
