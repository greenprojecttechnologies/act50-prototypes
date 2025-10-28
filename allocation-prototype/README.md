# Renewable Energy Allocation Prototype

A client-side React application for managing and allocating renewable energy across organizational entities with hierarchical geographic levels.

## Features

- **Hierarchical Entity View**: Navigate through a geographic hierarchy (Company → Region → Country → State → City → Facility → Resource)
- **Dynamic Level Filtering**: Toggle geographic levels on/off to skip levels in the hierarchy view
- **Flexible Allocation Strategies**:
  - **Equally Distributed**: Automatically splits renewable energy equally among children
  - **By Percentage**: Allocate by percentage (must total 100%)
  - **By Exact Amount**: Allocate specific kWh amounts (must not exceed available)
- **Multiple Display Modes**:
  - % of Total Company
  - % of Parent Entity
  - % of Own Consumption
- **Interactive Expandable Rows**: Click to expand/collapse entity hierarchies
- **Sub-tables with Column Alignment**: Allocation inputs maintain proper column alignment
- **Real-time Validation**: Visual feedback for invalid allocations

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** components for beautiful UI elements
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── AllocationRow.tsx
│   ├── AllocationSubTable.tsx
│   ├── AllocationTable.tsx
│   └── SettingsPanel.tsx
├── data/
│   └── mockData.ts      # Sample company data
├── lib/
│   └── utils.ts         # Utility functions
├── types/
│   └── allocation.ts    # TypeScript type definitions
├── App.tsx
├── main.tsx
└── index.css
```

## Usage

1. **Toggle Geographic Levels**: Use the switches in the Settings panel to show/hide specific geographic levels
2. **Change Display Mode**: Select how renewable energy percentages are calculated from the dropdown
3. **Expand Entities**: Click the chevron icon to expand/collapse entities with children
4. **Allocate Energy**: When expanded, choose an allocation strategy and input values:
   - Equally: No input needed, automatically distributed
   - By Percentage: Enter percentages that total 100%
   - By Exact Amount: Enter kWh amounts that don't exceed available energy

## Data Model

The application uses a hierarchical data structure with the following entity levels:

- **Company**: Top-level organization
- **Region**: Geographic regions (Americas, Europe, Asia Pacific)
- **Country**: Countries within regions
- **State/Province**: States or provinces within countries
- **City**: Cities within states
- **Facility**: Physical facilities (offices, factories, warehouses)
- **Resource**: Specific electricity meters or consumption points

Each entity includes:
- Name and level
- Energy consumption (kWh)
- Renewable energy available (kWh)
- Optional allocation strategy and values
- Child entities

## License

MIT

