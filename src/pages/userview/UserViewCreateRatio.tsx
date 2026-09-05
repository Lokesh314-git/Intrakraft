import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Grade, AttributeLevelType } from '../../types';
import { api } from '../../services/api';

export const UserViewCreateRatio: React.FC = () => {
  const { catalogues, detectedSizes, saveRatioConfig, addToast, user } = useAppStore();
  const navigate = useNavigate();

  const [selectedCatalogue, setSelectedCatalogue] = useState(catalogues[0]?.name || 'Master Catalogue');
  const [level, setLevel] = useState<AttributeLevelType>('Category');
  const [group, setGroup] = useState('Dresses');

  const activeSizes = detectedSizes.length > 0 ? detectedSizes : ['S', 'M', 'L', 'XL'];

  const [gradeARatios, setGradeARatios] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeSizes.forEach((s, idx) => { init[s] = idx % 2 === 0 ? 1 : 2; });
    return init;
  });
  const [gradeBRatios, setGradeBRatios] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeSizes.forEach((s, idx) => { init[s] = idx % 3 === 0 ? 2 : 1; });
    return init;
  });
  const [gradeCRatios, setGradeCRatios] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeSizes.forEach((s) => { init[s] = 1; });
    return init;
  });
  const [gradeDRatios, setGradeDRatios] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeSizes.forEach((s) => { init[s] = 1; });
    return init;
  });

  const handleRatioChange = (g: Grade, sz: string, val: number) => {
    const nextVal = Math.max(0, val);
    if (g === 'A') setGradeARatios(prev => ({ ...prev, [sz]: nextVal }));
    if (g === 'B') setGradeBRatios(prev => ({ ...prev, [sz]: nextVal }));
    if (g === 'C') setGradeCRatios(prev => ({ ...prev, [sz]: nextVal }));
    if (g === 'D') setGradeDRatios(prev => ({ ...prev, [sz]: nextVal }));
  };

  const handleSave = async () => {
    const currentUserId = user?.uid || 'usr-merchandiser';
    const configA = {
      userId: currentUserId,
      grade: 'A' as Grade,
      attributeLevel: level,
      groupKey: group,
      sizeRatios: gradeARatios,
      normalizedRatio: activeSizes.map(s => gradeARatios[s] || 1).join(' : '),
    };
    const configB = {
      userId: currentUserId,
      grade: 'B' as Grade,
      attributeLevel: level,
      groupKey: group,
      sizeRatios: gradeBRatios,
      normalizedRatio: activeSizes.map(s => gradeBRatios[s] || 1).join(' : '),
    };
    const configC = {
      userId: currentUserId,
      grade: 'C' as Grade,
      attributeLevel: level,
      groupKey: group,
      sizeRatios: gradeCRatios,
      normalizedRatio: activeSizes.map(s => gradeCRatios[s] || 1).join(' : '),
    };

    saveRatioConfig(configA);
    saveRatioConfig(configB);
    saveRatioConfig(configC);

    try {
      await Promise.all([
        api.addRatio(configA),
        api.addRatio(configB),
        api.addRatio(configC),
      ]);
    } catch {
      // Local store handles offline mode
    }

    addToast('Ratios Saved', `Saved Grade A, B, C size ratio models for ${group}`, 'success');
    navigate('/admin/user-view/saved-ratios');
  };

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-luxe-border pb-6">
        <button onClick={() => navigate('/admin/user-view/ratios')} className="p-1.5 rounded border border-luxe-border text-luxe-muted">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-luxe-muted">RATIO STUDIO WORKSPACE</span>
          <h1 className="font-playfair text-2xl font-bold text-luxe-text">Create New Configuration</h1>
        </div>
      </div>

      {/* Select Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-luxe-border pb-6">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-text mb-1">Select Catalogue</label>
          <select value={selectedCatalogue} onChange={(e) => setSelectedCatalogue(e.target.value)} className="w-full bg-luxe-surface border border-luxe-border rounded px-3 py-2 text-xs text-luxe-text">
            {catalogues.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-text mb-1">Grouping Level</label>
          <select value={level} onChange={(e) => setLevel(e.target.value as any)} className="w-full bg-luxe-surface border border-luxe-border rounded px-3 py-2 text-xs text-luxe-text">
            <option value="Brick">Brick</option>
            <option value="Category">Category</option>
            <option value="Brick + Category">Brick + Category</option>
            <option value="Brick + Neck">Brick + Neck</option>
            <option value="Brick + Sleeve">Brick + Sleeve</option>
            <option value="Custom Combination">Custom Combination</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-luxe-text mb-1">Target Group</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full bg-luxe-surface border border-luxe-border rounded px-3 py-2 text-xs text-luxe-text">
            <option value="Dresses">Dresses</option>
            <option value="Shirts">Shirts</option>
            <option value="Shorts">Shorts</option>
            <option value="Tops">Tops</option>
            <option value="Trackpants">Trackpants</option>
            <option value="Jeans & Jeggings">Jeans & Jeggings</option>
          </select>
        </div>
      </div>

      {/* Spreadsheet Ratio Table (Requirement #17) */}
      <div className="space-y-3">
        <h3 className="font-playfair text-lg font-bold text-luxe-text">Grade Ratio Allocation Matrix ({group})</h3>

        <div className="border border-luxe-border rounded overflow-x-auto bg-luxe-surface">
          <table className="w-full text-center text-xs">
            <thead className="bg-luxe-bg border-b border-luxe-border text-luxe-muted uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="p-3 text-left">Grade</th>
                {activeSizes.map((sz) => (
                  <th key={sz} className="p-3">{sz}</th>
                ))}
                <th className="p-3 text-right">Ratio Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxe-border/80 font-mono text-xs">
              {[
                { grade: 'A' as Grade, map: gradeARatios, label: 'GRADE A' },
                { grade: 'B' as Grade, map: gradeBRatios, label: 'GRADE B' },
                { grade: 'C' as Grade, map: gradeCRatios, label: 'GRADE C' },
                { grade: 'D' as Grade, map: gradeDRatios, label: 'GRADE D' },
              ].map(({ grade, map, label }) => (
                <tr key={grade} className="hover:bg-luxe-bg/60">
                  <td className="p-3 text-left font-bold font-sans text-luxe-text">{label}</td>
                  {activeSizes.map((sz) => (
                    <td key={sz} className="p-2">
                      <input
                        type="number"
                        min="0"
                        value={map[sz] ?? 1}
                        onChange={(e) => handleRatioChange(grade, sz, parseInt(e.target.value) || 0)}
                        className="w-14 bg-luxe-bg border border-luxe-border rounded px-2 py-1 text-center font-mono font-bold text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-right font-bold text-luxe-text">
                    {activeSizes.map((sz) => map[sz] ?? 1).join(' : ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Requirement #16 Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-luxe-bg/95 border-t border-luxe-border p-3.5 shadow-dropdown">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/admin/user-view/ratios')} className="px-4 py-2 text-xs font-medium text-luxe-muted">
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="px-4 py-2 rounded text-xs font-semibold border border-luxe-border text-luxe-text hover:bg-luxe-surface">
              Save Draft
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black">
              <Check className="w-3.5 h-3.5" />
              <span>Save Ratio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
