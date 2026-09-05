import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SizeRatioConfig, CartItem, Grade } from '../types';

/**
 * Generates a Luxury Merchandising PDF Size Ratio Report
 */
export const exportRatioReportPDF = (
  ratios: SizeRatioConfig[],
  attributeLevel: string,
  allDetectedSizes: string[]
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Color palette
  const darkBg: [number, number, number] = [10, 10, 10];
  const goldColor: [number, number, number] = [200, 169, 107];
  const textColor: [number, number, number] = [245, 245, 240];

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setTextColor(...goldColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('LUXE RATIO STUDIO', 14, 18);

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`OFFICIAL MERCHANDISING GRADE-WISE SIZE RATIO REPORT`, 14, 26);
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Attribute Level: ${attributeLevel}`, 14, 32);

  // Group ratios by Grade
  const grades: Grade[] = ['A', 'B', 'C', 'D'];
  let currentY = 48;

  grades.forEach((grade) => {
    const gradeRatios = ratios.filter(r => r.grade === grade);

    if (gradeRatios.length === 0) return;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...goldColor);
    doc.text(`GRADE ${grade} — RATIO SPECIFICATIONS`, 14, currentY);
    currentY += 4;

    const tableHeaders = ['Attribute Group', ...allDetectedSizes, 'Ratio Output'];
    const tableData = gradeRatios.map(r => {
      const sizeValues = allDetectedSizes.map(sz => r.sizeRatios[sz] ?? '-');
      return [r.groupKey, ...sizeValues, r.normalizedRatio || '1 : 1'];
    });

    autoTable(doc, {
      startY: currentY,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 26, 26],
        textColor: [200, 169, 107],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [30, 30, 30],
        fontSize: 8.5,
      },
      alternateRowStyles: {
        fillColor: [248, 246, 242],
      },
      margin: { left: 14, right: 14 },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 12;

    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(`LUXE Merchandising Platform • Page ${i} of ${pageCount}`, 14, 287);
  }

  doc.save(`LUXE_Size_Ratio_Report_${attributeLevel.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Exports Cart Summary to PDF
 */
export const exportCartSummaryPDF = (cartItems: CartItem[]) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(200, 169, 107);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('LUXE RATIO STUDIO — CART MANIFEST', 14, 16);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.text(`Export Date: ${new Date().toLocaleString()} | Total Items: ${cartItems.length}`, 14, 25);

  const grades: Grade[] = ['A', 'B', 'C', 'D'];
  let currentY = 42;

  grades.forEach(grade => {
    const items = cartItems.filter(i => i.grade === grade);
    if (items.length === 0) return;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 169, 107);
    doc.text(`GRADE ${grade} CART ITEMS (${items.length})`, 14, currentY);
    currentY += 4;

    const tableData = items.map(item => {
      const sizeBreakdown = Object.entries(item.sizes)
        .map(([sz, qty]) => `${sz}: ${qty}`)
        .join(', ');
      return [
        item.product.name,
        item.product.category,
        item.product.brick,
        sizeBreakdown || 'Standard',
        item.totalQuantity.toString(),
        `$${((item.product.price || 0) * item.totalQuantity).toLocaleString()}`
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Product Name', 'Category', 'Brick', 'Sizes Breakdown', 'Total Qty', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 26], textColor: [200, 169, 107] },
      margin: { left: 14, right: 14 },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 10;
  });

  doc.save(`LUXE_Cart_Summary_${Date.now()}.pdf`);
};
