export type EntityLevel = 'company' | 'region' | 'country' | 'state' | 'city' | 'facility' | 'resource';

export type AllocationStrategy = 'balanced' | 'percentage' | 'exact';

export type PercentageDisplayMode = 'total' | 'parent' | 'consumption';

export interface Entity {
  id: string;
  name: string;
  level: EntityLevel;
  children?: Entity[];
  consumption: number; // kWh
  renewableEnergy: number; // kWh
  allocation?: {
    strategy: AllocationStrategy;
    values?: Record<string, number>; // childId -> value (percentage or exact amount)
  };
}

export interface LevelToggle {
  level: EntityLevel;
  enabled: boolean;
  label: string;
}

