import * as XLSX from 'xlsx';
import { Product, Grade, Catalogue } from '../types';

export interface ParseExcelResult {
  catalogue: Catalogue;
  products: Product[];
  detectedSizes: string[];
}

export const parseCatalogueExcel = async (file: File): Promise<ParseExcelResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Read first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert sheet to JSON rows
        const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          throw new Error('The uploaded Excel file contains no readable rows.');
        }

        const products: Product[] = [];
        const sizeSet = new Set<string>();
        const gradeCounts: Record<Grade, number> = { A: 0, B: 0, C: 0, D: 0 };
        const catalogueId = `cat-${Date.now()}`;

        rawRows.forEach((row, idx) => {
          // Flexible key lookup
          const name = row['Product Name'] || row['ProductName'] || row['Name'] || row['Title'] || `Apparel Item #${idx + 1}`;
          let rawGrade = (row['Grade'] || row['grade'] || 'A').toString().trim().toUpperCase();
          if (!['A', 'B', 'C', 'D'].includes(rawGrade)) {
            rawGrade = 'A';
          }
          const grade = rawGrade as Grade;
          gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;

          const brick = row['Brick'] || row['brick'] || 'Apparel';
          const category = row['Category'] || row['category'] || 'Dresses';
          const neck = row['Neck'] || row['neck'] || row['Neckline'] || 'Round Neck';
          const sleeve = row['Sleeve'] || row['sleeve'] || row['Sleeve Style'] || 'Short Sleeve';
          const price = parseFloat(row['Price'] || row['price'] || '390') || 390;
          const imageUrl = row['Image URL'] || row['imageUrl'] || row['Image'] || '';
          const description = row['Description'] || row['description'] || `${category} tailored with high quality fabric.`;

          // Handle Sizes column or size matrix columns
          let parsedSizes: string[] = [];

          if (row['Sizes']) {
            parsedSizes = row['Sizes'].toString().split(',').map((s: string) => s.trim()).filter(Boolean);
          } else if (row['Size']) {
            parsedSizes = row['Size'].toString().split(',').map((s: string) => s.trim()).filter(Boolean);
          } else {
            // Check individual size columns (e.g. 4-5Y, 5-6Y, S, M, L, XL)
            const commonSizes = ['4-5Y', '5-6Y', '7-8Y', '9-10Y', '11-12Y', '13-14Y', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
            commonSizes.forEach(sz => {
              if (row[sz] !== undefined && row[sz] !== '' && row[sz] !== 0 && row[sz] !== '0') {
                parsedSizes.push(sz);
              }
            });
          }

          if (parsedSizes.length === 0) {
            // Fallback default sizes based on category
            if (category.toLowerCase().includes('kids') || brick.toLowerCase().includes('junior')) {
              parsedSizes = ['4-5Y', '5-6Y', '7-8Y', '9-10Y'];
            } else {
              parsedSizes = ['S', 'M', 'L', 'XL'];
            }
          }

          parsedSizes.forEach(s => sizeSet.add(s));

          products.push({
            id: `prod-${Date.now()}-${idx}`,
            name,
            grade,
            brick,
            category,
            neck,
            sleeve,
            sizes: parsedSizes,
            price,
            imageUrl,
            description,
            createdAt: new Date().toISOString(),
            catalogueId
          });
        });

        const detectedSizes = Array.from(sizeSet);

        const catalogue: Catalogue = {
          id: catalogueId,
          name: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          uploadedBy: 'Current User',
          uploadDate: new Date().toISOString(),
          totalProducts: products.length,
          gradesCount: gradeCounts,
          detectedSizes,
          status: 'Completed'
        };

        resolve({ catalogue, products, detectedSizes });
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from disk.'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generates and downloads a sample Excel catalogue file (.xlsx)
 */
export const downloadSampleCatalogueExcel = () => {
  const sampleRows = [
    {
      'Product Name': 'Silk Chiffon Maxi Dress',
      'Grade': 'A',
      'Brick': 'Couture Apparel',
      'Category': 'Dresses',
      'Neck': 'V-Neck',
      'Sleeve': 'Sleeveless',
      'Sizes': '4-5Y, 5-6Y, 7-8Y, 9-10Y',
      'Price': 1450,
      'Description': 'Elegant maxi dress crafted from 100% silk chiffon.'
    },
    {
      'Product Name': 'Tailored Poplin Shirt',
      'Grade': 'A',
      'Brick': 'Essential Apparel',
      'Category': 'Shirts',
      'Neck': 'Collar',
      'Sleeve': 'Full Sleeve',
      'Sizes': 'S, M, L, XL',
      'Price': 480,
      'Description': 'Slim fit Egyptian cotton oxford shirt.'
    },
    {
      'Product Name': 'Resort Linen Shorts',
      'Grade': 'B',
      'Brick': 'Resort Wear',
      'Category': 'Shorts',
      'Neck': 'N/A',
      'Sleeve': 'N/A',
      'Sizes': 'S, M, L, XL',
      'Price': 320,
      'Description': 'Casual linen shorts with drawstring elastic waistband.'
    },
    {
      'Product Name': 'Embroidered Velvet Top',
      'Grade': 'B',
      'Brick': 'Luxury Knitwear',
      'Category': 'Tops',
      'Neck': 'Round Neck',
      'Sleeve': 'Short Sleeve',
      'Sizes': '4-5Y, 5-6Y, 7-8Y, 9-10Y, 11-12Y',
      'Price': 690,
      'Description': 'Rich velvet top featuring intricate floral lace.'
    },
    {
      'Product Name': 'Monogram Fleece Trackpants',
      'Grade': 'C',
      'Brick': 'Loungewear',
      'Category': 'Trackpants',
      'Neck': 'N/A',
      'Sleeve': 'N/A',
      'Sizes': 'S, M, L, XL',
      'Price': 410,
      'Description': 'Soft fleece trackpants with metallic monogram trim.'
    },
    {
      'Product Name': 'Selvedge Indigo Jeans',
      'Grade': 'D',
      'Brick': 'Luxury Denim',
      'Category': 'Jeans & Jeggings',
      'Neck': 'N/A',
      'Sleeve': 'N/A',
      'Sizes': 'S, M, L, XL',
      'Price': 520,
      'Description': 'Classic Japanese selvedge denim in deep indigo wash.'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catalogue');

  XLSX.writeFile(workbook, 'LUXE_Sample_Catalogue.xlsx');
};
