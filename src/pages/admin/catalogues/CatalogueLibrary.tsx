import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Download, Trash2 } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { downloadSampleCatalogueExcel } from '../../../services/excelParser';

export const CatalogueLibrary: React.FC = () => {
  const { catalogues, deleteCatalogue } = useAppStore();
  const navigate = useNavigate();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" and all its associated products?`)) {
      deleteCatalogue(id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-luxe-muted block">
            CATALOGUE MANAGEMENT
          </span>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            Master Catalogue Library
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={downloadSampleCatalogueExcel}
            className="h-9 px-3.5 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-luxe-muted" />
            <span>Sample Excel</span>
          </button>
          <button
            onClick={() => navigate('/admin/catalogues/upload')}
            className="h-9 px-4 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Catalogue</span>
          </button>
        </div>
      </div>

      {catalogues.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface/40 p-8 space-y-3">
          <p className="text-sm font-semibold text-luxe-text">No catalogues uploaded yet</p>
          <p className="text-xs text-luxe-muted max-w-sm mx-auto">
            Upload an Excel catalogue file (.xlsx or .xls) to populate your master catalogue library.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/admin/catalogues/upload')}
              className="px-4 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors"
            >
              Upload First Catalogue
            </button>
            <button
              onClick={downloadSampleCatalogueExcel}
              className="px-4 py-2 rounded text-xs font-medium border border-luxe-border text-luxe-text hover:bg-luxe-surface transition-colors"
            >
              Download Sample Excel Template
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-luxe-border rounded overflow-x-auto bg-luxe-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-luxe-bg border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Catalogue Name</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Grades Breakdown</th>
                <th className="py-3 px-4">Sizes Extracted</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxe-border/80 font-sans">
              {catalogues.map((cat) => (
                <tr key={cat.id} className="hover:bg-luxe-bg/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-luxe-text">{cat.name}</td>
                  <td className="py-3.5 px-4 text-luxe-muted font-mono text-[11px]">{cat.fileName}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-luxe-text">{cat.totalProducts}</td>
                  <td className="py-3.5 px-4 text-luxe-muted font-mono text-[11px]">
                    A: {cat.gradesCount?.A || 0} | B: {cat.gradesCount?.B || 0} | C: {cat.gradesCount?.C || 0}
                  </td>
                  <td className="py-3.5 px-4 text-luxe-muted">{cat.detectedSizes.slice(0, 4).join(', ')}...</td>
                  <td className="py-3.5 px-4 text-luxe-text">{cat.uploadedBy}</td>
                  <td className="py-3.5 px-4 text-luxe-muted font-mono">{new Date(cat.uploadDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      {cat.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => navigate(`/admin/catalogues/${cat.id}`)}
                        className="text-xs font-semibold text-luxe-text hover:underline"
                      >
                        View →
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        title="Delete Catalogue"
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
