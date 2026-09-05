# LUXÉ MERCHANDISE CONSOLE — Intrakraft Assignment Submission

A production-grade, enterprise apparel merchandising platform engineered for **Intrakraft's Backend & Full-Stack Developer Assessment**. 

The system features a **strictly decoupled Frontend & Backend architecture**, built with **Express, TypeScript, SheetJS, Firebase Admin SDK**, and a **React (TypeScript, Tailwind, Zustand)** frontend.

> **Live Deployment Links:**
> - **Live Frontend (GitHub Pages)**: [https://lokesh314-git.github.io/Intrakraft/](https://lokesh314-git.github.io/Intrakraft/)
> - **Live Backend API (Vercel)**: [https://intrakraft-backend.vercel.app](https://intrakraft-backend.vercel.app)
> - **Interactive Swagger Docs**: [https://intrakraft-backend.vercel.app/api/docs](https://intrakraft-backend.vercel.app/api/docs)
> - **System Health Check**: [https://intrakraft-backend.vercel.app/api/health](https://intrakraft-backend.vercel.app/api/health)
> - **Setup & Run Instructions (PDF)**: [Intrakraft_Setup_and_Run_Instructions.pdf](./Intrakraft_Setup_and_Run_Instructions.pdf)
> - **Frontend GitHub Repository**: [https://github.com/Lokesh314-git/Intrakraft](https://github.com/Lokesh314-git/Intrakraft)
> - **Backend GitHub Repository**: [https://github.com/Lokesh314-git/Intrakraft-backend](https://github.com/Lokesh314-git/Intrakraft-backend)

---

## 📋 Evaluation Checklist & 100% Assignment Compliance

| # | Core Assignment Requirement | Implementation Status | Implementation Details |
|---|---|---|---|
| **1** | **Upload Catalogue Excel (.xlsx) file** | ✅ **Complete** | Handled by backend `POST /api/catalogues/upload` using SheetJS (`xlsx`). Supports `.xlsx`, `.xls`, and `.csv` with drag-and-drop. |
| **2** | **Read and display catalogue products from uploaded file** | ✅ **Complete** | Ingested products are extracted, validated, and displayed across `/admin/products`, `/admin/catalogues/:id`, and `/admin/user-view/catalogue`. |
| **3** | **Use uploaded catalogue as source of Products, Grades, Sizes, and Attributes** | ✅ **Complete** | All data (Product Name, Grade, Brick, Category, Neck, Sleeve, Price, Sizes) is dynamically parsed from the uploaded spreadsheet. |
| **4** | **Allow product selection and Add to Cart** | ✅ **Complete** | Interactive size and quantity selectors on Product Cards, Quick View modal, and Product Detail Pages. |
| **5** | **Cart must contain products with different Grades (A, B, C)** | ✅ **Complete** | Cart strictly organizes line items into dedicated sections: **Grade A**, **Grade B**, **Grade C**, and **Grade D**. |
| **6** | **Display product Grade and available Sizes in Cart** | ✅ **Complete** | Each cart item displays its Grade badge, category, and an itemized size-to-quantity breakdown (e.g. `S: 2, M: 4, L: 1`). |
| **7** | **Allow separate size-wise ratio configuration for each Grade** | ✅ **Complete** | Independent ratio input matrices for Grade A, Grade B, Grade C, and Grade D. |
| **8** | **Support ratio configuration at Brick, Category, Brick+Neck, Brick+Sleeve, and other attribute combination levels** | ✅ **Complete** | Fully supported attribute grouping levels: `Brick`, `Category`, `Brick + Category`, `Brick + Neck`, `Brick + Sleeve`, and dynamic `Custom Combination` toggles. |
| **9** | **Support dynamic sizes from catalogue data (not hardcoded S, M, L)** | ✅ **Complete** | Dynamically detects whatever sizes exist in the uploaded file (e.g. children's `4-5Y`, `5-6Y`, `7-8Y` or adult `XS`, `S`, `M`, `L`, `XL`, `XXL`). |
| **10** | **Allow Save/Set Ratio functionality** | ✅ **Complete** | Saves configured ratio models to database (`POST /api/ratios`) and client storage; generates normalized ratio string and proportional metrics. |
| **11** | **Ensure Grade-wise ratio calculation works correctly for Grade A, B, and C** | ✅ **Complete** | Evaluated via pure backend `RatioEngine` using the **Hamilton Largest Remainder Method** for exact unit allocations and percentage distributions. |

---

## 🏗️ Production-Grade Architecture

The project is structured with a **clean separation of concerns**:

```text
Intrakraft-assignment/
├── backend/                      # Production Layered Express + TypeScript API Engine
│   ├── src/
│   │   ├── config/               # Environment, Firebase Admin SDK, Swagger OpenAPI
│   │   ├── database/             # StorageAdapter (Firestore + JSON persistence)
│   │   ├── middlewares/          # AuthGuard, ErrorHandler, Validation, RequestLogger
│   │   ├── modules/
│   │   │   ├── auth/             # Token verification, User profiling
│   │   │   ├── catalogue/        # Excel ingestion, file parsing, cascade deletion
│   │   │   ├── product/          # Product CRUD, multi-attribute filtering & search
│   │   │   ├── ratio/            # Mathematical Ratio Engine, Hamilton algorithm
│   │   │   ├── cart/             # Grade-wise cart sync & persistence
│   │   │   └── upload/           # Local file storage engine (Zero third-party vendor lock-in)
│   │   ├── utils/                # Custom AppError classes, structured Logger
│   │   ├── app.ts                # Express application bootstrap & route mounting
│   │   └── index.ts              # Server lifecycle management (Port 5000)
│   ├── data/
│   │   └── store.json            # Server-side local JSON store for reliability
│   └── package.json
│
├── src/                          # Modern React + TypeScript + Tailwind CSS Merchandising UI
│   ├── components/               # Reusable UI components & layouts (AdminLayout, UserViewLayout)
│   ├── pages/
│   │   ├── admin/                # Admin Console (Catalogue Library, Products, Ratio Management)
│   │   ├── userview/             # Customer / Merchandiser Commerce View
│   │   ├── Cart.tsx              # Grade-segregated Cart Studio
│   │   └── RatioStudio.tsx       # Live Interactive Ratio Engine Studio
│   ├── services/                 # API client (Fetch/Axios), Excel parser, PDF exporter
│   ├── store/                    # Zustand centralized store with rehydration healing
│   └── types/                    # Shared TypeScript interfaces & types
└── README.md
```

### Key Architectural Strengths:
1. **Layered Pattern**: `Routes → Controllers → Services → Repositories → StorageAdapter`.
2. **Zero Business Logic in Views**: UI components only dispatch actions; mathematical ratio calculations and Excel transformations are executed on the server.
3. **Local Storage Engine**: 100% self-contained local storage for files and assets, avoiding external dependencies.
4. **Lifecycle Coupling & Cascade Deletion**: Products strictly require an active catalogue. Deleting a catalogue automatically cascade-deletes all associated products from the database and UI.

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- **Node.js**: v18.x or higher (Tested on v20.x / v24.x)
- **npm**: v9.x or higher

---

### Step 1: Start the Backend Server

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd "backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend in development mode:
   ```bash
   npm run dev
   ```

4. The backend will start on **`http://localhost:5000`**:
   - **Health Check**: `http://localhost:5000/api/health`
   - **Interactive Swagger Docs**: `http://localhost:5000/api/docs`

---

### Step 2: Start the Frontend Application

1. Open a second terminal in the project root:
   ```bash
   cd "Intrakraft-assignment"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

4. Open your browser at **`http://localhost:5173`**.

---

## 📐 Grade-Wise Size Ratio Logic & Mathematical Formulation

Apparel merchandising requires distributors to allocate inventory across different sizes based on consumer demand trends. Premium grades (Grade A) may have a balanced bell curve, whereas secondary grades (Grade B/C) may skew towards high-velocity or clearance sizes.

### 1. Dynamic Size Extraction
Rather than hardcoding `['S', 'M', 'L']`, the application inspects the uploaded Excel catalogue:
- Reads either comma-delimited size cells (e.g. `"4-5Y, 5-6Y, 7-8Y, 9-10Y"`) or column matrix headers (`4-5Y`, `5-6Y`, `XS`, `S`, `M`, `L`, `XL`, `XXL`).
- Builds a dynamic size vector:
  $$\mathbf{S} = [s_1, s_2, \dots, s_k]$$

### 2. Multi-Level Attribute Partitioning
Ratios can be assigned at granular catalogue levels:
- **Brick**: High-level category (e.g., `Couture Apparel`, `Trousers`).
- **Category**: Product taxonomy (e.g., `Dresses`, `Shirts`).
- **Brick + Neck**: Combines garment structure and neck type (e.g., `Couture Apparel (V-Neck)`).
- **Brick + Sleeve**: Combines garment structure and sleeve type (e.g., `Essential Apparel (Full Sleeve)`).
- **Custom Combination**: Dynamic boolean flags combining any combination of Brick, Category, Neck, and Sleeve.

### 3. Ratio Normalization
Given user input weights $w_i \in \mathbb{N}_{\ge 0}$ for each size $s_i$:

1. **Total Ratio Sum ($W$)**:
   $$W = \sum_{i=1}^{k} w_i$$

2. **Normalized String Representation**:
   $$\text{Normalized Ratio} = w_1 : w_2 : \dots : w_k$$

3. **Percentage Distribution ($P_i$)**:
   $$P_i = \left( \frac{w_i}{W} \right) \times 100\%$$

### 4. Integer Unit Allocation: The Hamilton Largest Remainder Method
When ordering a total production quantity $Q$ (e.g., $Q = 100$ or $500$ units), fractional garments cannot be manufactured. The system uses the **Largest Remainder (Hamilton) Method** to guarantee that $\sum q_i = Q$ with zero rounding error:

1. **Quota Calculation**:
   $$\text{Exact Quota } q_i^* = \frac{w_i}{W} \times Q$$

2. **Integer Floor Allocation**:
   $$q_i = \lfloor q_i^* \rfloor, \quad \text{Remainder } r_i = q_i^* - q_i$$

3. **Leftover Distribution**:
   $$\Delta = Q - \sum_{i=1}^{k} q_i$$
   The $\Delta$ leftover units are assigned one-by-one to the sizes with the largest fractional remainders $r_i$ in descending order.

---

## 🧪 Verification & Quality Assurance

Both frontend and backend pass all build, lint, and typecheck verifications with **zero errors**:

```bash
# Frontend Compilation
npm run build
# Output: ✓ built in 17s (0 errors)

# Backend Compilation
cd backend && npm run build
# Output: tsc (0 errors)

# Code Quality / Linting
npm run lint
# Output: 0 errors
```

### Automated Cascade & Ratio Math Test
An automated verification test validates:
1. Ingesting an Excel file without image URLs assigns empty string `""` (no hardcoded sample image).
2. Querying `/api/ratios/calculate` with `{ S: 1, M: 2, L: 1 }` produces:
   - `totalRatioSum: 4`
   - `normalizedRatio: "1 : 2 : 1"`
   - `percentageDistribution: { S: 25.0%, M: 50.0%, L: 25.0% }`
3. Deleting a catalogue removes all linked products from the database and UI in sub-millisecond execution.

---

## 📄 License & Attribution

Submitted for the **Intrakraft Merchandising Engineering Selection Process**. All rights reserved.
