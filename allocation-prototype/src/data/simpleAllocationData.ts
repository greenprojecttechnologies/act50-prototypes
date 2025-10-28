export interface SimpleAllocationItem {
  id: string;
  name: string;
  consumption: number;
  renewableEnergy: number;
}

export const mockCustomers: SimpleAllocationItem[] = [
  {
    id: 'customer-1',
    name: 'Acme Corporation',
    consumption: 5000000,
    renewableEnergy: 5000000,
  },
  {
    id: 'customer-2',
    name: 'Global Tech Industries',
    consumption: 8500000,
    renewableEnergy: 8500000,
  },
  {
    id: 'customer-3',
    name: 'Sunrise Manufacturing',
    consumption: 3200000,
    renewableEnergy: 3200000,
  },
  {
    id: 'customer-4',
    name: 'Pacific Logistics',
    consumption: 4100000,
    renewableEnergy: 4100000,
  },
  {
    id: 'customer-5',
    name: 'Metro Retail Group',
    consumption: 2800000,
    renewableEnergy: 2800000,
  },
];

export const mockProducts: SimpleAllocationItem[] = [
  {
    id: 'product-1',
    name: 'Widget Pro Series',
    consumption: 6500000,
    renewableEnergy: 6500000,
  },
  {
    id: 'product-2',
    name: 'Enterprise Solution X',
    consumption: 9200000,
    renewableEnergy: 9200000,
  },
  {
    id: 'product-3',
    name: 'Consumer Line Alpha',
    consumption: 4300000,
    renewableEnergy: 4300000,
  },
  {
    id: 'product-4',
    name: 'Industrial Equipment Beta',
    consumption: 7800000,
    renewableEnergy: 7800000,
  },
];

export const mockCustomProperties: SimpleAllocationItem[] = [
  {
    id: 'custom-1',
    name: 'Business Unit: Operations',
    consumption: 12500000,
    renewableEnergy: 12500000,
  },
  {
    id: 'custom-2',
    name: 'Business Unit: R&D',
    consumption: 6800000,
    renewableEnergy: 6800000,
  },
  {
    id: 'custom-3',
    name: 'Business Unit: Sales & Marketing',
    consumption: 3200000,
    renewableEnergy: 3200000,
  },
  {
    id: 'custom-4',
    name: 'Business Unit: Corporate',
    consumption: 2500000,
    renewableEnergy: 2500000,
  },
];

