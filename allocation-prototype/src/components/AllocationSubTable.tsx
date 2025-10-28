import React, { useState } from 'react';
import { Entity, EntityLevel, AllocationStrategy } from '@/types/allocation';
import { Input } from '@/components/ui/input';
import { AllocationRow } from './AllocationRow';
import { AlertTriangle } from 'lucide-react';

interface AllocationSubTableProps {
  entity: Entity;
  depth: number;
  enabledLevels: Set<EntityLevel>;
  onAllocationChange: (entityId: string, strategy: AllocationStrategy, values?: Record<string, number>) => void;
  onRenewableEnergyChange?: (entityId: string, percentage: number) => void;
}

export const AllocationSubTable: React.FC<AllocationSubTableProps> = ({
  entity,
  depth,
  enabledLevels,
  onAllocationChange,
  onRenewableEnergyChange,
}) => {
  const [strategy, setStrategy] = useState<AllocationStrategy>(
    entity.allocation?.strategy || 'balanced'
  );
  const [allocationValues, setAllocationValues] = useState<Record<string, number>>(
    entity.allocation?.values || {}
  );
  const [draggingChildId, setDraggingChildId] = useState<string | null>(null);

  const indentPx = (depth + 1) * 24;

  // Filter children based on enabled levels
  const getVisibleChildren = (children: Entity[]): Entity[] => {
    const visible: Entity[] = [];
    
    for (const child of children) {
      if (enabledLevels.has(child.level)) {
        visible.push(child);
      } else if (child.children) {
        // Skip this level and include its children
        visible.push(...getVisibleChildren(child.children));
      }
    }
    
    return visible;
  };

  const visibleChildren = entity.children ? getVisibleChildren(entity.children) : [];

  const handleStrategyChange = (newStrategy: AllocationStrategy) => {
    const newValues: Record<string, number> = {};
    
    if (strategy === 'balanced') {
      // Switching from balanced to percentage or exact
      visibleChildren.forEach((child) => {
        if (newStrategy === 'percentage') {
          // Percentage of child's own consumption covered by renewable energy
          newValues[child.id] = child.consumption > 0 ? (child.renewableEnergy / child.consumption) * 100 : 0;
        } else if (newStrategy === 'exact') {
          // For exact amount, use the child's current renewable energy in kWh
          newValues[child.id] = child.renewableEnergy;
        }
      });
    } else if (newStrategy === 'balanced') {
      // Switching to balanced mode - update children to match parent's percentage
      const parentPercentage = entity.consumption > 0 ? (entity.renewableEnergy / entity.consumption) * 100 : 0;
      
      visibleChildren.forEach((child) => {
        if (onRenewableEnergyChange) {
          onRenewableEnergyChange(child.id, parentPercentage);
        }
      });
      
      // Clear allocation values since balanced mode doesn't use them
      setAllocationValues({});
      onAllocationChange(entity.id, newStrategy, {});
      setStrategy(newStrategy);
      return;
    } else if (strategy === 'percentage' && newStrategy === 'exact') {
      // Switching from percentage to exact
      visibleChildren.forEach((child) => {
        const percentage = allocationValues[child.id] || 0;
        // Convert percentage of child's consumption to kWh
        newValues[child.id] = (child.consumption * percentage) / 100;
      });
    } else if (strategy === 'exact' && newStrategy === 'percentage') {
      // Switching from exact to percentage
      visibleChildren.forEach((child) => {
        const exactAmount = allocationValues[child.id] || 0;
        // Convert kWh to percentage of child's own consumption
        newValues[child.id] = child.consumption > 0 ? (exactAmount / child.consumption) * 100 : 0;
      });
    } else {
      // For other transitions or same strategy, keep existing values
      visibleChildren.forEach((child) => {
        newValues[child.id] = allocationValues[child.id] || 0;
      });
    }
    
    setAllocationValues(newValues);
    onAllocationChange(entity.id, newStrategy, newValues);
    setStrategy(newStrategy);
  };

  // Calculate snap points for a child slider
  const getSnapPoints = (childId: string): number[] => {
    const snapPoints: number[] = [];
    const child = visibleChildren.find(c => c.id === childId);
    if (!child || strategy === 'balanced') return snapPoints;
    
    // Snap point 1: Make allocation among siblings (children of this entity) correct
    // Calculate what's currently allocated to other children
    let otherChildrenTotal = 0;
    visibleChildren.forEach((c) => {
      if (c.id !== childId) {
        if (strategy === 'percentage') {
          otherChildrenTotal += (c.consumption * (allocationValues[c.id] || 0)) / 100;
        } else if (strategy === 'exact') {
          otherChildrenTotal += (allocationValues[c.id] || 0);
        }
      }
    });
    
    // Calculate what this child needs to make total equal parent's renewable energy
    const remainingEnergy = entity.renewableEnergy - otherChildrenTotal;
    const siblingSnapPercentage = child.consumption > 0 ? (remainingEnergy / child.consumption) * 100 : 0;
    
    if (siblingSnapPercentage >= 0 && siblingSnapPercentage <= 100) {
      snapPoints.push(siblingSnapPercentage);
    }
    
    // Snap point 2: Make allocation among this child's children correct
    // Only calculate if the child has manual allocation for its own children
    if (child.children && child.children.length > 0 && child.allocation &&
        (child.allocation.strategy === 'percentage' || child.allocation.strategy === 'exact')) {
      
      const childAllocationValues = child.allocation.values || {};
      let grandchildrenTotal = 0;
      
      if (child.allocation.strategy === 'percentage') {
        // Get visible grandchildren
        const visibleGrandchildren = getVisibleChildren(child.children);
        grandchildrenTotal = visibleGrandchildren.reduce((sum, grandchild) => {
          const percentage = childAllocationValues[grandchild.id] || 0;
          return sum + (grandchild.consumption * percentage) / 100;
        }, 0);
      } else if (child.allocation.strategy === 'exact') {
        const visibleGrandchildren = getVisibleChildren(child.children);
        grandchildrenTotal = visibleGrandchildren.reduce((sum, grandchild) => {
          return sum + (childAllocationValues[grandchild.id] || 0);
        }, 0);
      }
      
      const childrenSnapPercentage = child.consumption > 0 ? (grandchildrenTotal / child.consumption) * 100 : 0;
      
      console.log(`[${child.name}] Snap point 2 (children correct):`, {
        strategy: child.allocation.strategy,
        values: childAllocationValues,
        grandchildrenTotal,
        childConsumption: child.consumption,
        childrenSnapPercentage
      });
      
      if (childrenSnapPercentage >= 0 && childrenSnapPercentage <= 100) {
        snapPoints.push(childrenSnapPercentage);
      }
    }
    
    return snapPoints;
  };
  
  // Apply snapping if value is close to any snap point (within ~3% on a 0-100 scale)
  const applySnapping = (childId: string, value: number): number => {
    const snapPoints = getSnapPoints(childId);
    const snapThreshold = 3; // ~3% threshold (6px radius on typical slider)
    
    // Find the closest snap point within threshold
    for (const snapPoint of snapPoints) {
      if (Math.abs(value - snapPoint) <= snapThreshold) {
        return snapPoint;
      }
    }
    
    return value;
  };

  const handleValueChange = (childId: string, value: number) => {
    // Apply snapping
    const snappedValue = applySnapping(childId, value);
    
    // Auto-switch to percentage mode when user changes a value
    if (strategy === 'balanced') {
      setStrategy('percentage');
      
      // Initialize all children with their current percentages
      const newValues: Record<string, number> = {};
      visibleChildren.forEach((child) => {
        if (child.id === childId) {
          newValues[child.id] = snappedValue;
        } else {
          // Keep other children at their current percentage
          newValues[child.id] = child.consumption > 0 ? (child.renewableEnergy / child.consumption) * 100 : 0;
        }
      });
      
      setAllocationValues(newValues);
      onAllocationChange(entity.id, 'percentage', newValues);
      
      // Update the child's renewable energy
      if (onRenewableEnergyChange) {
        onRenewableEnergyChange(childId, snappedValue);
      }
    } else {
      const newValues = { ...allocationValues, [childId]: snappedValue };
      setAllocationValues(newValues);
      onAllocationChange(entity.id, strategy, newValues);
      
      // Update the child's renewable energy based on strategy
      if (onRenewableEnergyChange) {
        if (strategy === 'percentage') {
          onRenewableEnergyChange(childId, snappedValue);
        } else if (strategy === 'exact') {
          // Find the child to get its consumption
          const child = visibleChildren.find(c => c.id === childId);
          if (child && child.consumption > 0) {
            // Convert kWh value to percentage
            const percentage = (snappedValue / child.consumption) * 100;
            onRenewableEnergyChange(childId, percentage);
          }
        }
      }
    }
  };

  const calculateTotal = (): number => {
    if (strategy === 'balanced') {
      // In balanced mode, sum up the actual renewable energy from all visible children
      return visibleChildren.reduce((sum, child) => sum + child.renewableEnergy, 0);
    }
    
    if (strategy === 'percentage') {
      // In percentage mode, sum up the kWh allocated to each child based on their consumption percentages
      return visibleChildren.reduce((sum, child) => {
        const percentage = allocationValues[child.id] || 0;
        return sum + (child.consumption * percentage) / 100;
      }, 0);
    }
    
    if (strategy === 'exact') {
      return Object.values(allocationValues).reduce((sum, val) => sum + val, 0);
    }
    
    return 0;
  };

  const total = calculateTotal();
  // Show warning if allocated amount doesn't match parent's renewable energy (within 1 kWh tolerance)
  const isPercentageValid = strategy === 'percentage' ? Math.abs(total - entity.renewableEnergy) < 1 : true;
  const isExactValid = strategy === 'exact' ? Math.abs(total - entity.renewableEnergy) < 1 : true;

  return (
    <div className="bg-muted/30 border-l-4 border-primary/30">
      {/* Allocation Strategy Header - only show if more than one child */}
      {visibleChildren.length > 1 && (
        <div
          className="flex items-center gap-4 py-3 border-b bg-muted/50"
          style={{ paddingLeft: `${indentPx}px`, paddingRight: '1rem' }}
        >
          <span className="text-sm font-semibold ml-4">Allocation Strategy:</span>

          {/* Segmented Control */}
          <div className="inline-flex rounded-lg border border-border bg-background p-1">
            <button
              onClick={() => handleStrategyChange('balanced')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                strategy === 'balanced'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Balanced
            </button>
            <button
              onClick={() => handleStrategyChange('percentage')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                strategy === 'percentage'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              By Percentage
            </button>
            <button
              onClick={() => handleStrategyChange('exact')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                strategy === 'exact'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              By Exact Amount
            </button>
          </div>

          <div className="ml-auto flex flex-col items-end">
            <div className="flex items-center gap-2">
              {((strategy === 'percentage' && !isPercentageValid) || 
                (strategy === 'exact' && !isExactValid)) && (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span className={`text-sm ${
                (strategy === 'percentage' && !isPercentageValid) || 
                (strategy === 'exact' && !isExactValid)
                  ? 'text-yellow-600 font-semibold'
                  : 'text-muted-foreground'
              }`}>
                {((strategy === 'percentage' && !isPercentageValid) || (strategy === 'exact' && !isExactValid))
                  ? (total > entity.renewableEnergy ? 'Overallocation:' : 'Underallocation:')
                  : 'Allocated:'}
              </span>
              <span className={`text-sm font-semibold ${
                (strategy === 'percentage' && !isPercentageValid) || 
                (strategy === 'exact' && !isExactValid)
                  ? 'text-yellow-600'
                  : 'text-foreground'
              }`}>
                {(total / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })} MWh
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              of {(entity.renewableEnergy / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })} MWh
            </span>
          </div>
        </div>
      )}

      {/* Children rows with allocation inputs - using table structure */}
      <table className="w-full">
        <tbody>
          {visibleChildren.map((child) => (
            <AllocationRow
              key={child.id}
              entity={child}
              depth={depth + 1}
              enabledLevels={enabledLevels}
              parentRenewableEnergy={entity.renewableEnergy}
              onAllocationChange={onAllocationChange}
              onRenewableEnergyChange={onRenewableEnergyChange}
              allocationInput={
                strategy === 'balanced' ? (
                  <>
                    <div className="relative" style={{ width: '200px' }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={child.consumption > 0 ? (child.renewableEnergy / child.consumption) * 100 : 0}
                        onChange={(e) => handleValueChange(child.id, parseFloat(e.target.value) || 0)}
                        onMouseDown={() => setDraggingChildId(child.id)}
                        onMouseUp={() => setDraggingChildId(null)}
                        onTouchStart={() => setDraggingChildId(child.id)}
                        onTouchEnd={() => setDraggingChildId(null)}
                        className="range-slider opacity-50"
                        style={{
                          width: '200px',
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${child.consumption > 0 ? (child.renewableEnergy / child.consumption) * 100 : 0}%, hsl(var(--muted)) ${child.consumption > 0 ? (child.renewableEnergy / child.consumption) * 100 : 0}%, hsl(var(--muted)) 100%)`
                        }}
                      />
                      {/* Snap point indicators - only show while dragging */}
                      {draggingChildId === child.id && getSnapPoints(child.id).map((snapPoint, idx) => {
                        const currentPercentage = child.consumption > 0 ? (child.renewableEnergy / child.consumption) * 100 : 0;
                        const isAtSnapPoint = Math.abs(currentPercentage - snapPoint) < 0.5;
                        if (isAtSnapPoint) return null;
                        
                        return (
                          <div
                            key={idx}
                            className="absolute pointer-events-none"
                            style={{ 
                              left: `calc(${snapPoint}% + 2px)`,
                              top: `calc(50% + 2px)`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          </div>
                        );
                      })}
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={(child.consumption > 0 ? (child.renewableEnergy / child.consumption) * 100 : 0).toFixed(1)}
                      onChange={(e) => handleValueChange(child.id, parseFloat(e.target.value) || 0)}
                      className="w-24 text-right text-muted-foreground"
                    />
                    <span className="text-sm text-muted-foreground w-8">%</span>
                  </>
                ) : (
                  <>
                    <div className="relative" style={{ width: '200px' }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={
                          strategy === 'percentage' 
                            ? (allocationValues[child.id] || 0)
                            : (child.consumption > 0 ? ((allocationValues[child.id] || 0) / child.consumption) * 100 : 0)
                        }
                        onChange={(e) => {
                          const sliderValue = parseFloat(e.target.value) || 0;
                          if (strategy === 'percentage') {
                            handleValueChange(child.id, sliderValue);
                          } else {
                            // In exact mode, apply snapping to percentage first, then convert to kWh
                            const snappedPercentage = applySnapping(child.id, sliderValue);
                            const snappedKwh = (child.consumption * snappedPercentage) / 100;
                            
                            const newValues = { ...allocationValues, [child.id]: snappedKwh };
                            setAllocationValues(newValues);
                            onAllocationChange(entity.id, strategy, newValues);
                            
                            if (onRenewableEnergyChange) {
                              onRenewableEnergyChange(child.id, snappedPercentage);
                            }
                          }
                        }}
                        onMouseDown={() => setDraggingChildId(child.id)}
                        onMouseUp={() => setDraggingChildId(null)}
                        onTouchStart={() => setDraggingChildId(child.id)}
                        onTouchEnd={() => setDraggingChildId(null)}
                        className="range-slider"
                        style={{
                          width: '200px',
                          background: (() => {
                            const percentage = strategy === 'percentage' 
                              ? (allocationValues[child.id] || 0)
                              : (child.consumption > 0 ? ((allocationValues[child.id] || 0) / child.consumption) * 100 : 0);
                            return `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`;
                          })()
                        }}
                      />
                      {/* Snap point indicators - only show while dragging */}
                      {draggingChildId === child.id && getSnapPoints(child.id).map((snapPoint, idx) => {
                        const currentPercentage = strategy === 'percentage' 
                          ? (allocationValues[child.id] || 0)
                          : (child.consumption > 0 ? ((allocationValues[child.id] || 0) / child.consumption) * 100 : 0);
                        const isAtSnapPoint = Math.abs(currentPercentage - snapPoint) < 0.5;
                        if (isAtSnapPoint) return null;
                        
                        return (
                          <div
                            key={idx}
                            className="absolute pointer-events-none"
                            style={{ 
                              left: `calc(${snapPoint}% + 2px)`,
                              top: `calc(50% + 2px)`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          </div>
                        );
                      })}
                    </div>
                    <Input
                      type="number"
                      min="0"
                      max={strategy === 'percentage' ? 100 : child.consumption / 1000}
                      step="0.1"
                      value={strategy === 'percentage' ? (allocationValues[child.id] || 0).toFixed(1) : ((allocationValues[child.id] || 0) / 1000).toFixed(1)}
                      onChange={(e) => {
                        const inputValue = parseFloat(e.target.value) || 0;
                        if (strategy === 'percentage') {
                          handleValueChange(child.id, inputValue);
                        } else {
                          // In exact mode, input is MWh, convert to kWh
                          handleValueChange(child.id, inputValue * 1000);
                        }
                      }}
                      className="w-24 text-right"
                    />
                    <span className="text-sm text-muted-foreground w-8">
                      {strategy === 'percentage' ? '%' : 'MWh'}
                    </span>
                  </>
                )
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

