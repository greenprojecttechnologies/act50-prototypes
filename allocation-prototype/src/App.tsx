import { useState } from 'react';
import { Entity, EntityLevel, AllocationStrategy, LevelToggle } from './types/allocation';
import { mockCompanyData } from './data/mockData';
import { mockCustomers, mockProducts, mockCustomProperties, SimpleAllocationItem } from './data/simpleAllocationData';
import { SettingsPanel } from './components/SettingsPanel';
import { AllocationTable } from './components/AllocationTable';
import { SimpleAllocationTable } from './components/SimpleAllocationTable';
import { Button } from './components/ui/button';

const initialLevelToggles: LevelToggle[] = [
  { level: 'region', enabled: true, label: 'Region' },
  { level: 'country', enabled: true, label: 'Country' },
  { level: 'state', enabled: false, label: 'State/Province' },
  { level: 'city', enabled: false, label: 'City' },
  { level: 'facility', enabled: true, label: 'Facility' },
  { level: 'resource', enabled: true, label: 'Resource' },
];

function App() {
  const [levelToggles, setLevelToggles] = useState<LevelToggle[]>(initialLevelToggles);
  const [companyData, setCompanyData] = useState(mockCompanyData);
  const [customers, setCustomers] = useState<SimpleAllocationItem[]>(mockCustomers);
  const [products, setProducts] = useState<SimpleAllocationItem[]>(mockProducts);
  const [customProperties, setCustomProperties] = useState<SimpleAllocationItem[]>(mockCustomProperties);

  const handleToggleLevel = (level: EntityLevel) => {
    setLevelToggles((prev) =>
      prev.map((toggle) =>
        toggle.level === level ? { ...toggle, enabled: !toggle.enabled } : toggle
      )
    );
  };

  const updateEntityRenewableEnergy = (
    entity: Entity,
    entityId: string,
    percentage: number
  ): Entity => {
    if (entity.id === entityId) {
      const newRenewableEnergy = (entity.consumption * percentage) / 100;
      
      // Only propagate to children if this entity uses "balanced" allocation
      // If it uses "percentage" or "exact", children have manual allocations that shouldn't change
      const shouldUpdateChildren = !entity.allocation || entity.allocation.strategy === 'balanced';
      
      // Update this entity and propagate the same percentage to all children (if balanced)
      const updateChildrenRecursively = (children: Entity[]): Entity[] => {
        return children.map((child) => ({
          ...child,
          renewableEnergy: (child.consumption * percentage) / 100,
          children: child.children ? updateChildrenRecursively(child.children) : undefined,
        }));
      };

      return {
        ...entity,
        renewableEnergy: newRenewableEnergy,
        children: shouldUpdateChildren && entity.children ? updateChildrenRecursively(entity.children) : entity.children,
      };
    }

    if (entity.children) {
      return {
        ...entity,
        children: entity.children.map((child) =>
          updateEntityRenewableEnergy(child, entityId, percentage)
        ),
      };
    }

    return entity;
  };

  const handleRenewableEnergyChange = (entityId: string, percentage: number) => {
    setCompanyData((prev) => ({
      ...prev,
      children: prev.children?.map((child) =>
        updateEntityRenewableEnergy(child, entityId, percentage)
      ),
    }));
  };

  const updateEntityAllocation = (
    entity: Entity,
    entityId: string,
    strategy: AllocationStrategy,
    values?: Record<string, number>
  ): Entity => {
    if (entity.id === entityId) {
      return {
        ...entity,
        allocation: {
          strategy,
          values,
        },
      };
    }

    if (entity.children) {
      return {
        ...entity,
        children: entity.children.map((child) =>
          updateEntityAllocation(child, entityId, strategy, values)
        ),
      };
    }

    return entity;
  };

  const handleAllocationChange = (
    entityId: string,
    strategy: AllocationStrategy,
    values?: Record<string, number>
  ) => {
    setCompanyData((prev) => ({
      ...prev,
      children: prev.children?.map((child) =>
        updateEntityAllocation(child, entityId, strategy, values)
      ),
    }));
  };

  const enabledLevels = new Set<EntityLevel>(
    levelToggles.filter((t) => t.enabled).map((t) => t.level)
  );

  // Handlers for simple allocation tables
  const handleCustomerEnergyChange = (itemId: string, percentage: number) => {
    setCustomers((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, renewableEnergy: (item.consumption * percentage) / 100 }
          : item
      )
    );
  };

  const handleProductEnergyChange = (itemId: string, percentage: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, renewableEnergy: (item.consumption * percentage) / 100 }
          : item
      )
    );
  };

  const handleCustomPropertyEnergyChange = (itemId: string, percentage: number) => {
    setCustomProperties((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, renewableEnergy: (item.consumption * percentage) / 100 }
          : item
      )
    );
  };

  // Calculate total renewable energy
  const calculateTotalRenewableEnergy = (entities: Entity[]): number => {
    return entities.reduce((total, entity) => {
      return total + entity.renewableEnergy;
    }, 0);
  };

  const totalRenewableEnergy = companyData.children 
    ? calculateTotalRenewableEnergy(companyData.children)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customize energy bundle</h1>
          <p className="text-muted-foreground">
            Configure renewable energy allocation across your organization
          </p>
        </header>

        <SettingsPanel
          levelToggles={levelToggles}
          onToggleLevel={handleToggleLevel}
        />

        <SimpleAllocationTable
          title="Customers"
          items={customers}
          onRenewableEnergyChange={handleCustomerEnergyChange}
        />

        <SimpleAllocationTable
          title="Products"
          items={products}
          onRenewableEnergyChange={handleProductEnergyChange}
        />

        <SimpleAllocationTable
          title="Custom Properties"
          items={customProperties}
          onRenewableEnergyChange={handleCustomPropertyEnergyChange}
        />

        <AllocationTable
          data={companyData.children || []}
          enabledLevels={enabledLevels}
          onAllocationChange={handleAllocationChange}
          onRenewableEnergyChange={handleRenewableEnergyChange}
        />

        <div className="mt-6 flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
          <span className="text-base font-semibold">Additional renewable energy</span>
          <span className="text-base font-bold">+ {(totalRenewableEnergy / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })} MWh</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" size="lg" className="text-base">
            Back
          </Button>
          <Button size="lg" className="text-base">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;

