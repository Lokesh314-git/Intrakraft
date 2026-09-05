const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

function createSetupGuidePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryColor = [26, 26, 26]; // #1A1A1A Luxury Dark
  const accentColor = [184, 134, 11]; // #B8860B Dark Goldenrod / Luxury Bronze
  const secondaryColor = [75, 85, 99]; // #4B5563 Slate gray
  const bgBoxColor = [248, 249, 250]; // #F8F9FA
  const borderBoxColor = [226, 232, 240]; // #E2E8F0
  const codeBgColor = [241, 245, 249]; // #F1F5F9
  const codeTextColor = [30, 41, 59]; // #1E293B

  let yPos = 18;

  // --- HEADER COVER STRIP ---
  doc.setFillColor(...primaryColor);
  doc.rect(margin, yPos, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('LUXÉ MERCHANDISE PLATFORM', margin + 6, yPos + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(218, 165, 32);
  doc.text('INTRAKRAFT ASSIGNMENT — SETUP & RUN INSTRUCTIONS', margin + 6, yPos + 17);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('Version: 1.0.0 | Full-Stack Assessment', pageWidth - margin - 6, yPos + 14, { align: 'right' });

  yPos += 30;

  // --- SECTION: EXECUTIVE SUMMARY & LIVE DEPLOYMENT ---
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('1. Executive Summary & Live Deployments', margin, yPos);
  yPos += 2;

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.6);
  doc.line(margin, yPos, margin + 45, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...secondaryColor);
  doc.text(
    'This project is a production-grade apparel merchandising system engineered for Intrakraft. It strictly\nseparates the Frontend and Backend architectures, supporting Excel catalogue ingestion, dynamic size matrixing,\ngrade-wise cart allocation, and multi-level size ratio configuration using the Hamilton Method.',
    margin,
    yPos
  );
  yPos += 13;

  // Table of Live Links
  doc.autoTable({
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Component', 'Live Production URL / Repository', 'Environment']],
    body: [
      ['Live Frontend', 'https://lokesh314-git.github.io/Intrakraft/', 'GitHub Pages (SPA)'],
      ['Live Backend API', 'https://intrakraft-backend.vercel.app', 'Vercel Serverless'],
      ['Interactive Swagger Docs', 'https://intrakraft-backend.vercel.app/api/docs', 'OpenAPI 3.0 UI'],
      ['Health Check Endpoint', 'https://intrakraft-backend.vercel.app/api/health', 'JSON Health Diagnostic'],
      ['Frontend GitHub Repo', 'https://github.com/Lokesh314-git/Intrakraft', 'Main Branch & gh-pages'],
      ['Backend GitHub Repo', 'https://github.com/Lokesh314-git/Intrakraft-backend', 'Production TypeScript'],
    ],
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [40, 40, 40] },
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // --- SECTION: PREREQUISITES & TECH STACK ---
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('2. Technology Stack & System Prerequisites', margin, yPos);
  yPos += 2;

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.6);
  doc.line(margin, yPos, margin + 45, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Layer', 'Technologies Used', 'Key Responsibilities']],
    body: [
      ['Frontend', 'React 18, TypeScript, Tailwind CSS, Zustand, Vite, HashRouter', 'UI Rendering, Client State, Routing, Cart Matrix, User Views'],
      ['Backend', 'Node.js, Express, TypeScript, SheetJS (xlsx), Multer, Swagger UI', 'Excel Ingestion, Data Validation, Ratio Calculations, REST API'],
      ['Authentication', 'Firebase Authentication & Firebase Admin SDK', 'Google Sign-In, Session Token Validation, Role Guards'],
      ['Prerequisites', 'Node.js v18.0+ (v20 recommended), npm v9.0+, Git installed', 'Required runtime dependencies to build and run locally'],
    ],
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [40, 40, 40] },
    headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // --- SECTION: LOCAL SETUP & RUN INSTRUCTIONS ---
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('3. Step-by-Step Local Setup & Run Instructions', margin, yPos);
  yPos += 2;

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.6);
  doc.line(margin, yPos, margin + 45, yPos);
  yPos += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryColor);
  doc.text('Option A: Running Both Frontend & Backend Concurrently (Recommended)', margin, yPos);
  yPos += 4;

  const box1Y = yPos;
  doc.setFillColor(...codeBgColor);
  doc.roundedRect(margin, box1Y, contentWidth, 25, 1, 1, 'F');
  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...codeTextColor);
  doc.text(
    [
      '# 1. Clone repository and install frontend dependencies',
      'git clone https://github.com/Lokesh314-git/Intrakraft.git',
      'cd Intrakraft && npm install',
      '# 2. Install backend dependencies and launch concurrent dev environment',
      'cd backend && npm install && cd ..',
      'npm run dev',
    ],
    margin + 3,
    box1Y + 4
  );

  yPos = box1Y + 29;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text(
    '• Frontend UI will launch on: http://localhost:3000 (or http://localhost:5173)\n• Backend REST API will launch on: http://localhost:5000/api\n• Local Swagger Documentation available on: http://localhost:5000/api/docs',
    margin + 2,
    yPos
  );

  // --- PAGE BREAK FOR PAGE 2 ---
  doc.addPage();
  yPos = 18;

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Option B: Running Backend & Frontend Independently', margin, yPos);
  yPos += 4;

  // Two columns or sequential blocks
  const box2Y = yPos;
  doc.setFillColor(...codeBgColor);
  doc.roundedRect(margin, box2Y, contentWidth / 2 - 2, 28, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text('Terminal 1 (Backend Server):', margin + 3, box2Y + 4);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...codeTextColor);
  doc.text(
    [
      'cd backend',
      'npm install',
      'npm run dev',
      '',
      '# Server running on port 5000',
      '# Health: http://localhost:5000/api/health',
    ],
    margin + 3,
    box2Y + 9
  );

  doc.setFillColor(...codeBgColor);
  doc.roundedRect(margin + contentWidth / 2 + 2, box2Y, contentWidth / 2 - 2, 28, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...primaryColor);
  doc.text('Terminal 2 (Frontend Client):', margin + contentWidth / 2 + 5, box2Y + 4);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...codeTextColor);
  doc.text(
    [
      'cd .. (project root)',
      'npm install',
      'npm run dev',
      '',
      '# Client running on port 3000',
      '# Auto-connects to backend API',
    ],
    margin + contentWidth / 2 + 5,
    box2Y + 9
  );

  yPos = box2Y + 34;

  // --- SECTION: ENVIRONMENT CONFIGURATION ---
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('4. Environment Configuration (.env)', margin, yPos);
  yPos += 2;

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.6);
  doc.line(margin, yPos, margin + 45, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['Configuration File', 'Variable Name', 'Default Value', 'Description']],
    body: [
      ['Frontend (.env)', 'VITE_API_URL', 'https://intrakraft-backend.vercel.app/api', 'Backend endpoint (defaults to live Vercel API; can set localhost:5000)'],
      ['Frontend (.env)', 'VITE_FIREBASE_API_KEY', 'Configured in .env', 'Firebase Client SDK Web API key for Google Sign-In'],
      ['Frontend (.env)', 'VITE_FIREBASE_PROJECT_ID', 'student-acf58', 'Firebase project identifier for client auth state'],
      ['Backend (.env)', 'PORT', '5000', 'Local HTTP listener port for Express REST API'],
      ['Backend (.env)', 'CORS_ORIGIN', '*', 'Allowed origin headers for cross-site requests'],
      ['Backend (.env)', 'NODE_ENV', 'development / production', 'Environment execution mode'],
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, textColor: [40, 40, 40] },
    headStyles: { fillColor: [50, 50, 50], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // --- SECTION: CORE REQUIREMENTS CHECKLIST & HOW TO TEST ---
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('5. Assignment Requirements & Testing Guide', margin, yPos);
  yPos += 2;

  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.6);
  doc.line(margin, yPos, margin + 45, yPos);
  yPos += 5;

  doc.autoTable({
    startY: yPos,
    margin: { left: margin, right: margin },
    head: [['#', 'Core Requirement', 'Where & How to Verify in the Application']],
    body: [
      ['1', 'Upload Catalogue Excel (.xlsx)', 'Navigate to Admin -> Catalogues -> Upload. Drag and drop any .xlsx file. Handled via backend POST /api/catalogues/upload.'],
      ['2', 'Display Catalogue Products', 'View parsed products under Admin -> Products or User View -> Catalogue. Shows exact name, category, and extracted sizes.'],
      ['3', 'Dynamic Sizes Extraction', 'Upload sheets with non-standard sizes (e.g., kids sizes 4-5Y, 5-6Y or adult XS..XXL). System extracts sizes dynamically without hardcoding.'],
      ['4', 'Add to Cart & Grade Display', 'Select products with Grade A, B, or C. In User View -> Cart, items are strictly divided into distinct Grade A, Grade B, Grade C sections.'],
      ['5', 'Grade-wise Ratio Matrix', 'Go to Ratio Studio (/admin/ratios/studio). Set independent ratio distributions for Grade A, Grade B, Grade C, and Grade D.'],
      ['6', 'Attribute Combination Levels', 'Configure ratios at Brick, Category, Brick+Neck, Brick+Sleeve, or custom attribute combinations using dynamic selector buttons.'],
      ['7', 'Exact Ratio Calculation', 'Backend applies the Hamilton Largest Remainder Method, ensuring allocated unit quantities sum exactly to 100 with 0% rounding loss.'],
      ['8', 'Cascade Deletion Integrity', 'Delete a catalogue in Admin -> Catalogues. Its associated products are automatically purged from the product list and dashboard.'],
    ],
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2, textColor: [40, 40, 40] },
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // --- SECTION: PRODUCTION BUILD & VERIFICATION COMMANDS ---
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('6. Build & Lint Verification Commands', margin, yPos);
  yPos += 4;

  const box3Y = yPos;
  doc.setFillColor(...codeBgColor);
  doc.roundedRect(margin, box3Y, contentWidth, 18, 1, 1, 'F');
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...codeTextColor);
  doc.text(
    [
      'npm run build         # Validates TypeScript compilation and builds Vite bundle (0 errors)',
      'npm run lint          # Validates root TypeScript rules (tsc -b) (0 errors)',
      'cd backend && npm run build  # Compiles backend TypeScript to dist/ (0 errors)',
    ],
    margin + 3,
    box3Y + 4
  );

  // Footer on both pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(130, 130, 130);
    doc.text('LUXÉ Merchandising Console — Intrakraft Technical Assessment Submission Guide', margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  const outputPath = path.resolve(__dirname, 'Intrakraft_Setup_and_Run_Instructions.pdf');
  const pdfBuffer = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
  console.log('PDF successfully generated at:', outputPath);
  return outputPath;
}

createSetupGuidePDF();
