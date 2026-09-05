import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Layers, CheckSquare, Square, Download, Save, CheckCircle2, RotateCcw, PieChart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Grade, AttributeLevelType, CustomAttributeFlags } from '../types';
import { exportRatioReportPDF } from '../services/pdfExporter';
import { api } from '../services/api';

export const RatioStudio: React.FC = () => {
  const {
    products,
    detectedSizes,
    ratios,
    attributeLevel,
    customAttributes,
    setAttributeLevel,
    setCustomAttributes,
    saveRatioConfig,
    deleteRatioConfig,
    user,
    addToast
  } = useAppStore();

  const [activeGrade, setActiveGrade] = useState<Grade>('A');
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>('');
  const [ratioInputs, setRatioInputs] = useState<Record<string, number>>({});

  // 1. Calculate Group Keys based on chosen Attribute Level
  const groupKeys = useMemo(() => {
    const keys = new Set<string>();

    products.forEach((p) => {
      let key = '';

      if (attributeLevel === 'Brick') {
        key = p.brick;
      } else if (attributeLevel === 'Category') {
        key = p.category;
      } else if (attributeLevel === 'Brick + Category') {
        key = `${p.brick} > ${p.category}`;
      } else if (attributeLevel === 'Brick + Neck') {
        key = `${p.brick} (${p.neck || 'Round Neck'})`;
      } else if (attributeLevel === 'Brick + Sleeve') {
        key = `${p.brick} (${p.sleeve || 'Short Sleeve'})`;
      } else if (attributeLevel === 'Custom Combination') {
        const parts: string[] = [];
        if (customAttributes.brick) parts.push(`Brick: ${p.brick}`);
        if (customAttributes.category) parts.push(`Cat: ${p.category}`);
        if (customAttributes.neck) parts.push(`Neck: ${p.neck || 'Standard'}`);
        if (customAttributes.sleeve) parts.push(`Sleeve: ${p.sleeve || 'Standard'}`);
        key = parts.length > 0 ? parts.join(' | ') : p.category;
      }

      if (key) keys.add(key);
    });

    const list = Array.from(keys);
    return list.length > 0 ? list : ['All Merchandising Apparel'];
  }, [products, attributeLevel, customAttributes]);

  // Set default group key if not set or out of bounds
  const currentGroupKey = selectedGroupKey || groupKeys[0] || 'Dresses';

  // Extract products belonging to this groupKey
  const groupProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.grade !== activeGrade) return false;

      if (attributeLevel === 'Brick') return p.brick === currentGroupKey;
      if (attributeLevel === 'Category') return p.category === currentGroupKey;
      if (attributeLevel === 'Brick + Category') return `${p.brick} > ${p.category}` === currentGroupKey;
      if (attributeLevel === 'Brick + Neck') return `${p.brick} (${p.neck || 'Round Neck'})` === currentGroupKey;
      if (attributeLevel === 'Brick + Sleeve') return `${p.brick} (${p.sleeve || 'Short Sleeve'})` === currentGroupKey;
      return true;
    });
  }, [products, activeGrade, attributeLevel, currentGroupKey]);

  // Dynamic sizes relevant for this group (strictly derived from catalogue data)
  const groupSizes = useMemo(() => {
    const sSet = new Set<string>();
    groupProducts.forEach((p) => (p.sizes || []).forEach((s) => sSet.add(s)));
    const list = Array.from(sSet);
    if (list.length > 0) return list;
    return detectedSizes.length > 0 ? detectedSizes : ['S', 'M', 'L', 'XL'];
  }, [groupProducts, detectedSizes]);

  // Initialize ratio inputs when activeGrade or currentGroupKey changes
  useEffect(() => {
    const existing = ratios.find(
      (r) => r.grade === activeGrade && r.groupKey === currentGroupKey && r.attributeLevel === attributeLevel
    );

    if (existing) {
      setRatioInputs(existing.sizeRatios);
    } else {
      const defaults: Record<string, number> = {};
      groupSizes.forEach((sz, idx) => {
        if (activeGrade === 'A') defaults[sz] = idx % 2 === 0 ? 1 : 2;
        else if (activeGrade === 'B') defaults[sz] = idx % 3 === 0 ? 2 : 1;
        else if (activeGrade === 'C') defaults[sz] = idx % 2 === 0 ? 2 : 1;
        else defaults[sz] = 1;
      });
      setRatioInputs(defaults);
    }
  }, [activeGrade, currentGroupKey, attributeLevel, ratios, groupSizes]);

  const handleRatioInputChange = (sz: string, val: number) => {
    setRatioInputs((prev) => ({
      ...prev,
      [sz]: Math.max(0, val),
    }));
  };

  // State populated by Backend Ratio Engine
  const [calculation, setCalculation] = useState<{
    totalRatioSum: number;
    normalizedRatio: string;
    percentageDistribution: Record<string, number>;
  }>({
    totalRatioSum: 0,
    normalizedRatio: '',
    percentageDistribution: {},
  });

  // Call Backend Ratio Engine (Server-side business logic)
  useEffect(() => {
    let isMounted = true;
    api.calculateRatio({
      grade: activeGrade,
      attributeLevel,
      groupKey: currentGroupKey,
      sizeRatios: ratioInputs,
    })
      .then((res) => {
        if (isMounted && res) {
          setCalculation({
            totalRatioSum: res.totalRatioSum,
            normalizedRatio: res.normalizedRatio,
            percentageDistribution: res.percentageDistribution || {},
          });
        }
      })
      .catch(() => {
        // Fallback calculation if offline
        const sum = Object.values(ratioInputs).reduce((a, b) => a + (b || 0), 0);
        const norm = groupSizes.map((sz) => ratioInputs[sz] ?? 0).join(' : ');
        const pcts: Record<string, number> = {};
        groupSizes.forEach((sz) => {
          pcts[sz] = sum > 0 ? parseFloat((((ratioInputs[sz] || 0) / sum) * 100).toFixed(1)) : 0;
        });
        if (isMounted) {
          setCalculation({ totalRatioSum: sum, normalizedRatio: norm, percentageDistribution: pcts });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [ratioInputs, activeGrade, attributeLevel, currentGroupKey, groupSizes]);

  const ratioString = calculation.normalizedRatio || groupSizes.map((sz) => ratioInputs[sz] ?? 0).join(' : ');

  const handleSaveRatio = async () => {
    const config = {
      userId: user?.uid || 'usr-merchandiser-01',
      grade: activeGrade,
      attributeLevel,
      groupKey: currentGroupKey,
      sizeRatios: ratioInputs,
      normalizedRatio: ratioString,
    };

    saveRatioConfig(config);
    try {
      await api.addRatio(config);
    } catch {
      // Local store handles offline mode
    }

    addToast(
      'Ratio Rule Saved',
      `Grade ${activeGrade} size ratio (${ratioString}) for ${currentGroupKey} saved successfully.`,
      'success'
    );
  };

  const attributeLevels: AttributeLevelType[] = [
    'Brick',
    'Category',
    'Brick + Category',
    'Brick + Neck',
    'Brick + Sleeve',
    'Custom Combination',
  ];

  const gradesList: Grade[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-luxe-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-luxe-dark text-luxe-bg">
              INTRAKRAFT RATIO ENGINE
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-luxe-text">
            Grade-Wise Size Ratio Studio
          </h1>
          <p className="text-xs text-luxe-muted mt-1">
            Configure independent size ratios for Grades A, B, C & D across multi-level attribute groupings.
          </p>
        </div>

        <button
          onClick={() => exportRatioReportPDF(ratios, attributeLevel, detectedSizes)}
          className="flex items-center gap-2 h-9 px-4 rounded text-xs font-semibold border border-luxe-border bg-luxe-surface text-luxe-text hover:bg-luxe-dark hover:text-luxe-bg transition-colors shrink-0 shadow-subtle"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ratio Report PDF</span>
        </button>
      </div>

      {/* Attribute Level Selector Bar */}
      <div className="rounded border border-luxe-border bg-luxe-surface p-6 space-y-4 shadow-subtle">
        <div>
          <h3 className="font-playfair text-base font-bold text-luxe-text mb-0.5">
            Select Ratio Attribute Level
          </h3>
          <p className="text-xs text-luxe-muted">
            The application dynamically groups catalogue products by the selected attribute combination.
          </p>
        </div>

        {/* Attribute Level Pills */}
        <div className="flex flex-wrap gap-2">
          {attributeLevels.map((lvl) => {
            const isActive = attributeLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => {
                  setAttributeLevel(lvl);
                  setSelectedGroupKey('');
                }}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-luxe-dark text-luxe-bg shadow-sm'
                    : 'bg-luxe-bg border border-luxe-border text-luxe-muted hover:text-luxe-text hover:bg-luxe-surface'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Custom Combination Checkboxes */}
        {attributeLevel === 'Custom Combination' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-luxe-border flex flex-wrap items-center gap-6"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-luxe-text">
              Attributes:
            </span>
            {[
              { key: 'brick', label: 'Brick' },
              { key: 'category', label: 'Category' },
              { key: 'neck', label: 'Neck' },
              { key: 'sleeve', label: 'Sleeve' },
            ].map(({ key, label }) => {
              const isChecked = customAttributes[key as keyof CustomAttributeFlags];
              return (
                <button
                  key={key}
                  onClick={() =>
                    setCustomAttributes({
                      ...customAttributes,
                      [key]: !isChecked,
                    })
                  }
                  className="flex items-center gap-1.5 text-xs font-medium text-luxe-text hover:text-black transition-colors"
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-luxe-dark" />
                  ) : (
                    <Square className="w-4 h-4 text-luxe-muted" />
                  )}
                  <span>{label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Main Ratio Builder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Grade Tabs & Group Selection & Matrix (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grade Selector Tabs (Grade A, B, C, D) */}
          <div className="flex items-center gap-2">
            {gradesList.map((g) => {
              const isActive = activeGrade === g;
              return (
                <button
                  key={g}
                  onClick={() => setActiveGrade(g)}
                  className={`flex-1 py-2.5 px-3 rounded font-playfair font-bold text-sm transition-all border text-center ${
                    isActive
                      ? 'bg-luxe-dark border-luxe-dark text-luxe-bg shadow-sm'
                      : 'bg-luxe-surface border-luxe-border text-luxe-muted hover:text-luxe-text'
                  }`}
                >
                  Grade {g}
                </button>
              );
            })}
          </div>

          {/* Group Key Dropdown Selector */}
          <div className="p-4 rounded border border-luxe-border bg-luxe-surface flex items-center justify-between gap-4 shadow-subtle">
            <div>
              <span className="text-[10px] uppercase font-bold text-luxe-muted tracking-wider block">
                Target Group ({attributeLevel})
              </span>
              <p className="text-xs font-medium text-luxe-text">
                {groupProducts.length} Catalogue Products in Grade {activeGrade}
              </p>
            </div>

            <select
              value={currentGroupKey}
              onChange={(e) => setSelectedGroupKey(e.target.value)}
              className="bg-luxe-bg border border-luxe-border rounded px-3 py-1.5 text-xs font-semibold text-luxe-text focus:border-luxe-dark focus:outline-none"
            >
              {groupKeys.map((gk) => (
                <option key={gk} value={gk}>
                  {gk}
                </option>
              ))}
            </select>
          </div>

          {/* Grade-wise Size Ratio Matrix */}
          <div className="rounded border border-luxe-border bg-luxe-surface p-6 space-y-6 shadow-subtle">
            <div className="flex items-center justify-between border-b border-luxe-border pb-4">
              <div>
                <h3 className="font-playfair text-lg font-bold text-luxe-text flex items-center gap-2">
                  <span>Grade {activeGrade} Size Matrix</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-luxe-bg text-luxe-text font-sans font-bold border border-luxe-border">
                    {currentGroupKey}
                  </span>
                </h3>
                <p className="text-xs text-luxe-muted mt-1">
                  Dynamic sizes parsed directly from catalogue. Enter integer proportions:
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-luxe-muted uppercase tracking-wider block font-bold">Normalized Proportions</span>
                <span className="font-mono text-sm font-bold text-luxe-text">
                  {ratioString}
                </span>
              </div>
            </div>

            {/* Sizes & Ratio Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {groupSizes.map((sz) => {
                const ratioVal = ratioInputs[sz] ?? 0;
                const percentage =
                  calculation.percentageDistribution[sz] !== undefined
                    ? calculation.percentageDistribution[sz]
                    : calculation.totalRatioSum > 0
                    ? ((ratioVal / calculation.totalRatioSum) * 100).toFixed(1)
                    : '0';

                return (
                  <div
                    key={sz}
                    className="p-3.5 rounded bg-luxe-bg/60 border border-luxe-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-luxe-text">{sz}</span>
                      <span className="text-[10px] text-luxe-muted font-mono font-bold">{percentage}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={ratioVal}
                        onChange={(e) => handleRatioInputChange(sz, parseInt(e.target.value) || 0)}
                        className="w-full bg-luxe-surface border border-luxe-border rounded px-2.5 py-1.5 text-sm font-mono font-bold text-luxe-text text-center focus:border-luxe-dark focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Ratio Action */}
            <div className="pt-4 border-t border-luxe-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-luxe-muted">
                Total Proportion Weight: <strong className="font-mono text-luxe-text">{calculation.totalRatioSum}</strong>
              </span>

              <button
                onClick={handleSaveRatio}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded font-bold text-xs bg-luxe-dark text-luxe-bg hover:bg-black transition-colors shadow-subtle"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Grade {activeGrade} Ratio Rule</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Saved Ratio Rules (1 col) */}
        <div className="space-y-6">
          <div className="rounded border border-luxe-border bg-luxe-surface p-6 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between border-b border-luxe-border pb-3">
              <div className="flex items-center gap-2 text-luxe-text">
                <PieChart className="w-4 h-4 text-luxe-muted" />
                <h3 className="font-playfair text-base font-bold text-luxe-text">
                  Saved Ratio Rules ({ratios.length})
                </h3>
              </div>
              <span className="text-[10px] text-luxe-muted uppercase font-bold tracking-wider">Synced</span>
            </div>

            {ratios.length === 0 ? (
              <p className="text-xs text-luxe-muted py-6 text-center">
                No ratio rules saved yet. Configure proportions and click Save.
              </p>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {ratios.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3.5 rounded bg-luxe-bg/60 border border-luxe-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-luxe-text">Grade {rule.grade}</span>
                      <span className="text-[10px] text-luxe-muted uppercase tracking-wider">{rule.attributeLevel}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-luxe-text line-clamp-1">{rule.groupKey}</h4>
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-luxe-border/60">
                      <span className="font-mono text-[11px] text-luxe-text font-bold">
                        {rule.normalizedRatio}
                      </span>
                      <button
                        onClick={() => deleteRatioConfig(rule.id)}
                        className="text-[10px] font-semibold text-rose-600 hover:text-rose-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioStudio;
