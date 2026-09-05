# LUXÉ MERCHANDISE CONSOLE — Intrakraft Assignment Submission

A production-grade, enterprise apparel merchandising platform engineered for **Intrakraft's Backend & Full-Stack Developer Assessment**. 

The system features a **strictly decoupled Frontend & Backend architecture**, built with **Express, TypeScript, SheetJS, Firebase Admin SDK**, and a **React (TypeScript, Tailwind, Zustand)** frontend.

> **Live Deployment Links:**
> - **Live Frontend (GitHub Pages)**: [https://lokesh314-git.github.io/Intrakraft/](https://lokesh314-git.github.io/Intrakraft/)
> - **Live Backend API (Vercel)**: [https://intrakraft-backend.vercel.app](https://intrakraft-backend.vercel.app)
> - **Backend GitHub Repository**: [https://github.com/Lokesh314-git/Intrakraft-backend](https://github.com/Lokesh314-git/Intrakraft-backend)

---

## 🏗️ Architecture

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
2. **Local Storage Engine**: 100% self-contained local storage for files and assets, avoiding external dependencies.

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
